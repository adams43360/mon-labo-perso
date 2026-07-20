export const CATEGORIES = [
  "budget",
  "recrutement",
  "roadmap",
  "risques",
  "divers",
  "hors_ordre_du_jour",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface AgendaItem {
  bloc: Category;
  intitule: string;
}

export interface Case {
  id: number;
  /** Bloc officiellement en cours de discussion au moment de l'intervention. */
  blocEnCours: Category;
  message: string;
  expected: Category;
  difficulte: "facile" | "piege";
}

export interface Dataset {
  categories: readonly string[];
  ordreDuJour: AgendaItem[];
  cases: Case[];
}

export interface CaseResult {
  id: number;
  expected: Category;
  raw: string;
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

/** Paramètres d'appel figés — mêmes conventions que l'expérience 004. */
export const CALL_PARAMS = {
  temperature: 0,
  maxTokens: 10,
} as const;
