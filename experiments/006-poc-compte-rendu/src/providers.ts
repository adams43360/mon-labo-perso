import { CALL_PARAMS } from "./types.js";

export type ProviderName = "anthropic" | "openai";

const DEFAULT_MODELS: Record<ProviderName, string> = {
  anthropic: "claude-haiku-4-5-20251001",
  openai: "gpt-4o-mini",
};

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Variable d'environnement manquante : ${key}`);
  return v;
}

export function resolveModel(name: ProviderName, model?: string): string {
  return model ?? DEFAULT_MODELS[name];
}

export async function complete(
  name: ProviderName,
  model: string,
  system: string,
  userContent: string,
  maxTokens: number,
): Promise<string> {
  if (name === "anthropic") {
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
        max_tokens: maxTokens,
        temperature: CALL_PARAMS.temperature,
        messages: [{ role: "user", content: userContent }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status} : ${await res.text()}`);
    const data = (await res.json()) as { content: { text?: string }[] };
    return data.content[0]?.text ?? "";
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${requireEnv("OPENAI_API_KEY")}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
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
}
