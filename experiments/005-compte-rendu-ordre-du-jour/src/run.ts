/**
 * Lance l'éval du harness maison (repris de l'expérience 004).
 *
 *   PROVIDER=mock npm run eval            # sans clé API
 *   PROVIDER=anthropic npm run eval       # ANTHROPIC_API_KEY requise
 *   PROVIDER=openai MODEL=gpt-4o npm run eval
 *
 * Sorties : results/<provider>-<model>.json + .md (rapport à coller dans l'issue).
 */
import "./network.js";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { formatUserContent, loadDataset, loadSystemPrompt, ROOT } from "./dataset.js";
import { createProvider, type ProviderName } from "./providers.js";
import { normalize, accuracy } from "./scorer.js";
import { toMarkdown } from "./report.js";
import type { CaseResult, RunResult } from "./types.js";

const providerName = (process.env.PROVIDER ?? "mock") as ProviderName;
if (!["anthropic", "openai", "mock"].includes(providerName)) {
  throw new Error(`PROVIDER invalide : ${providerName} (attendu : anthropic | openai | mock)`);
}

const provider = createProvider(providerName, process.env.MODEL);
const dataset = loadDataset();
const system = loadSystemPrompt();

console.log(`Éval : ${provider.name} / ${provider.model} — ${dataset.cases.length} cas\n`);

const results: CaseResult[] = [];
for (const c of dataset.cases) {
  const userContent = formatUserContent(c.blocEnCours, c.message);
  const raw = await provider.classify(system, userContent);
  const predicted = normalize(raw);
  const correct = predicted === c.expected;
  results.push({ id: c.id, expected: c.expected, raw, predicted, correct, difficulte: c.difficulte });
  process.stdout.write(correct ? "." : "x");
}

const run: RunResult = {
  provider: provider.name,
  model: provider.model,
  date: new Date().toISOString().slice(0, 10),
  results,
};

const outDir = join(ROOT, "results");
mkdirSync(outDir, { recursive: true });
const base = join(outDir, `${run.provider}-${run.model.replace(/[^a-z0-9.-]/gi, "_")}`);
writeFileSync(`${base}.json`, JSON.stringify(run, null, 2));
writeFileSync(`${base}.md`, toMarkdown(run));

console.log(`\n\nAccuracy : ${(accuracy(results) * 100).toFixed(1)}%`);
console.log(`Rapport : ${base}.md`);
