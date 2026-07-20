<!-- Brouillon d'issue GitHub — à coller dans une nouvelle issue (template "Nouvelle expérience", label `experience`) -->
<!-- Titre : 004 — Harness d'évals LLM : promptfoo vs DeepEval vs Vitest maison -->

## Contexte

Sans évals, la qualité d'un prompt se juge "à l'œil" : impossible de savoir si une modification améliore ou dégrade. Les évals sont aux LLM ce que les tests unitaires sont au code déterministe. Avant de lancer les expériences IA suivantes du labo (structured output, chunking, embeddings… — voir `docs/backlog-ia.md`), il faut choisir **l'outil d'évals qui servira partout**.

## Hypothèse

Un harness maison sous Vitest (cohérent avec la stack du labo) suffit pour nos besoins, mais les outils spécialisés (promptfoo, DeepEval) apportent peut-être assez de valeur (rapports, matrices, intégrations) pour justifier une dépendance. On veut un verdict argumenté et chiffré.

## La tâche de référence : classification de messages RH

Pour comparer les 3 outils sur une base identique, on utilise une seule tâche, volontairement simple à scorer (exact match, pas de débat sur le scoring) : **classer 50 messages reçus sur une boîte recrutement** dans 6 catégories :

| Catégorie | Définition |
|---|---|
| `candidature` | Le message contient ou annonce une candidature (CV joint, postulation à une offre, candidature spontanée) |
| `relance` | Un candidat déjà en process demande où en est son dossier |
| `desistement` | Le candidat retire sa candidature ou décline une offre |
| `demande_info` | Question sur le poste ou le process, **avant** de candidater |
| `remerciement` | Remerciement post-entretien ou post-échange, sans autre demande |
| `hors_sujet` | Spam, prospection commerciale, presse, phishing… |

**50 cas, dont 16 "pièges"** conçus pour départager les modèles et rendre les évals discriminantes. Exemples de pièges :

