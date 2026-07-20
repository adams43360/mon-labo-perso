import { StructuredReportSchema, type StructuredReport } from "./types.js";

/**
 * Extrait et valide un StructuredReport depuis la réponse brute d'un LLM.
 * Tolère les blocs de code markdown (```json ... ```) que certains modèles
 * ajoutent malgré la consigne "réponds uniquement avec du JSON".
 */
export function parseStructuredReport(raw: string): StructuredReport {
  const cleaned = stripCodeFence(raw.trim());
  let json: unknown;
  try {
    json = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`JSON invalide : ${(e as Error).message}\n--- réponse brute ---\n${raw.slice(0, 500)}`);
  }
  const result = StructuredReportSchema.safeParse(json);
  if (!result.success) {
    throw new Error(`Schéma invalide : ${result.error.message}\n--- JSON reçu ---\n${cleaned.slice(0, 500)}`);
  }
  return result.data;
}

function stripCodeFence(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return match ? match[1]! : text;
}
