---
tags: [ia, evals, compte-rendu]
date: 2026-07-20
stack: [TypeScript, Vitest]
statut: en-cours
---

# 005 — Compte-rendu de réunion structuré par ordre du jour

## Contexte

Les outils de compte-rendu de réunion par IA (Otter, Fireflies, Fathom, Gemini/Zoom/Teams…) produisent un résumé linéaire qui suit l'ordre chronologique de la discussion, pas la structure de la réunion. Beaucoup de réunions récurrentes suivent pourtant un **ordre du jour connu à l'avance**. Cette expérience teste l'hypothèse qu'on peut router les échanges vers les blocs de cet ordre du jour plutôt que produire un résumé plat — et mesure si ça tient techniquement.

Voir [`ARCHITECTURE.md`](ARCHITECTURE.md) pour les choix de design (scope volontairement limité au routage, pas à l'extraction de décisions) et [`docs/mini-prd.md`](docs/mini-prd.md) pour le périmètre complet. Le brouillon d'issue est dans [`docs/issue-draft.md`](docs/issue-draft.md).

Cette expérience ne rouvre pas le débat sur l'outil d'évals : elle réutilise directement le harness maison (Vitest) validé en [004](../004-harness-evals-llm/README.md).

## La tâche

Un ordre du jour fixe à 5 blocs (`budget`, `recrutement`, `roadmap`, `risques`, `divers`) + une catégorie `hors_ordre_du_jour`. **40 interventions fictives** de comité de pilotage, dont 12 pièges (30%) construits sur deux motifs : un sujet mentionné en passant dans le mauvais bloc, ou la reprise tardive d'un point déjà traité dans un bloc antérieur. Chaque cas précise le bloc officiellement en cours (`blocEnCours`) — le modèle doit classer par le **contenu réel**, pas par ce bloc.

Sources de vérité : `data/dataset.json`, `prompts/system.md`.

## Lancer les évals

```bash
npm install
npm test                              # tests unitaires — sans clé API
npm run eval:mock                     # run complet avec le classifieur heuristique local
PROVIDER=anthropic npm run eval       # ANTHROPIC_API_KEY requise
PROVIDER=openai npm run eval          # OPENAI_API_KEY requise
```

Chaque run écrit `results/<provider>-<model>.json` et un rapport markdown (accuracy globale/faciles/pièges, matrice de confusion, erreurs détaillées).

## Résultats

_À remplir après les runs réels — voir les tableaux dans [`docs/issue-draft.md`](docs/issue-draft.md)._

Run mock (classifieur heuristique, sans IA) à titre de validation du harness : 90% d'accuracy globale, 75% sur les pièges — cohérent avec un mock qui ignore volontairement le bloc en cours, contrairement à ce qu'on attend d'un vrai LLM.

## Pour aller plus loin

Le code complet, le jeu de données et l'analyse d'architecture sont dans ce dossier. Voir aussi l'entrée #17 du [backlog IA](../../docs/backlog-ia.md).
