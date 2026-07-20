## Rapport d'éval — openai / gpt-4o-mini

_Run du 2026-07-20 · harness maison (Vitest) · 50 cas_

| Métrique | Score |
|---|---|
| Accuracy globale | **100.0%** (50/50) |
| Accuracy cas faciles | 100.0% |
| Accuracy cas pièges | 100.0% |

### Matrice de confusion (lignes = attendu, colonnes = prédit)

| attendu \ prédit | candidature | relance | desistement | demande_info | remerciement | hors_sujet | inclassable |
|---|---|---|---|---|---|---|---|
| **candidature** | 10 | · | · | · | · | · | · |
| **relance** | · | 8 | · | · | · | · | · |
| **desistement** | · | · | 8 | · | · | · | · |
| **demande_info** | · | · | · | 9 | · | · | · |
| **remerciement** | · | · | · | · | 7 | · | · |
| **hors_sujet** | · | · | · | · | · | 8 | · |

### Erreurs détaillées

_Aucune erreur._
