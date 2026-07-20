import { CALL_PARAMS } from "./types.js";

export type ProviderName = "anthropic" | "openai" | "mock";

export interface Provider {
  name: ProviderName;
  model: string;
  classify(system: string, userContent: string): Promise<string>;
}

const DEFAULT_MODELS: Record<ProviderName, string> = {
  anthropic: "claude-haiku-4-5-20251001",
  openai: "gpt-4o-mini",
  mock: "heuristique-mots-cles",
};

export function createProvider(name: ProviderName, model?: string): Provider {
  const m = model ?? DEFAULT_MODELS[name];
  switch (name) {
    case "anthropic":
      return anthropicProvider(m);
    case "openai":
      return openaiProvider(m);
    case "mock":
      return mockProvider();
  }
}

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Variable d'environnement manquante : ${key}`);
  return v;
}

function anthropicProvider(model: string): Provider {
  return {
    name: "anthropic",
    model,
    async classify(system, userContent) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": requireEnv("ANTHROPIC_API_KEY"),
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          system,
          max_tokens: CALL_PARAMS.maxTokens,
          temperature: CALL_PARAMS.temperature,
          messages: [{ role: "user", content: userContent }],
        }),
      });
      if (!res.ok) throw new Error(`Anthropic ${res.status} : ${await res.text()}`);
      const data = (await res.json()) as { content: { text?: string }[] };
      return data.content[0]?.text ?? "";
    },
  };
}

function openaiProvider(model: string): Provider {
  return {
    name: "openai",
    model,
    async classify(system, userContent) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${requireEnv("OPENAI_API_KEY")}`,
        },
        body: JSON.stringify({
          model,
          max_tokens: CALL_PARAMS.maxTokens,
          temperature: CALL_PARAMS.temperature,
          messages: [
            { role: "system", content: system },
            { role: "user", content: userContent },
          ],
        }),
      });
      if (!res.ok) throw new Error(`OpenAI ${res.status} : ${await res.text()}`);
      const data = (await res.json()) as { choices: { message: { content: string | null } }[] };
      return data.choices[0]?.message.content ?? "";
    },
  };
}

/**
 * Classifieur heuristique local et déterministe (mots-clés). Comme en 004, il sert
 * à développer/tester le harness sans clé API. Il ignore volontairement le bloc en
 * cours (contrairement à un vrai LLM, il ne "sait" pas resituer une reprise tardive) :
 * on s'attend donc à ce qu'il échoue sur la plupart des pièges de type "reprise" —
 * ce qui est un comportement correct pour un mock, pas un bug.
 */
export function mockClassify(message: string): string {
  const m = message.toLowerCase();
  const any = (...words: string[]) => words.some((w) => m.includes(w));

  if (any("budget", "enveloppe", "coût", "dépense", "dépassement", "infra cloud")) return "budget";
  if (any("recrutement", "candidat", "poste", "entretien", "chasse", "alternante", "embauche", "salariale")) return "recrutement";
  if (any("roadmap", "trimestre prochain", "priorité", "chantier data", "migration", "feature", "internationalisation")) return "roadmap";
  if (any("risque", "dépendance", "continuité", "turnover", "panne", "juridique")) return "risques";
  if (any("séminaire", "comité de direction", "certification", "invités", "événement client")) return "divers";
  return "hors_ordre_du_jour";
}

function mockProvider(): Provider {
  return {
    name: "mock",
    model: DEFAULT_MODELS.mock,
    async classify(_system, userContent) {
      // Le mock ignore le préfixe "Bloc en cours : ..." et ne regarde que l'intervention.
      const message = userContent.split("Intervention : ")[1] ?? userContent;
      return mockClassify(message);
    },
  };
}
