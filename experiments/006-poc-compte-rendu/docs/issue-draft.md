<!-- Brouillon d'issue GitHub — à coller dans une nouvelle issue (template "Nouvelle expérience", label `experience`) -->
<!-- Titre : 006 — POC : compte-rendu structuré sur un transcript complet -->

## Contexte

[005](../005-compte-rendu-ordre-du-jour/README.md) a validé le mécanisme (routage fiable d'une intervention isolée vers le bon bloc d'ordre du jour, 100%/92% sur les pièges). Reste une question : est-ce que ça tient sur une vraie réunion complète, traitée en une seule passe, avec ses digressions et son désordre naturel — et est-ce que le résultat est visiblement meilleur qu'un résumé plat, à conditions égales (même IA, même transcript) ?

## Hypothèse

Un LLM peut lire un transcript complet + un ordre du jour et produire directement un compte-rendu structuré par bloc, de qualité perçue nettement supérieure à un résumé plat généré par la même IA sur le même contenu.

## Ce que ce POC produit

- Un transcript fictif plus long (~20-25 tours de parole) que celui de 005, dans le même scénario (comité de pilotage)
- Deux générations par la même IA, sur le même transcript : un résumé plat classique, et un compte-rendu structuré par bloc (sortie validée par schéma Zod)
- Une page HTML autonome, cliquable, comparant les deux côte à côte

## Scoring (déjà en backlog, `docs/backlog-ia.md` #17)

Suite directe de 005 (R4 × I4 × C0.8 / E1.5 = 8.5) — pas de re-scoring séparé, ce POC est la suite naturelle actée dans le verdict de 005.

## Résultats — à remplir en fin d'expérience

### Verdict qualitatif

_À rédiger après le run réel : le compte-rendu structuré tient-il sur un texte plus long et désordonné ? Qu'est-ce qui a été appris de plus par rapport à 005 ?_

## Checklist de démarrage

- [x] Mini-PRD rempli depuis `docs/product/template-experience.md`
- [x] Dossier `experiments/006-poc-compte-rendu/` créé
- [ ] `ARCHITECTURE.md` écrit avant tout code
- [ ] Implémentation + tests
- [ ] Run réel et page HTML générée
- [ ] `docs/roadmap.md` mis à jour
- [ ] Article publié sur le site
