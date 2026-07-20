export const CATEGORIES = [
  "candidature",
  "relance",
  "desistement",
  "demande_info",
  "remerciement",
  "hors_sujet",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Case {
  id: number;
  message: string;
  expected: Category;
  difficulte: "facile" | "piege";
}

export interface Dataset {
  categories: readonly string[];
  cases: Case[];
}

export interface CaseResult {
  id: number;
  expected: Category;
  /** Réponse brute du modèle, avant normalisation. */
  raw: string;
  /** Réponse normalisée (ou null si inclassable). */
  predicted: Category | null;
  correct: boolean;
  difficulte: "facile" | "piege";
}

export interface RunResult {
  provider: string;
  model: string;
  date: string;
  results: CaseResult[];
}

/** Paramètres d'appel figés — répliqués à l'identique dans promptfoo et DeepEval. */
export const CALL_PARAMS = {
  temperature: 0,
  maxTokens: 10,
} as const;
