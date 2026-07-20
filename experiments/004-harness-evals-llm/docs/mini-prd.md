# Mini-PRD — 004 · Harness d'évals LLM

## Contexte

Le labo va enchaîner des expériences IA (structured output, chunking, embeddings, guardrails…) qui toutes nécessitent de **mesurer** la qualité des sorties LLM. Plutôt que de choisir un outil d'évals au feeling, cette expérience compare trois approches sur une tâche identique et fournit l'outil standard du labo.

## Hypothèse

Un harness maison sous Vitest suffit pour les besoins du labo (datasets < 1000 cas, métriques simples), mais les outils spécialisés apportent peut-être des gains de DX (rapports, diff entre runs, UI) qui justifient une dépendance. À vérifier concrètement, pas en théorie.

## Scope

Dans le périmètre :

- Tâche de référence : classification de 50 messages RH mockés en 6 catégories (dont 16 cas pièges annotés)
- Prompt système unique partagé par les 3 harness
- 3 implémentations : promptfoo (YAML), DeepEval (Python), harness maison (TypeScript + Vitest)
- 2 providers : Anthropic et OpenAI (clé API via variables d'environnement)
- Mode `mock` (classifieur heuristique local, déterministe) pour développer et tester sans clé API
- Rapport markdown généré (accuracy globale, accuracy pièges, matrice de confusion) prêt à coller dans l'issue

Hors périmètre :

- Métriques LLM-as-judge (pertinence, tonalité…) — la tâche est choisie exprès pour un scoring exact-match
- Comparaison de prompts ou de modèles en profondeur (c'est le rôle des expériences suivantes ; ici on compare les **outils**)
- Braintrust et autres SaaS (exclu : envoi de données à un tiers pour un labo perso)

## Critères de succès

- [ ] Les 3 harness tournent sur le même dataset avec le même prompt et produisent des scores comparables
- [ ] Le harness maison a des tests unitaires (scorer, dataset) qui passent sans clé API
- [ ] Le tableau de résultats et le comparatif DX sont remplis dans l'issue
- [ ] Un verdict clair : l'outil adopté pour le labo, avec justification

## Risques

- Écarts de scores entre outils dus à des différences de paramètres d'appel (température, max_tokens) → figer les paramètres dans un fichier partagé et les répliquer
- DeepEval évolue vite (breaking changes fréquents) → épingler la version dans `requirements.txt`
- 50 cas est petit : l'accuracy bouge de ±2 pts d'un run à l'autre → température 0 et comparaison sur les mêmes cas, pas entre runs

## Statut

Documenté — verdict rendu : harness maison (Vitest) adopté comme standard du labo. Voir `README.md` et `docs/issue-draft.md`.
