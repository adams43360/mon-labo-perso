import { BLOCS, type AgendaItem, type StructuredReport } from "./types.js";

const BLOC_LABELS: Record<(typeof BLOCS)[number], string> = {
  budget: "Budget",
  recrutement: "Recrutement",
  roadmap: "Roadmap",
  risques: "Risques",
  divers: "Divers",
};

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function buildComparisonHtml(params: {
  provider: string;
  model: string;
  date: string;
  agenda: AgendaItem[];
  flatSummary: string;
  structured: StructuredReport;
}): string {
  const { provider, model, date, flatSummary, structured } = params;

  const structuredSections = BLOCS.map((bloc) => {
    const points = structured.parBloc[bloc];
    const items = points.length
      ? `<ul>${points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`
      : `<p class="empty">Rien à signaler dans ce bloc.</p>`;
    return `<section class="bloc"><h3>${esc(BLOC_LABELS[bloc])}</h3>${items}</section>`;
  }).join("\n");

  const horsSection = structured.horsOrdreDuJour.length
    ? `<section class="bloc hors"><h3>Hors ordre du jour</h3><ul>${structured.horsOrdreDuJour
        .map((p) => `<li>${esc(p)}</li>`)
        .join("")}</ul></section>`
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<title>POC — Compte-rendu structuré (${esc(provider)}/${esc(model)})</title>
<style>
  :root { color-scheme: light; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; padding: 2rem; background: #f7f7f8; color: #1a1a1a; }
  h1 { font-size: 1.4rem; margin-bottom: 0.25rem; }
  .meta { color: #666; font-size: 0.85rem; margin-bottom: 2rem; }
  .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: start; }
  .panel { background: white; border-radius: 10px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .panel h2 { margin-top: 0; font-size: 1.1rem; }
  .panel.flat p { line-height: 1.6; }
  .bloc { margin-bottom: 1.25rem; }
  .bloc h3 { font-size: 0.95rem; margin: 0 0 0.4rem; color: #333; border-bottom: 2px solid #eee; padding-bottom: 0.25rem; }
  .bloc ul { margin: 0; padding-left: 1.2rem; }
  .bloc li { margin-bottom: 0.3rem; line-height: 1.5; }
  .bloc.hors h3 { color: #a34; border-bottom-color: #f0d0d0; }
  .empty { color: #999; font-style: italic; font-size: 0.9rem; }
  @media (max-width: 800px) { .columns { grid-template-columns: 1fr; } }
</style>
</head>
<body>
  <h1>POC — Compte-rendu structuré par ordre du jour</h1>
  <p class="meta">Expérience 006 · ${esc(provider)} / ${esc(model)} · généré le ${esc(date)}</p>
  <div class="columns">
    <div class="panel flat">
      <h2>Résumé plat (façon outil actuel)</h2>
      <p>${esc(flatSummary)}</p>
    </div>
    <div class="panel structured">
      <h2>Compte-rendu structuré par ordre du jour</h2>
      ${structuredSections}
      ${horsSection}
    </div>
  </div>
</body>
</html>
`;
}
