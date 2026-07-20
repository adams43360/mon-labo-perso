import { describe, expect, it } from "vitest";
import { buildComparisonHtml } from "../src/report-html.js";
import type { AgendaItem, StructuredReport } from "../src/types.js";

const agenda: AgendaItem[] = [
  { bloc: "budget", intitule: "Suivi budgétaire" },
  { bloc: "recrutement", intitule: "Recrutement" },
  { bloc: "roadmap", intitule: "Roadmap" },
  { bloc: "risques", intitule: "Risques" },
  { bloc: "divers", intitule: "Divers" },
];

const structured: StructuredReport = {
  parBloc: {
    budget: ["Consommation à 62% du budget, cohérent avec le planning."],
    recrutement: [],
    roadmap: ["Priorité : refonte du module de facturation."],
    risques: [],
    divers: [],
  },
  horsOrdreDuJour: ["La salle du 2ème est climatisée."],
};

describe("buildComparisonHtml", () => {
  const html = buildComparisonHtml({
    provider: "anthropic",
    model: "claude-haiku-4-5-20251001",
    date: "2026-07-21",
    agenda,
    flatSummary: "On a parlé budget, recrutement, roadmap, et de la clim de la salle du 2ème.",
    structured,
  });

  it("produit un document HTML valide avec le titre et les métadonnées", () => {
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("anthropic");
    expect(html).toContain("claude-haiku-4-5-20251001");
    expect(html).toContain("2026-07-21");
  });

  it("inclut le résumé plat tel quel", () => {
    expect(html).toContain("la clim de la salle du 2ème");
  });

  it("inclut les points de chaque bloc non vide", () => {
    expect(html).toContain("Consommation à 62% du budget");
    expect(html).toContain("refonte du module de facturation");
  });

  it("affiche un message pour les blocs vides plutôt que rien", () => {
    expect(html).toContain("Rien à signaler dans ce bloc.");
  });

  it("inclut la section hors ordre du jour quand elle n'est pas vide", () => {
    expect(html).toContain("Hors ordre du jour");
    expect(html).toContain("climatisée");
  });

  it("échappe le HTML pour éviter toute injection depuis le contenu généré", () => {
    const malicious = buildComparisonHtml({
      provider: "anthropic",
      model: "m",
      date: "2026-07-21",
      agenda,
      flatSummary: "<script>alert(1)</script>",
      structured: { ...structured, parBloc: { ...structured.parBloc, budget: ["<img src=x>"] } },
    });
    expect(malicious).not.toContain("<script>alert(1)</script>");
    expect(malicious).toContain("&lt;script&gt;");
  });
});
