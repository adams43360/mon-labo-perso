## Rapport d'éval — anthropic / claude-haiku-4-5-20251001

_Run du 2026-07-20 · harness maison (Vitest, repris de l'expérience 004) · 40 cas_

| Métrique | Score |
|---|---|
| Accuracy globale | **82.5%** (33/40) |
| Accuracy cas faciles | 75.0% |
| Accuracy cas pièges | 100.0% |

### Matrice de confusion (lignes = attendu, colonnes = prédit)

| attendu \ prédit | budget | recrutement | roadmap | risques | divers | hors_ordre_du_jour | inclassable |
|---|---|---|---|---|---|---|---|
| **budget** | 6 | · | · | 1 | · | · | · |
| **recrutement** | 1 | 6 | · | · | · | · | · |
| **roadmap** | · | · | 6 | 1 | · | · | · |
| **risques** | · | 2 | · | 5 | · | · | · |
| **divers** | · | · | · | · | 4 | 2 | · |
| **hors_ordre_du_jour** | · | · | · | · | · | 6 | · |

### Erreurs détaillées

| Cas | Difficulté | Attendu | Prédit | Réponse brute |
|---|---|---|---|---|
| #3 | facile | budget | risques | `risques` |
| #12 | facile | recrutement | budget | `budget` |
| #18 | facile | roadmap | risques | `risques` |
| #26 | facile | risques | recrutement | `recrutement` |
| #27 | facile | risques | recrutement | `recrutement` |
| #35 | facile | divers | hors_ordre_du_jour | `hors_ordre_du_jour` |
| #36 | facile | divers | hors_ordre_du_jour | `hors_ordre_du_jour` |
