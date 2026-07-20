import { describe, expect, it } from "vitest";
import { normalize, accuracy, accuracyBy, confusionMatrix } from "../src/scorer.js";
import type { CaseResult } from "../src/types.js";

describe("normalize", () => {
  it("accepte une réponse exacte", () => {
    expect(normalize("relance")).toBe("relance");
  });

  it("nettoie casse, espaces, ponctuation et guillemets", () => {
    expect(normalize('  "Relance". ')).toBe("relance");
    expect(normalize("« desistement »")).toBe("desistement");
    expect(normalize("HORS_SUJET !")).toBe("hors_sujet");
  });

  it("extrait la catégorie d'une réponse verbeuse si elle est unique", () => {
    expect(normalize("catégorie : demande_info")).toBe("demande_info");
  });

  it("rejette une réponse ambiguë (plusieurs catégories)", () => {
    expect(normalize("relance ou remerciement")).toBeNull();
  });

  it("rejette une réponse hors vocabulaire", () => {
    expect(normalize("spam")).toBeNull();
    expect(normalize("")).toBeNull();
  });
});

function fake(partial: Partial<CaseResult>[]): CaseResult[] {
  return partial.map((p, i) => ({
    id: i + 1,
    expected: "relance",
    raw: "",
    predicted: "relance",
    correct: true,
    difficulte: "facile",
    ...p,
  }));
}

describe("accuracy", () => {
  it("calcule le ratio de cas corrects", () => {
    const results = fake([{ correct: true }, { correct: true }, { correct: false }, { correct: false }]);
    expect(accuracy(results)).toBe(0.5);
  });

  it("retourne 0 sur un tableau vide", () => {
    expect(accuracy([])).toBe(0);
  });

  it("filtre par difficulté", () => {
    const results = fake([
      { correct: true, difficulte: "facile" },
      { correct: false, difficulte: "piege" },
      { correct: false, difficulte: "piege" },
    ]);
    expect(accuracyBy(results, "facile")).toBe(1);
    expect(accuracyBy(results, "piege")).toBe(0);
  });
});

describe("confusionMatrix", () => {
  it("compte les prédictions par couple attendu/prédit", () => {
    const results = fake([
      { expected: "relance", predicted: "relance" },
      { expected: "relance", predicted: "remerciement", correct: false },
      { expected: "desistement", predicted: null, correct: false },
    ]);
    const m = confusionMatrix(results);
    expect(m["relance"]!["relance"]).toBe(1);
    expect(m["relance"]!["remerciement"]).toBe(1);
    expect(m["desistement"]!["inclassable"]).toBe(1);
    expect(m["candidature"]!["candidature"]).toBe(0);
  });
});
