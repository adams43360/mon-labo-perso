import { describe, expect, it } from "vitest";
import { loadDataset, formatUserContent } from "../src/dataset.js";
import { mockClassify } from "../src/providers.js";
import { CATEGORIES } from "../src/types.js";

describe("dataset", () => {
  const ds = loadDataset();

  it("contient exactement 40 cas", () => {
    expect(ds.cases).toHaveLength(40);
  });

  it("a des ids uniques et des catégories valides (validé au chargement)", () => {
    expect(() => loadDataset()).not.toThrow();
  });

  it("couvre les 6 catégories, chacune avec au moins 5 cas", () => {
    for (const cat of CATEGORIES) {
      const count = ds.cases.filter((c) => c.expected === cat).length;
      expect(count, `catégorie ${cat}`).toBeGreaterThanOrEqual(5);
    }
  });

  it("contient au moins 30% de cas pièges", () => {
    const pieges = ds.cases.filter((c) => c.difficulte === "piege").length;
    expect(pieges / ds.cases.length).toBeGreaterThanOrEqual(0.3);
  });

  it("l'ordre du jour couvre les 5 blocs officiels (hors hors_ordre_du_jour)", () => {
    expect(ds.ordreDuJour.map((a) => a.bloc).sort()).toEqual(
      ["budget", "divers", "recrutement", "risques", "roadmap"].sort(),
    );
  });

  it("les pièges de type reprise ont un blocEnCours différent de l'attendu", () => {
    const pieges = ds.cases.filter((c) => c.difficulte === "piege");
    const reprises = pieges.filter((c) => c.blocEnCours !== c.expected);
    // La majorité des pièges doivent illustrer un décalage bloc en cours / contenu réel
    expect(reprises.length).toBeGreaterThanOrEqual(pieges.length - 2);
  });
});

describe("formatUserContent", () => {
  it("inclut le bloc en cours et le message", () => {
    const content = formatUserContent("risques", "Un exemple de message.");
    expect(content).toContain("Bloc en cours : risques");
    expect(content).toContain("Un exemple de message.");
  });
});

describe("provider mock (heuristique)", () => {
  const ds = loadDataset();

  it("retourne toujours une catégorie valide", () => {
    for (const c of ds.cases) {
      expect(CATEGORIES).toContain(mockClassify(c.message));
    }
  });

  it("est déterministe", () => {
    for (const c of ds.cases.slice(0, 10)) {
      expect(mockClassify(c.message)).toBe(mockClassify(c.message));
    }
  });

  it("fait mieux que le hasard sur les cas faciles (le mock ignore le bloc en cours, donc pas de garantie sur les pièges)", () => {
    const faciles = ds.cases.filter((c) => c.difficulte === "facile");
    const correct = faciles.filter((c) => mockClassify(c.message) === c.expected).length;
    expect(correct / faciles.length).toBeGreaterThan(0.5);
  });
});
