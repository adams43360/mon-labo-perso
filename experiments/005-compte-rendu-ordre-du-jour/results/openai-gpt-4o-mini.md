## Rapport d'éval — openai / gpt-4o-mini

_Run du 2026-07-20 · harness maison (Vitest, repris de l'expérience 004) · 40 cas_

| Métrique | Score |
|---|---|
| Accuracy globale | **82.5%** (33/40) |
| Accuracy cas faciles | 78.6% |
| Accuracy cas pièges | 91.7% |

### Matrice de confusion (lignes = attendu, colonnes = prédit)

| attendu \ prédit | budget | recrutement | roadmap | risques | divers | hors_ordre_du_jour | inclassable |
|---|---|---|---|---|---|---|---|
| **budget** | 7 | · | · | · | · | · | · |
| **recrutement** | · | 6 | · | · | 1 | · | · |
| **roadmap** | · | · | 5 | 2 | · | · | · |
| **risques** | · | 2 | · | 5 | · | · | · |
| **divers** | · | · | · | · | 4 | 2 | · |
| **hors_ordre_du_jour** | · | · | · | · | · | 6 | · |

### Erreurs détaillées

| Cas | Difficulté | Attendu | Prédit | Réponse brute |
|---|---|---|---|---|
| #11 | facile | recrutement | divers | `divers` |
| #17 | facile | roadmap | risques | `risques` |
| #18 | facile | roadmap | risques | `risques` |
| #26 | facile | risques | recrutement | `recrutement` |
| #27 | facile | risques | recrutement | `recrutement` |
| #33 | piege | divers | hors_ordre_du_jour | `hors_ordre_du_jour` |
| #35 | facile | divers | hors_ordre_du_jour | `hors_ordre_du_jour` |
