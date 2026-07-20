import { CATEGORIES, type RunResult } from "./types.js";
import { accuracy, accuracyBy, confusionMatrix } from "./scorer.js";

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

export function toMarkdown(run: RunResult): string {
  const { results } = run;
  const errors = results.filter((r) => !r.correct);
  const matrix = confusionMatrix(results);
  const cols = [...CATEGORIES, "inclassable"];

  const lines: string[] = [
    `## Rapport d'éval — ${run.provider} / ${run.model}`,
    "",
    `_Run du ${run.date} · harness maison (Vitest, repris de l'expérience 004) · ${results.length} cas_`,
    "",
    `| Métrique | Score |`,
    `|---|---|`,
    `| Accuracy globale | **${pct(accuracy(results))}** (${results.filter((r) => r.correct).length}/${results.length}) |`,
    `| Accuracy cas faciles | ${pct(accuracyBy(results, "facile"))} |`,
    `| Accuracy cas pièges | ${pct(accuracyBy(results, "piege"))} |`,
    "",
    "### Matrice de confusion (lignes = attendu, colonnes = prédit)",
    "",
    `| attendu \\ prédit | ${cols.join(" | ")} |`,
    `|---|${cols.map(() => "---").join("|")}|`,
    ...CATEGORIES.map((expected) => {
      const row = matrix[expected]!;
      return `| **${expected}** | ${cols.map((c) => row[c] || "·").join(" | ")} |`;
    }),
    "",
    "### Erreurs détaillées",
    "",
  ];

  if (errors.length === 0) {
    lines.push("_Aucune erreur._");
  } else {
    lines.push(
      `| Cas | Difficulté | Attendu | Prédit | Réponse brute |`,
      `|---|---|---|---|---|`,
      ...errors.map(
        (e) => `| #${e.id} | ${e.difficulte} | ${e.expected} | ${e.predicted ?? "inclassable"} | \`${e.raw.slice(0, 60)}\` |`,
      ),
    );
  }
  return lines.join("\n") + "\n";
}