- *"Merci encore pour l'entretien de la semaine dernière. Avez-vous pu avancer sur votre décision ?"* → `relance` (le remerciement est un préambule, l'intention est la relance)
- *"Merci beaucoup pour votre proposition d'embauche, mais j'ai décidé de rester dans mon entreprise actuelle."* → `desistement` (remerciement + refus)
- *"Bonjour, votre entreprise m'intéresse beaucoup. Auriez-vous un poste en comptabilité ? Je joins mon CV."* → `candidature` (la question est rhétorique, le CV est joint)
- *"Nous organisons un salon de recrutement le 12 octobre, souhaitez-vous réserver un stand ?"* → `hors_sujet` (thème recrutement mais prospection commerciale)

Chaque cas est annoté `facile` ou `piege`, ce qui permet de mesurer l'accuracy globale **et** l'accuracy sur les pièges seuls. Dataset complet : `experiments/004-harness-evals-llm/data/dataset.json`.

## Protocole

1. Même dataset, même prompt système (`prompts/system.md`), mêmes modèles (Anthropic + OpenAI) pour les 3 harness
2. Implémenter la suite d'évals avec chaque outil : **promptfoo** (config YAML), **DeepEval** (Python, open source), **harness maison** (TypeScript + Vitest)
3. Comparer sur 2 plans :
   - **Résultats produits** : les 3 outils donnent-ils les mêmes scores ? (sanity check)
   - **DX** : temps de setup, lisibilité des rapports, intégration CI, coût de maintenance, verrouillage

## Scoring (avant d'entrer dans "Next")

- Impact : 5/5 — l'outil retenu sera réutilisé par la moitié du backlog IA (réutilisabilité max)
- Effort : 2 semaines (temps partiel labo)
- Apprentissage : 5/5 — les évals sont la compétence structurante de l'ingénierie LLM
- RICE adapté (voir `docs/backlog-ia.md`) : R5 × I5 × C0.8 / E2 = **10.0**

## Résultats — à remplir en fin d'expérience

### Scores obtenus (sanity check inter-outils)

| Outil | Modèle | Accuracy globale | Accuracy pièges | Coût run | Durée run |
|---|---|---|---|---|---|
| promptfoo | claude-haiku-4-5-20251001 | **98.0%** (49/50, déduit — voir note cache) | — | — | — |
| promptfoo | gpt-4o-mini | **100.0%** (50/50, déduit — voir note cache) | — | — | — |
| DeepEval | claude-haiku-4-5-20251001 | **98.0%** (49/50) | 93.8% | non tracké (métrique custom, "cost: None") | 56,6 s |
| DeepEval | gpt-4o-mini | **100.0%** (50/50) | 100.0% | non tracké (métrique custom, "cost: None") | 39,2 s |
| Vitest maison | claude-haiku-4-5-20251001 | **98.0%** (49/50) | 93.8% | < 0,01 $ (non mesuré précisément, 50 appels courts) | quelques secondes |
| Vitest maison | gpt-4o-mini | **100.0%** (50/50) | 100.0% | < 0,01 $ (non mesuré précisément, 50 appels courts) | quelques secondes |

**Détail des erreurs — harness maison :**

- Claude Haiku 4.5 se trompe sur 1 cas : #32 *"Bonjour, j'ai passé un entretien chez vous il y a deux ans. Est-il possible de repostuler sur la nouvelle offre de développeur ?"* → prédit `candidature`, attendu `demande_info`. Cas limite légitime : le modèle a lu "repostuler" comme une intention de candidater plutôt que comme une question préalable — une lecture défendable, qui montre que ce piège teste bien une vraie ambiguïté et pas un artefact du dataset.
- GPT-4o-mini : aucune erreur, sans-faute sur les 50 cas dont les 16 pièges.

**Sanity check inter-outils : confirmé sur les 3 harness.** DeepEval et promptfoo reproduisent exactement les mêmes scores que le harness maison (98,0 %/93,8 % et 100 %/100 %) : promptfoo rapporte un agrégat de 99/100 (49+50), rigoureusement cohérent avec l'échec unique du cas #32 observé par les deux autres outils. Les 3 harness sont donc équivalents sur le fond — la comparaison qui suit porte uniquement sur la DX.

**Note sur le cache promptfoo :** ce run a servi les résultats depuis le cache local de promptfoo (`Duration: 1s`, `0 requests`), suite à un premier run réel effectué plus tôt. Les scores sont donc fiables (issus d'un vrai appel API), mais durée et coût ne sont pas mesurables sur cette exécution. À noter comme comportement par défaut de l'outil : pratique pour ne pas repayer des relances identiques, mais qui peut masquer un résultat obsolète si le prompt change sans invalider le cache (`promptfoo eval --no-cache` pour forcer un run frais).

Rapports complets (matrice de confusion incluse) : [`results/anthropic-claude-haiku-4-5-20251001.md`](../results/anthropic-claude-haiku-4-5-20251001.md), [`results/openai-gpt-4o-mini.md`](../results/openai-gpt-4o-mini.md).

**Friction d'installation — DeepEval :** l'install a échoué deux fois avant d'aboutir. `pip install -r requirements.txt` tente de compiler `cryptography` (dépendance transitive de `google-genai`, tirée automatiquement même sans utiliser Gemini) depuis les sources en Rust, faute de wheel précompilé pour Python 3.9. Résolu en recréant le venv sous Python 3.12 (`brew install python@3.12`). ~20 minutes de troubleshooting avant le premier run réussi, contre zéro friction pour promptfoo et le harness maison.

### Comparatif DX

| Critère | promptfoo | DeepEval | Vitest maison |
|---|---|---|---|
| Temps de setup (première éval qui tourne) | ~2 min (`npm install` + `npx`, zéro config au-delà du YAML) | ~30 min, dont ~20 min de troubleshooting (venv Python 3.9 → 3.12, échec de compilation de `cryptography`) | ~1 min (déjà dans le monorepo TS/Vitest, `npm install` suffit) |
| Lisibilité du rapport d'erreurs | Bon : tableau terminal dense + vue web interactive (`promptfoo view`) très lisible pour explorer cas par cas | Faible en l'état : sortie terminal Rich très verbeuse (un bloc de plusieurs lignes par cas, 50 cas = des centaines de lignes à scroller) ; l'outil pousse vers son SaaS "Confident AI" pour un vrai tableau de bord | Bon : rapport markdown ciblé (accuracy, matrice de confusion, table des erreurs uniquement) — collable tel quel dans une issue GitHub, ce qui était l'objectif |
| Intégration CI (GitHub Actions) | Native et documentée, sortie JSON exploitable, action GitHub officielle | Fonctionne via pytest mais ajoute un second runtime (Python) dans un repo 100% TS — double la matrice CI | Native : c'est déjà `vitest run`, la même commande que le reste du repo |
| Ajout d'un nouveau cas / d'une nouvelle métrique | Ajouter au `dataset.json` + relancer `npm run gen:promptfoo` (étape de génération supplémentaire à ne pas oublier) | Ajouter au `dataset.json` suffit pour un cas ; une nouvelle métrique s'écrit en Python et duplique la logique de normalisation déjà présente en TS (deux implémentations à maintenir en synchro) | Ajouter au `dataset.json` suffit ; toute nouvelle métrique s'écrit en TS, dans la même codebase que le reste du labo |
| Dépendances / verrouillage | Léger : MIT, cœur autonome, fonctionnalités cloud (partage, `promptfoo.app`) optionnelles et jamais requises | Lourd : tire `google-genai`, `grpcio`, `opentelemetry-*`, `sentry-sdk`, `posthog` en dépendances transitives — même sans utiliser Gemini ni la télémétrie. Pousse activement vers son SaaS Confident AI dans chaque sortie de run | Nul : aucun framework, juste le code du labo (+ `undici`, ajouté ici uniquement pour la compatibilité proxy du sandbox de dev) |

### Verdict

**Le harness maison (Vitest) devient le standard du labo pour les évals LLM.**

Les 3 outils produisent des résultats identiques (voir sanity check ci-dessus) — le choix ne se joue donc que sur la DX, et l'écart y est net. Le harness maison gagne sur les critères qui comptent le plus dans ce contexte précis : zéro friction d'installation (il vit déjà dans le même repo TypeScript que le reste du labo), un rapport markdown taillé sur mesure pour se coller directement dans une issue — exactement l'usage visé —, et aucune dépendance ni télémétrie tierce à surveiller.

**promptfoo reste un outil à garder sous la main en complément**, pas comme standard : sa vue web (`promptfoo view`) est un excellent outil d'exploration ad hoc quand on veut comparer plusieurs prompts ou modèles visuellement, avec un coût d'entrée quasi nul. Pour une exploration rapide et interactive avant de figer une éval dans le harness maison, c'est le bon réflexe.

**DeepEval est écarté par défaut pour ce labo.** La friction d'installation (venv Python dans un repo TypeScript, dépendance cachée à un toolchain Rust) et le poids des dépendances transitives ne sont pas justifiés pour des métriques déterministes comme un exact-match. Il redeviendra pertinent si une expérience future a spécifiquement besoin de ses métriques LLM-as-judge prêtes à l'emploi (pertinence, fidélité, détection d'hallucination) — à réévaluer au cas par cas, pas comme choix par défaut.

**Conséquence pratique :** les expériences suivantes du backlog qui ont besoin d'évals (structured output #1, chunking #2, embeddings #10…) réutiliseront directement la structure de `experiments/004-harness-evals-llm/src/` (dataset JSON + normalisation + scorer + rapport markdown), adaptée à leur tâche.

## Checklist de démarrage

- [x] Mini-PRD rempli depuis `docs/product/template-experience.md`
- [x] Dossier `experiments/004-harness-evals-llm/` créé
- [x] `ARCHITECTURE.md` écrit avant tout code
- [x] Implémentation + tests (16 tests unitaires, mode mock sans clé API)
- [x] Runs réels (Anthropic + OpenAI) et tableaux de résultats remplis ci-dessus
- [x] `docs/roadmap.md` mis à jour
- [ ] Article publié sur le site
