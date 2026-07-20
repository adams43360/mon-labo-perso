import { describe, expect, it } from "vitest";
import { loadDataset } from "../src/dataset.js";
import { mockClassify } from "../src/providers.js";
import { CATEGORIES } from "../src/types.js";

describe("dataset", () => {
  const ds = loadDataset();

  it("contient exactement 50 cas", () => {
    expect(ds.cases).toHaveLength(50);
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

  it("contient une part significative de cas pièges (≥ 25%)", () => {
    const pieges = ds.cases.filter((c) => c.difficulte === "piege").length;
    expect(pieges / ds.cases.length).toBeGreaterThanOrEqual(0.25);
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

  it("dépasse largement le hasard (> 50% vs ~17% aléatoire) sans être parfait", () => {
    const correct = ds.cases.filter((c) => mockClassify(c.message) === c.expected).length;
    const acc = correct / ds.cases.length;
    expect(acc).toBeGreaterThan(0.5);
    expect(acc).toBeLessThan(1);
  });
});
