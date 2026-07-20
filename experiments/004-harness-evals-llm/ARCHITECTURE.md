# Analyse d'architecture — Harness d'évals LLM

## Le principe

On ne compare pas des modèles ni des prompts : on compare des **outils d'évaluation**. Pour que la comparaison soit honnête, tout le reste est figé et partagé : même dataset, même prompt système, mêmes modèles, mêmes paramètres d'appel. Chaque harness n'est qu'une "vue" différente sur la même expérience.

## Choix des outils comparés

Critères : exécution locale (pas d'envoi de données à un SaaS), licence open source, activité du projet, et représentativité d'une famille d'approche.

| Critère | promptfoo | DeepEval | Harness maison (Vitest) | Braintrust | LangSmith |
|---|---|---|---|---|---|
| Famille | Outil CLI dédié, config déclarative | Framework de test Python, style pytest | Code possédé dans la stack existante | SaaS avec UI | SaaS (LangChain) |
| Exécution locale | Oui | Oui | Oui | Non (SaaS) | Non (SaaS) |
| Licence | MIT | Apache 2.0 | n/a (notre code) | Propriétaire | Propriétaire |
| Langage | YAML + JS | Python | TypeScript | — | — |
| Rapports | CLI + web viewer local | CLI + option cloud | Ce qu'on écrit | UI riche | UI riche |
| Verrouillage | Faible | Moyen | Nul | Fort | Fort |

**Décision : promptfoo vs DeepEval vs harness maison.** Chacun représente une famille : l'outil déclaratif spécialisé, le framework de test dédié LLM, et le code possédé. Les SaaS (Braintrust, LangSmith) sont écartés : envoyer les données d'évals d'un labo perso à un tiers n'apporte rien ici, et le verrouillage est contraire à l'esprit du labo. DeepEval impose de sortir de la stack TypeScript — c'est un coût réel qui fera partie du verdict DX, pas une raison de l'exclure a priori.

## Choix de la tâche de référence

| Option | Scoring | Risque |
|---|---|---|
| Classification (6 catégories) | Exact match, binaire, incontestable | Tâche "facile" pour les modèles récents → mitigé par les 16 cas pièges |
| Extraction structurée (CV → JSON) | Par champ, pondéré | Le débat se déplace sur le scoring lui-même, ce qui parasite la comparaison des outils |
| Génération libre + LLM-as-judge | Subjectif | Ajoute un modèle juge = une variable de plus, coût double |

**Décision : classification.** Le scoring exact-match élimine toute ambiguïté : si les 3 outils donnent des scores différents sur les mêmes réponses, c'est un bug d'outil, pas un débat de métrique. Les cas pièges (16/50) maintiennent la difficulté et rendent la métrique "accuracy pièges" discriminante. L'extraction structurée est réservée à l'expérience 005 (structured output), qui héritera du harness gagnant.

## Construction du dataset

- **50 messages RH mockés en français**, 6 catégories, distribution : candidature ×10, relance ×8, desistement ×8, demande_info ×9, remerciement ×7, hors_sujet ×8
- Chaque cas : `{ id, message, expected, difficulte: "facile" | "piege" }`
- Les **pièges** sont construits sur 3 motifs : intention masquée par une politesse (remerciement qui est en fait une relance), signaux mixtes (question + CV joint = candidature), thème trompeur (prospection commerciale sur le thème du recrutement = hors_sujet)
- Source de vérité unique : `data/dataset.json`, consommé par les 3 harness (promptfoo via un script de conversion, DeepEval et Vitest en lecture directe)

## Architecture du harness maison

```
data/dataset.json          ← source de vérité (50 cas)
prompts/system.md          ← prompt système partagé
src/
  types.ts                 ← Case, Category, RunResult
  dataset.ts               ← chargement + validation du dataset
  providers.ts             ← appels Anthropic / OpenAI (fetch natif, pas de SDK) + provider mock
  scorer.ts                ← normalisation des réponses, accuracy, matrice de confusion
  report.ts                ← rapport markdown prêt à coller dans l'issue
  run.ts                   ← CLI : PROVIDER=anthropic|openai|mock npm run eval
tests/                     ← tests unitaires (scorer, dataset) — sans clé API
results/                   ← sorties JSON + markdown par run (gitignorées sauf rapports finaux)
harnesses/
  promptfoo/               ← promptfooconfig.yaml + conversion dataset → tests
  deepeval/                ← test_classification.py + requirements.txt épinglé
```

Choix notables :

- **fetch natif plutôt que les SDK** Anthropic/OpenAI : zéro dépendance runtime, les deux APIs se réduisent ici à un POST JSON. Les SDK seront évalués dans une expérience dédiée si besoin.
- **Provider `mock`** : un classifieur heuristique par mots-clés, local et déterministe. Il permet de développer le harness, faire tourner les tests en CI et générer des rapports réalistes (il se trompe, comme un vrai modèle) sans clé API ni coût.
- **Température 0, `max_tokens` faible**, paramètres identiques répliqués dans les 3 harness — condition de validité du sanity check inter-outils.
- **Normalisation des réponses** avant comparaison (minuscules, trim, retrait de ponctuation/guillemets) : on évalue la classification, pas la propreté du formatage — c'est l'expérience 005 qui traitera ce sujet.

## Ce que le comparatif doit produire

1. **Sanity check** : les 3 outils, sur les mêmes réponses, donnent la même accuracy (sinon, comprendre pourquoi)
2. **Comparatif DX** rempli dans l'issue : temps de setup, lisibilité des rapports d'erreurs, intégration CI, coût d'ajout d'un cas/d'une métrique, verrouillage
3. **Verdict** : l'outil standard des évals du labo pour les expériences suivantes
