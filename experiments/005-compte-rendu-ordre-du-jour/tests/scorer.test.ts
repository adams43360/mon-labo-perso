import { describe, expect, it } from "vitest";
import { normalize, accuracy, accuracyBy, confusionMatrix } from "../src/scorer.js";
import type { CaseResult } from "../src/types.js";

describe("normalize", () => {
  it("accepte une réponse exacte", () => {
    expect(normalize("roadmap")).toBe("roadmap");
  });

  it("nettoie casse, espaces, ponctuation et guillemets", () => {
    expect(normalize('  "Budget". ')).toBe("budget");
    expect(normalize("« divers »")).toBe("divers");
    expect(normalize("HORS_ORDRE_DU_JOUR !")).toBe("hors_ordre_du_jour");
  });

  it("rejette une réponse ambiguë ou hors vocabulaire", () => {
    expect(normalize("budget ou risques")).toBeNull();
    expect(normalize("aucune idée")).toBeNull();
  });
});

function fake(partial: Partial<CaseResult>[]): CaseResult[] {
  return partial.map((p, i) => ({
    id: i + 1,
    expected: "budget",
    raw: "",
    predicted: "budget",
    correct: true,
    difficulte: "facile",
    ...p,
  }));
}

describe("accuracy", () => {
  it("calcule le ratio de cas corrects et filtre par difficulté", () => {
    const results = fake([
      { correct: true, difficulte: "facile" },
      { correct: false, difficulte: "piege" },
      { correct: true, difficulte: "piege" },
    ]);
    expect(accuracy(results)).toBeCloseTo(2 / 3);
    expect(accuracyBy(results, "facile")).toBe(1);
    expect(accuracyBy(results, "piege")).toBe(0.5);
  });
});

describe("confusionMatrix", () => {
  it("compte les prédictions par couple attendu/prédit, y compris inclassable", () => {
    const results = fake([
      { expected: "risques", predicted: "roadmap", correct: false },
      { expected: "divers", predicted: null, correct: false },
    ]);
    const m = confusionMatrix(results);
    expect(m["risques"]!["roadmap"]).toBe(1);
    expect(m["divers"]!["inclassable"]).toBe(1);
  });
});
