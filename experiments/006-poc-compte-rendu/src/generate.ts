/**
 * Génère la comparaison résumé plat vs compte-rendu structuré, sur le même
 * transcript et le même modèle, et écrit une page HTML autonome.
 *
 *   PROVIDER=anthropic npm run generate
 *   PROVIDER=openai MODEL=gpt-4o npm run generate
 *
 * ANTHROPIC_API_KEY ou OPENAI_API_KEY requise selon le provider.
 */
import "./network.js";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { complete, resolveModel, type ProviderName } from "./providers.js";
import { parseStructuredReport } from "./structuredOutput.js";
import { buildComparisonHtml } from "./report-html.js";
import { CALL_PARAMS, type AgendaItem } from "./types.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const providerName = (process.env.PROVIDER ?? "anthropic") as ProviderName;
if (!["anthropic", "openai"].includes(providerName)) {
  throw new Error(`PROVIDER invalide : ${providerName} (attendu : anthropic | openai)`);
}
const model = resolveModel(providerName, process.env.MODEL);

const transcript = readFileSync(join(ROOT, "data", "transcript.md"), "utf8").trim();
const agenda = JSON.parse(readFileSync(join(ROOT, "data", "ordre-du-jour.json"), "utf8")) as AgendaItem[];
const systemFlat = readFileSync(join(ROOT, "prompts", "system-flat.md"), "utf8").trim();
const systemStructure = readFileSync(join(ROOT, "prompts", "system-structure.md"), "utf8").trim();

async function generateStructured(userContent: string, attempt = 1): Promise<ReturnType<typeof parseStructuredReport>> {
  const raw = await complete(providerName, model, systemStructure, userContent, CALL_PARAMS.maxTokensStructure);
  try {
    return parseStructuredReport(raw);
  } catch (e) {
    if (attempt >= 2) throw e;
    console.warn(`  (sortie structurée invalide, nouvelle tentative — ${(e as Error).message.split("\n")[0]})`);
    return generateStructured(
      `${userContent}\n\n(Rappel : réponds UNIQUEMENT avec l'objet JSON demandé, sans texte autour.)`,
      attempt + 1,
    );
  }
}

async function main() {
  console.log(`Génération : ${providerName} / ${model}\n`);

  console.log("- Résumé plat...");
  const flatSummary = (await complete(providerName, model, systemFlat, transcript, CALL_PARAMS.maxTokensFlat)).trim();

  console.log("- Compte-rendu structuré...");
  const agendaContext = `Ordre du jour :\n${agenda.map((a) => `- ${a.bloc} : ${a.intitule}`).join("\n")}\n\nTranscript :\n${transcript}`;
  const structured = await generateStructured(agendaContext);

  const html = buildComparisonHtml({
    provider: providerName,
    model,
    date: new Date().toISOString().slice(0, 10),
    agenda,
    flatSummary,
    structured,
  });

  const outDir = join(ROOT, "results");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `comparaison-${providerName}-${model.replace(/[^a-z0-9.-]/gi, "_")}.html`);
  writeFileSync(outPath, html);

  console.log(`\nPage générée : ${outPath}`);
  console.log(`Ouvre-la dans un navigateur : file://${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
