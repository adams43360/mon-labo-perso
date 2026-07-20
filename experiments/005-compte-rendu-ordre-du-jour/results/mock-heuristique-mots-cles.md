## Rapport d'éval — mock / heuristique-mots-cles

_Run du 2026-07-20 · harness maison (Vitest, repris de l'expérience 004) · 40 cas_

| Métrique | Score |
|---|---|
| Accuracy globale | **90.0%** (36/40) |
| Accuracy cas faciles | 96.4% |
| Accuracy cas pièges | 75.0% |

### Matrice de confusion (lignes = attendu, colonnes = prédit)

| attendu \ prédit | budget | recrutement | roadmap | risques | divers | hors_ordre_du_jour | inclassable |
|---|---|---|---|---|---|---|---|
| **budget** | 7 | · | · | · | · | · | · |
| **recrutement** | · | 7 | · | · | · | · | · |
| **roadmap** | · | · | 7 | · | · | · | · |
| **risques** | · | 1 | 1 | 4 | · | 1 | · |
| **divers** | · | · | · | · | 5 | 1 | · |
| **hors_ordre_du_jour** | · | · | · | · | · | 6 | · |

### Erreurs détaillées

| Cas | Difficulté | Attendu | Prédit | Réponse brute |
|---|---|---|---|---|
| #23 | piege | risques | roadmap | `roadmap` |
| #24 | piege | divers | hors_ordre_du_jour | `hors_ordre_du_jour` |
| #26 | facile | risques | recrutement | `recrutement` |
| #40 | piege | risques | hors_ordre_du_jour | `hors_ordre_du_jour` |
