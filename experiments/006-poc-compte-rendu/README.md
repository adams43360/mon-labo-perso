---
tags: [ia, compte-rendu, poc]
date: 2026-07-21
stack: [TypeScript, Zod]
statut: en-cours
---

# 006 — POC : compte-rendu structuré sur un transcript complet

## Contexte

[005](../005-compte-rendu-ordre-du-jour/README.md) a validé le mécanisme central (routage fiable d'une intervention isolée vers le bon bloc d'ordre du jour, 100%/92% sur les pièges). Cette expérience vérifie si l'idée tient sur une vraie réunion complète traitée en une seule passe, et produit une démonstration concrète : le même transcript résumé par la même IA, en version plate classique et en version structurée par ordre du jour.

Voir [`ARCHITECTURE.md`](ARCHITECTURE.md) pour les choix de design (POC en script + HTML généré plutôt qu'une app React, schéma de sortie structurée) et [`docs/mini-prd.md`](docs/mini-prd.md) pour le périmètre.

## Ce que fait ce POC

Un transcript fictif de comité de pilotage (~25 tours de parole, digressions et redites incluses) + un ordre du jour à 5 blocs. Le même modèle génère, sur le même transcript :

1. Un **résumé plat** classique (façon outil du marché)
2. Un **compte-rendu structuré** par bloc d'ordre du jour (sortie JSON validée par schéma Zod)

Les deux résultats sont assemblés dans une page HTML autonome, à ouvrir dans un navigateur.

## Lancer le POC

```bash
npm install
npm test                          # tests unitaires (schéma, génération HTML) — sans clé API
PROVIDER=anthropic npm run generate
PROVIDER=openai npm run generate
```

Chaque run écrit `results/comparaison-<provider>-<model>.html` — à ouvrir directement dans un navigateur.

## Résultats

_À remplir après le run réel : capture ou lien vers la page générée, verdict qualitatif sur la tenue de l'approche à l'échelle d'un transcript complet._

## Pour aller plus loin

Le code complet est dans ce dossier. Voir aussi l'entrée #17 du [backlog IA](../../docs/backlog-ia.md) et l'expérience [005](../005-compte-rendu-ordre-du-jour/README.md) pour la validation initiale du mécanisme.
