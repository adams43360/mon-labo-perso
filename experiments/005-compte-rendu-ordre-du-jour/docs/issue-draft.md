<!-- Brouillon d'issue GitHub — à coller dans une nouvelle issue (template "Nouvelle expérience", label `experience`) -->
<!-- Titre : 005 — Compte-rendu de réunion structuré par ordre du jour -->

## Contexte

Les résumés de réunion générés par l'IA aujourd'hui (Otter, Fireflies, Fathom, Gemini/Zoom/Teams…) sont des résumés linéaires qui suivent l'ordre chronologique de la discussion, pas la structure de la réunion. Beaucoup de réunions récurrentes suivent pourtant un **ordre du jour connu à l'avance** — l'idée testée ici : router les échanges vers les blocs de cet ordre du jour plutôt que produire un résumé plat.

## Hypothèse

Un LLM peut router chaque intervention d'une réunion vers le bon bloc d'ordre du jour avec une précision élevée, y compris repérer les tangentes hors-sujet et les reprises tardives d'un point déjà traité. Réutilise directement le harness d'évals validé en [004](../004-harness-evals-llm/README.md) — pas de nouveau comparatif d'outils, la question ici est purement sur la faisabilité de l'idée.

## La tâche : router des interventions de réunion vers un ordre du jour à 5 blocs

Ordre du jour type (comité de pilotage fictif) :

| Bloc | Sujet |
|---|---|
| `budget` | Suivi budgétaire du trimestre |
| `recrutement` | Ouvertures de poste et process de recrutement |
| `roadmap` | Plan de charge et priorités du trimestre suivant |
| `risques` | Risques projet et points de blocage |
| `divers` | Points annexes prévus à l'ordre du jour |
| `hors_ordre_du_jour` | Tout ce qui ne relève d'aucun bloc ci-dessus |

Exemples de pièges :

- *"Pendant qu'on parle recrutement, ça va coûter combien cette nouvelle embauche sur l'enveloppe du trimestre ?"* → `budget` (le sujet nominal du tour de parole est le recrutement, mais la question posée est budgétaire)
- *"Pour revenir sur le point budget qu'on a vite survolé tout à l'heure, je pense qu'on sous-estime les coûts d'infra."* → `budget` (reprise tardive d'un point déjà traité, à ne pas classer dans le bloc en cours)
- *"Au fait, quelqu'un a vu le match hier soir ?"* → `hors_ordre_du_jour`

## Protocole

1. Dataset d'interventions fictives (français), chacune annotée avec le bloc attendu et une difficulté (`facile`/`piège`)
2. Harness Vitest (repris de 004) adapté à cette tâche : mêmes conventions (dataset JSON, prompt système, normalisation, scorer, rapport markdown)
3. Run réel sur 2 modèles (Anthropic + OpenAI), mesure de l'accuracy globale et sur les pièges
4. Démonstration comparative : un mini-transcript présenté en résumé plat classique vs en compte-rendu structuré par bloc

## Scoring (déjà en backlog, `docs/backlog-ia.md` #17)

R4 × I4 × C0.8 / E1.5 = **8.5**

## Résultats — à remplir en fin d'expérience

### Scores obtenus

| Modèle | Accuracy globale | Accuracy pièges | Notes |
|---|---|---|---|
| | | | |
| | | | |

### Démonstration : résumé plat vs structuré

_À insérer : le même mini-transcript sous les deux formes, côte à côte._

### Verdict

_À rédiger : l'hypothèse tient-elle ? Le sujet mérite-t-il d'être creusé comme future brique produit (au-delà du labo) ?_

## Checklist de démarrage

- [x] Mini-PRD rempli depuis `docs/product/template-experience.md`
- [x] Dossier `experiments/005-compte-rendu-ordre-du-jour/` créé
- [ ] `ARCHITECTURE.md` écrit avant tout code
- [ ] Implémentation + tests
- [ ] Runs réels et tableaux de résultats remplis ci-dessus
- [ ] `docs/roadmap.md` mis à jour
- [ ] Article publié sur le site
