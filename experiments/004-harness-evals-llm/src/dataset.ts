import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORIES, type Case, type Dataset } from "./types.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export function loadDataset(): Dataset {
  const raw = JSON.parse(readFileSync(join(ROOT, "data", "dataset.json"), "utf8")) as Dataset;
  validateDataset(raw);
  return raw;
}

export function validateDataset(ds: Dataset): void {
  const ids = new Set<number>();
  for (const c of ds.cases) {
    if (ids.has(c.id)) throw new Error(`id dupliqué : ${c.id}`);
    ids.add(c.id);
    if (!CATEGORIES.includes(c.expected)) {
      throw new Error(`cas ${c.id} : catégorie inconnue "${c.expected}"`);
    }
    if (c.difficulte !== "facile" && c.difficulte !== "piege") {
      throw new Error(`cas ${c.id} : difficulté invalide "${c.difficulte}"`);
    }
    if (!c.message.trim()) throw new Error(`cas ${c.id} : message vide`);
  }
}

export function loadSystemPrompt(): string {
  return readFileSync(join(ROOT, "prompts", "system.md"), "utf8").trim();
}

export { ROOT };
export type { Case };
