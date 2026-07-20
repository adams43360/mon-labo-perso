---
tags: [evals, llm, promptfoo, deepeval, vitest, ia]
date: 2026-07-20
stack: [TypeScript, Vitest, promptfoo, DeepEval, Python]
statut: documenté
---

# 004 — Harness d'évals LLM : promptfoo vs DeepEval vs Vitest maison

## Contexte

Les évals sont aux LLM ce que les tests unitaires sont au code déterministe : sans elles, impossible de savoir si une modification de prompt améliore ou dégrade. Avant les expériences IA suivantes du labo (qui toutes devront **mesurer**), cette expérience compare trois outils d'évals sur une tâche identique et choisit le standard du labo.

Voir [`ARCHITECTURE.md`](ARCHITECTURE.md) pour le comparatif des outils et les choix de design, et [`docs/mini-prd.md`](docs/mini-prd.md) pour le périmètre. Le brouillon d'issue GitHub (avec les tableaux de résultats à remplir) est dans [`docs/issue-draft.md`](docs/issue-draft.md).

## La tâche de référence

Classification de **50 messages RH mockés** (boîte recrutement) en 6 catégories : `candidature`, `relance`, `desistement`, `demande_info`, `remerciement`, `hors_sujet`. 16 cas sont des **pièges** annotés (remerciement qui est en fait une relance, refus poli, prospection commerciale sur le thème du recrutement…), ce qui permet de mesurer une accuracy globale et une accuracy "pièges".

Sources de vérité partagées par les 3 harness : `data/dataset.json` (cas) et `prompts/system.md` (prompt). Paramètres figés : température 0, max_tokens 10.

## Lancer les évals

### Harness maison (TypeScript + Vitest)

```bash
npm install
npm test                              # tests unitaires (scorer, dataset) — sans clé API
npm run eval:mock                     # run complet avec le classifieur heuristique local
PROVIDER=anthropic npm run eval       # ANTHROPIC_API_KEY requise
PROVIDER=openai npm run eval          # OPENAI_API_KEY requise
```

Chaque run écrit `results/<provider>-<model>.json` et un rapport markdown prêt à coller dans l'issue (accuracy globale/faciles/pièges, matrice de confusion, erreurs détaillées).

### promptfoo

```bash
npm run gen:promptfoo                 # régénère prompt.json + tests.yaml depuis les sources partagées
cd harnesses/promptfoo
npx promptfoo@latest eval             # clés API dans l'env
npx promptfoo@latest view             # rapport web local
```

### DeepEval

```bash
cd harnesses/deepeval
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
PROVIDER=anthropic deepeval test run test_classification.py
```

## Résultats

Sanity check confirmé sur les 3 harness : accuracy identique (98,0 % Claude Haiku 4.5 / 100 % GPT-4o-mini), même unique cas d'échec (#32, un cas limite légitime). Le choix se joue donc entièrement sur la DX — détail complet, tableaux et verdict dans [`docs/issue-draft.md`](docs/issue-draft.md).

**Verdict : le harness maison (Vitest) devient le standard du labo.** Zéro friction d'installation (déjà dans le repo TS), rapport markdown collable directement dans une issue, aucune dépendance tierce. promptfoo reste un outil d'exploration ad hoc utile (sa vue web `promptfoo view`) mais pas le standard. DeepEval est écarté par défaut — friction d'installation lourde (venv Python, dépendance Rust cachée via `google-genai`) non justifiée pour des métriques déterministes ; à reconsidérer si une expérience future a besoin de ses métriques LLM-as-judge.

## English summary

Three LLM eval harnesses (promptfoo, DeepEval, and a hand-rolled Vitest harness) are compared on an identical task: classifying 50 mocked French HR emails into 6 categories, including 16 annotated "trap" cases. Same dataset, same system prompt, same call parameters (temperature 0) across all three tools — so the comparison measures the tools themselves (setup time, error reports, CI integration, lock-in), not the models. The winning harness becomes the lab's standard for all subsequent AI experiments.
