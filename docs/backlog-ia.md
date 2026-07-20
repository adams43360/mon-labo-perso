# Backlog IA — idées d'expériences scorées

> Backlog priorisé des expériences IA du labo. Scoring revu au fil de l'eau : quand une idée monte en "Next" de la [roadmap](./roadmap.md), elle suit le process standard (issue → mini-PRD → `ARCHITECTURE.md`).

## Méthode de scoring — RICE adapté au labo

Le RICE classique ne colle pas à un labo perso (pas de "reach" utilisateurs). Adaptation :

| Critère | Signification | Échelle |
|---|---|---|
| **R** — Réutilisabilité | Ce que l'expérience produit est-il réutilisable ailleurs (TeamFit, FitradarHR, autres expériences, le site) ? | 1–5 |
| **I** — Impact d'apprentissage | Est-ce que ça m'apprend quelque chose de structurant et durable, ou un détail d'API vite périmé ? | 1–5 |
| **C** — Confidence | Confiance dans le fait que l'expérience aboutira à une conclusion nette (pas un "ça dépend"). | 0.5–1 |
| **E** — Effort | Estimation en semaines (à temps partiel labo). | 0.5–4 |

**Score = (R × I × C) / E** — plus c'est haut, plus c'est prioritaire.

## Backlog scoré

Trié par score décroissant. Axes : 🔧 ingénierie IA · 📦 IA appliquée produit · 🤖 IA dans le workflow dev.

