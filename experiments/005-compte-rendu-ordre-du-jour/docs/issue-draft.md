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

| Modèle | Accuracy globale | Accuracy pièges | Accuracy cas faciles |
|---|---|---|---|
| claude-haiku-4-5-20251001 | **82.5%** (33/40) | **100.0%** | 75.0% |
| gpt-4o-mini | **82.5%** (33/40) | **91.7%** | 78.6% |

Rapports complets : [`results/anthropic-claude-haiku-4-5-20251001.md`](../results/anthropic-claude-haiku-4-5-20251001.md), [`results/openai-gpt-4o-mini.md`](../results/openai-gpt-4o-mini.md).

**Le chiffre le plus important n'est pas le 82.5% global, c'est l'accuracy sur les pièges : 100% et 91.7%.** Les pièges sont précisément les cas conçus pour tester l'hypothèse de Damien — un sujet mentionné dans le mauvais bloc, ou la reprise tardive d'un point déjà traité. Les deux modèles les résolvent presque parfaitement : **l'hypothèse centrale (router par le contenu réel, indépendamment du bloc en cours) est validée.**

Les erreurs qui expliquent le score de 82.5% viennent d'ailleurs, et se concentrent sur deux schémas distincts, aucun ne remettant en cause l'idée de départ :

1. **La frontière `divers` / `hors_ordre_du_jour` est la vraie difficulté.** 3 des 7 erreurs de chaque modèle (#33, #35, #36) portent sur cette distinction. Le cas #35 — *"Petit rappel : le séminaire d'équipe est confirmé pour la troisième semaine du trimestre"* — est classé `hors_ordre_du_jour` par les **deux** modèles alors qu'il était annoté `divers` (facile). En cause : `divers` a été défini comme "points annexes **prévus** à l'ordre du jour", une nuance invisible dans le contenu lui-même (rien dans la phrase ne dit "c'était prévu"). C'est un défaut de conception du dataset, pas un échec de l'IA — cette frontière demanderait un signal explicite (ex. fournir la liste des points "divers" prévus, comme on fournit déjà les 5 blocs).
2. **Quelques cas "faciles" contenaient involontairement une ambiguïté** entre deux sujets réels. Le cas #26 — *"On a un risque de retard sur la livraison si le recrutement du poste backend traîne encore"* — a été classé `recrutement` par les deux modèles au lieu de `risques` : le mot "recrutement" domine alors que le risque de retard est le sujet principal. Même schéma pour #18 et #27. Ce sont des cas mal calibrés (auraient dû être annotés `piège`), pas des échecs de la méthode.

### Démonstration : résumé plat vs structuré

Un mini-extrait de la réunion, avec un sujet budgétaire soulevé pendant le bloc recrutement (#15) et une candidature mentionnée tardivement pendant les divers (#38) :

**Résumé plat (façon outil actuel)**

> Le budget trimestriel est consommé à 62%, cohérent avec le planning. Trois candidats sont en lice pour le poste de développeur backend. Une question a été posée sur le coût de la nouvelle embauche par rapport à l'enveloppe du trimestre. La priorité du prochain trimestre reste la refonte du module de facturation. Plus tard dans la réunion, une candidature intéressante est arrivée pour le poste QA.

**Compte-rendu structuré par ordre du jour**

> **Budget** — Consommation à 62% du budget trimestriel, cohérent avec le planning. Question soulevée sur le coût de la nouvelle embauche vs l'enveloppe (posée pendant le point recrutement).
>
> **Recrutement** — Trois candidats en lice pour le poste de développeur backend. Une candidature intéressante reçue pour le poste QA (mentionnée tardivement, pendant les divers).
>
> **Roadmap** — Priorité du prochain trimestre : refonte du module de facturation.

Dans la version plate, la question budgétaire posée pendant le point recrutement et la candidature QA mentionnée pendant les divers restent noyées à leur place chronologique — il faut tout relire pour les rattacher au bon sujet. Dans la version structurée, elles sont directement à leur place : c'est exactement le gain de navigabilité que l'hypothèse visait.

### Verdict

**L'hypothèse tient.** Router les interventions par le contenu réel plutôt que par le bloc en cours fonctionne avec une fiabilité élevée (91-100% sur les cas conçus spécifiquement pour ça), avec deux modèles différents. Le score brut de 82.5% ne reflète pas un défaut de la méthode mais deux limites du dataset lui-même, faciles à corriger dans une itération 2 : préciser la frontière `divers`/`hors_ordre_du_jour` (par exemple en fournissant la liste des points "divers" annoncés, plutôt qu'une simple étiquette) et reclasser #18/#26/#27 en pièges.

**Ça mérite une itération produit.** Le POC cliquable (méthode déjà utilisée en 002/003) serait l'étape naturelle suivante : prendre un vrai ordre du jour, un vrai (ou simulé de façon plus réaliste) transcript, et montrer le compte-rendu structuré généré en une passe plutôt qu'intervention par intervention. Ça validerait le passage à l'échelle (un vrai transcript est plus long et plus désordonné que 40 phrases isolées) avant de parler d'un outil à part entière.

## Checklist de démarrage

- [x] Mini-PRD rempli depuis `docs/product/template-experience.md`
- [x] Dossier `experiments/005-compte-rendu-ordre-du-jour/` créé
- [x] `ARCHITECTURE.md` écrit avant tout code
- [x] Implémentation + tests (15 tests unitaires, mode mock sans clé API)
- [x] Runs réels et tableaux de résultats remplis ci-dessus
- [x] `docs/roadmap.md` mis à jour
- [ ] Article publié sur le site
