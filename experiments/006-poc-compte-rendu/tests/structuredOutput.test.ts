import { describe, expect, it } from "vitest";
import { parseStructuredReport } from "../src/structuredOutput.js";

const VALID = {
  parBloc: {
    budget: ["Consommation à 62% du budget."],
    recrutement: [],
    roadmap: [],
    risques: [],
    divers: [],
  },
  horsOrdreDuJour: ["La salle du 2ème est climatisée."],
};

describe("parseStructuredReport", () => {
  it("parse un JSON valide et bien formé", () => {
    const result = parseStructuredReport(JSON.stringify(VALID));
    expect(result.parBloc.budget).toHaveLength(1);
    expect(result.horsOrdreDuJour).toHaveLength(1);
  });

  it("tolère un bloc de code markdown autour du JSON", () => {
    const raw = "Voici le résultat :\n```json\n" + JSON.stringify(VALID) + "\n```";
    const result = parseStructuredReport(raw);
    expect(result.parBloc.budget).toHaveLength(1);
  });

  it("rejette un JSON syntaxiquement invalide", () => {
    expect(() => parseStructuredReport("{ pas du json valide")).toThrow(/JSON invalide/);
  });

  it("rejette un JSON valide mais qui ne respecte pas le schéma (clé manquante)", () => {
    const incomplete = { parBloc: { budget: [] } }; // il manque recrutement, roadmap, risques, divers, horsOrdreDuJour
    expect(() => parseStructuredReport(JSON.stringify(incomplete))).toThrow(/Schéma invalide/);
  });

  it("rejette un JSON dont les valeurs ne sont pas des tableaux de strings", () => {
    const wrongTypes = { ...VALID, parBloc: { ...VALID.parBloc, budget: "pas un tableau" } };
    expect(() => parseStructuredReport(JSON.stringify(wrongTypes))).toThrow(/Schéma invalide/);
  });
});
