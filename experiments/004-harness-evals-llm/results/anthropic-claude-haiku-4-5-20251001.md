## Rapport d'éval — anthropic / claude-haiku-4-5-20251001

_Run du 2026-07-20 · harness maison (Vitest) · 50 cas_

| Métrique | Score |
|---|---|
| Accuracy globale | **98.0%** (49/50) |
| Accuracy cas faciles | 100.0% |
| Accuracy cas pièges | 93.8% |

### Matrice de confusion (lignes = attendu, colonnes = prédit)

| attendu \ prédit | candidature | relance | desistement | demande_info | remerciement | hors_sujet | inclassable |
|---|---|---|---|---|---|---|---|
| **candidature** | 10 | · | · | · | · | · | · |
| **relance** | · | 8 | · | · | · | · | · |
| **desistement** | · | · | 8 | · | · | · | · |
| **demande_info** | 1 | · | · | 8 | · | · | · |
| **remerciement** | · | · | · | · | 7 | · | · |
| **hors_sujet** | · | · | · | · | · | 8 | · |

### Erreurs détaillées

| Cas | Difficulté | Attendu | Prédit | Réponse brute |
|---|---|---|---|---|
| #32 | piege | demande_info | candidature | `candidature` |
