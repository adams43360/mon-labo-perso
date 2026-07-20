/**
 * Génère les fichiers promptfoo depuis les sources de vérité partagées :
 *   - tests.yaml   ← data/dataset.json
 *   - prompt.json  ← prompts/system.md
 * À relancer après toute modification : npm run gen:promptfoo
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadDataset, loadSystemPrompt } from "../../src/dataset.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const ds = loadDataset();

const prompt = [
  { role: "system", content: loadSystemPrompt() },
  { role: "user", content: "{{ message }}" },
];
writeFileSync(join(HERE, "prompt.json"), JSON.stringify(prompt, null, 2) + "\n");

const yaml = ds.cases
  .map((c) => {
    const msg = c.message.replace(/"/g, '\\"');
    return [
      `- description: "cas ${c.id} (${c.difficulte})"`,
      `  vars:`,
      `    message: "${msg}"`,
      `  assert:`,
      `    - type: equals`,
      `      value: ${c.expected}`,
      `      transform: output.trim().toLowerCase().replace(/["'.,;:!]/g, "")`,
    ].join("\n");
  })
  .join("\n");

writeFileSync(join(HERE, "tests.yaml"), yaml + "\n");
console.log(`prompt.json + tests.yaml générés : ${ds.cases.length} cas`);
