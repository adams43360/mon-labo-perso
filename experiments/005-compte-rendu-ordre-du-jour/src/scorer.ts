import { CATEGORIES, type CaseResult, type Category } from "./types.js";

/**
 * Normalise une réponse de modèle vers une catégorie, ou null si inclassable.
 * Identique à la logique de l'expérience 004 (cf. ARCHITECTURE.md de 004).
 */
export function normalize(raw: string): Category | null {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/["'`«».,;:!]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if ((CATEGORIES as readonly string[]).includes(cleaned)) return cleaned as Category;
  const found = CATEGORIES.filter((c) => cleaned.includes(c));
  return found.length === 1 ? (found[0] as Category) : null;
}

export function accuracy(results: CaseResult[]): number {
  if (results.length === 0) return 0;
  return results.filter((r) => r.correct).length / results.length;
}

export function accuracyBy(results: CaseResult[], difficulte: "facile" | "piege"): number {
  return accuracy(results.filter((r) => r.difficulte === difficulte));
}

/** Matrice de confusion : confusion[attendu][prédit] = nombre de cas. */
export function confusionMatrix(results: CaseResult[]): Record<string, Record<string, number>> {
  const matrix: Record<string, Record<string, number>> = {};
  for (const expected of CATEGORIES) {
    matrix[expected] = {};
    for (const predicted of [...CATEGORIES, "inclassable"]) {
      matrix[expected][predicted] = 0;
    }
  }
  for (const r of results) {
    const row = matrix[r.expected]!;
    const col = r.predicted ?? "inclassable";
    row[col] = (row[col] ?? 0) + 1;
  }
  return matrix;
}
