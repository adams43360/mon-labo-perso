import { CALL_PARAMS } from "./types.js";

export type ProviderName = "anthropic" | "openai" | "mock";

export interface Provider {
  name: ProviderName;
  model: string;
  classify(system: string, message: string): Promise<string>;
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
    async classify(system, message) {
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
          messages: [{ role: "user", content: message }],
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
    async classify(system, message) {
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
            { role: "user", content: message },
          ],
        }),
      });
      if (!res.ok) throw new Error(`OpenAI ${res.status} : ${await res.text()}`);
      const data = (await res.json()) as {
        choices: { message: { content: string | null } }[];
      };
      return data.choices[0]?.message.content ?? "";
    },
  };
}

/**
 * Classifieur heuristique local et déterministe. Il se trompe volontiers sur les
 * pièges (comme un vrai modèle faible) : parfait pour développer le harness et
 * générer des rapports réalistes sans clé API.
 */
export function mockClassify(message: string): string {
  const m = message.toLowerCase();
  const any = (...words: string[]) => words.some((w) => m.includes(w));

  // Naïf par construction : un message qui commence par "merci" est pris pour un
  // remerciement — c'est exactement le piège que le dataset tend (cas 15, 22…).
  if (m.startsWith("merci")) return "remerciement";
  if (any("retire ma candidature", "me désiste", "ne pas donner suite", "mettre fin", "ne poursuivrai pas", "m'arrêter là", "plus en recherche")) return "desistement";
  if (any("relance", "sans nouvelles", "revenir vers vous", "où en était", "tenir informé", "avancer sur votre décision", "dans l'attente de votre retour")) return "relance";
  if (any("cliquez", "facture", "identifiants", "stand", "questionnaire", "journaliste", "agence", "sirh", "nos solutions", "gagner")) return "hors_sujet";
  if (any("ci-joint mon cv", "je joins mon cv", "cv est en pièce jointe", "candidature spontanée", "je postule", "dossier de candidature", "cv à jour", "prétentions", "je vous joins mon dossier", "mon cv sont joints")) return "candidature";
  if (any("merci", "remercie")) return "remerciement";
  return "demande_info";
}

function mockProvider(): Provider {
  return {
    name: "mock",
    model: DEFAULT_MODELS.mock,
    async classify(_system, message) {
      return mockClassify(message);
    },
  };
}
