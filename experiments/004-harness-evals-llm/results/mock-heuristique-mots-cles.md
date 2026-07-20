## Rapport d'éval — mock / heuristique-mots-cles

_Run du 2026-07-20 · harness maison (Vitest) · 50 cas_

| Métrique | Score |
|---|---|
| Accuracy globale | **90.0%** (45/50) |
| Accuracy cas faciles | 100.0% |
| Accuracy cas pièges | 68.8% |

### Matrice de confusion (lignes = attendu, colonnes = prédit)

| attendu \ prédit | candidature | relance | desistement | demande_info | remerciement | hors_sujet | inclassable |
|---|---|---|---|---|---|---|---|
| **candidature** | 9 | · | · | 1 | · | · | · |
| **relance** | · | 5 | · | 2 | 1 | · | · |
| **desistement** | · | · | 7 | · | 1 | · | · |
| **demande_info** | · | · | · | 9 | · | · | · |
| **remerciement** | · | · | · | · | 7 | · | · |
| **hors_sujet** | · | · | · | · | · | 8 | · |

### Erreurs détaillées

| Cas | Difficulté | Attendu | Prédit | Réponse brute |
|---|---|---|---|---|
| #6 | piege | candidature | demande_info | `demande_info` |
| #15 | piege | relance | remerciement | `remerciement` |
| #17 | piege | relance | demande_info | `demande_info` |
| #18 | piege | relance | demande_info | `demande_info` |
| #22 | piege | desistement | remerciement | `remerciement` |