| # | Idée | Axe | R | I | C | E | Score |
|---|---|---|---|---|---|---|---|
| 1 | **Structured output fiable** : function calling vs JSON mode vs validation Zod + retry, taux d'erreur mesuré sur 200 extractions | 🔧 | 5 | 4 | 0.9 | 1 | **18.0** |
| 2 | **Stratégies de chunking comparées** (taille fixe, sémantique, hiérarchique) sur un même corpus, avec évals de retrieval | 🔧 | 4 | 4 | 0.9 | 1 | **14.4** |
| 3 | **Serveur MCP maison** : exposer une API perso (données RH mockées) à Claude, mesurer ce que ça change vs copier-coller | 🔧 | 4 | 4 | 0.9 | 1 | **14.4** |
| 4 | **Skills/subagents Claude Code pour le labo** : automatiser tes propres conventions (draft d'ARCHITECTURE.md, issue, mini-PRD) | 🤖 | 5 | 3 | 0.9 | 1 | **13.5** |
| 5 | **Triage d'issues GitHub par LLM** : labels + priorité auto en CI, précision mesurée vs triage manuel | 🤖 | 3 | 2 | 0.9 | 0.5 | **10.8** |
| 6 | **Streaming UX** : patterns d'affichage de réponses LLM en React (SSE, optimistic UI, interruption) | 🔧 | 4 | 3 | 0.9 | 1 | **10.8** |
| 7 | **Extraction structurée de CV** (PDF → JSON typé) avec jeu d'évals de précision par champ | 📦 | 5 | 4 | 0.8 | 1.5 | **10.7** |
| 8 | **Agent de code review sur PR** : Claude en CI vs review manuelle, faux positifs/vrais problèmes comptés sur 20 PR | 🤖 | 5 | 4 | 0.8 | 1.5 | **10.7** |
| 9 | **Harness d'évals LLM** : promptfoo vs DeepEval vs harness maison sous Vitest, sur une même tâche → **terminé : expérience [004](../experiments/004-harness-evals-llm/README.md)**, verdict harness maison adopté | 🔧 | 5 | 5 | 0.8 | 2 | **10.0** |
| 10 | **Embeddings comparés** (OpenAI, Voyage, open-source) sur une tâche de similarité métier RH | 🔧 | 4 | 4 | 0.9 | 1.5 | **9.6** |
| 11 | **Model cascading coût/latence** : router petit modèle → gros modèle selon la difficulté, courbe coût/qualité | 🔧 | 4 | 3 | 0.8 | 1 | **9.6** |
| 12 | **Génération de contenu contrôlée** : templates + tone of voice + éval automatique de conformité | 📦 | 4 | 3 | 0.8 | 1 | **9.6** |
| 13 | **Guardrails & prompt injection** : batterie d'attaques sur un chatbot, taux de contournement avant/après protections | 🔧 | 4 | 4 | 0.8 | 1.5 | **8.5** |
| 14 | **Transcription + résumé de réunion** (Whisper → LLM), qualité mesurée sur vraies réunions | 📦 | 3 | 3 | 0.9 | 1 | **8.1** |
| 15 | **Matching sémantique candidats/offres** par embeddings — mini POC RH avec métriques de ranking | 📦 | 5 | 4 | 0.8 | 2 | **8.0** |
| 16 | **Caching sémantique** de réponses LLM : taux de hit et économies sur trafic réaliste | 🔧 | 3 | 3 | 0.8 | 1 | **7.2** |
| 17 | **Chatbot RAG sur le site du labo** : le Docusaurus qui répond sur ses propres expériences (démo embarquée MDX) | 📦 | 4 | 4 | 0.9 | 2 | **7.2** |
| 18 | **Vector DB comparées** : pgvector vs Qdrant vs Weaviate, benchmark ingestion/latence/rappel *(déjà en Next)* | 🔧 | 5 | 5 | 0.8 | 3 | **6.7** |
| 19 | **Observabilité LLM** : tracing OpenTelemetry + Langfuse/Phoenix — croise l'expé OTel déjà prévue | 🔧 | 4 | 4 | 0.8 | 2 | **6.4** |
| 20 | **LLM local** : Ollama + modèle open-weight vs API, qualité/coût/latence sur un cas réel | 🔧 | 3 | 4 | 0.8 | 1.5 | **6.4** |
| 21 | **Recherche hybride** : BM25 + vecteurs + reranker, gain mesuré vs vecteurs seuls | 🔧 | 4 | 4 | 0.8 | 2 | **6.4** |
| 22 | **Vision sur documents** : extraction de tableaux/données depuis scans et screenshots, précision mesurée | 📦 | 4 | 3 | 0.8 | 1.5 | **6.4** |
| 23 | **Doc auto & drift detection** : générer README/ADR depuis le code, détecter la doc périmée en CI | 🤖 | 4 | 3 | 0.8 | 1.5 | **6.4** |
| 24 | **Human-in-the-loop UI** : classification LLM + interface de validation/correction, boucle d'amélioration | 📦 | 4 | 4 | 0.7 | 2 | **5.6** |
| 25 | **Génération de tests par IA** : qualité mesurée par mutation testing (Stryker) vs tests écrits main | 🤖 | 4 | 4 | 0.7 | 2 | **5.6** |
| 26 | **Frameworks d'agents comparés** : LangGraph vs Claude Agent SDK vs CrewAI sur un même workflow *(déjà en Later)* | 🔧 | 4 | 5 | 0.7 | 3 | **4.7** |
| 27 | **Fine-tuning vs few-shot vs RAG** sur une même tâche de classification : coût/qualité/maintenance | 🔧 | 3 | 5 | 0.7 | 3 | **3.5** |
| 28 | **Spec-driven development** : PRD → implémentation par agent, mesurer l'écart avec l'intention | 🤖 | 3 | 5 | 0.6 | 3 | **3.0** |

## Lecture du classement

Trois patterns se dégagent :

- **Les briques transverses gagnent** (#1, #2, #9, #10) : structured output, chunking, évals et embeddings sont réutilisés par quasiment toutes les autres expériences. Les faire tôt rend tout le reste moins cher.
- **Les gros comparatifs descendent** (#18, #26, #27) malgré un fort impact d'apprentissage : l'effort les pénalise. Ils restent pertinents mais gagnent à venir après les briques (ex. le comparatif vector DB profite d'avoir déjà le harness d'évals du #9).
- **Le workflow dev est un quick win** (#4, #5, #8) : petit effort, bénéfice immédiat sur le labo lui-même — et matière à publier sur le site.

## Candidats "Next" proposés

1. **#1 Structured output** — la brique la plus réutilisable, effort minimal
2. **#9 Harness d'évals** — prérequis de fait pour la moitié du backlog
3. **#4 Skills Claude Code labo** — rend chaque expérience suivante plus rapide

## Filiations entre expériences

`#9 évals` → débloque #1, #2, #7, #10, #13, #21, #25 (tous ont besoin de mesurer).
`#2 chunking` + `#10 embeddings` → préparent #18 vector DB et #17 chatbot RAG.
`#18 vector DB` → prépare #15 matching et #21 recherche hybride.
`#3 MCP` + `#4 skills` → se combinent naturellement avec #8 code review.
