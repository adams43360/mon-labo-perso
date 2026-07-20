# Mini-PRD — 005 · Compte-rendu de réunion structuré par ordre du jour

## Contexte

Les outils actuels de compte-rendu de réunion par IA (Otter, Fireflies, Fathom, Gemini/Zoom/Teams…) produisent un résumé linéaire qui suit l'ordre chronologique de la discussion, pas la structure de la réunion elle-même. Résultat : pour savoir "qu'a-t-on décidé sur le budget ?", il faut quand même parcourir tout le texte. Or beaucoup de réunions récurrentes (comité de pilotage, point de sprint, comité de direction) suivent un **ordre du jour connu à l'avance**. Cette expérience teste l'hypothèse que router automatiquement les échanges vers les blocs de cet ordre du jour donne un compte-rendu bien plus navigable qu'un résumé plat.

## Hypothèse

Étant donné un ordre du jour connu (une liste de blocs/sujets), un LLM peut router chaque intervention d'une réunion vers le bon bloc avec une précision élevée — y compris repérer les tangentes hors ordre du jour et les reprises tardives d'un point déjà traité. Cette expérience réutilise directement la méthode de classification et le harness d'évals validés en [004](../004-harness-evals-llm/README.md) (Vitest maison, adopté comme standard du labo) : pas de nouveau comparatif d'outils ici.

## Scope

Dans le périmètre :

- Un jeu d'interventions de réunion fictives (français), chacune annotée avec le bloc d'ordre du jour attendu
- Un ordre du jour fixe de 5 blocs + une catégorie "hors ordre du jour" pour les tangentes
- Des cas pièges : reprise d'un point déjà traité, sujet mentionné en passant dans le mauvais bloc, banalités sans rapport avec la réunion
- Mesure de la précision du routage (accuracy globale + accuracy sur les pièges), avec le harness Vitest de 004 adapté à cette tâche
- Une démonstration comparative texte : un même mini-transcript présenté en résumé plat vs en compte-rendu structuré par bloc, pour illustrer concrètement le gain de lisibilité

Hors périmètre :

- Transcription audio réelle (Whisper ou autre) : on part de texte déjà transcrit, fictif
- Extraction fine des décisions/actions/points ouverts à l'intérieur de chaque bloc (sujet naturel d'une expérience 006 si celle-ci est concluante)
- Intégration calendrier/Notion/Docs ou tout ce qui relèverait d'un vrai outil plutôt que d'une expérience de labo
- Diarisation (qui a dit quoi) : chaque intervention est fournie déjà attribuée à un tour de parole, sans ambiguïté sur le locuteur

## Critères de succès

- [ ] Le dataset couvre les 5 blocs + hors-sujet avec au moins 30% de cas pièges
- [ ] Le harness (adapté de 004) tourne en mode mock sans clé API, avec tests unitaires
- [ ] Un run réel donne une précision de routage mesurée et documentée, avec matrice de confusion
- [ ] La démonstration comparative (résumé plat vs structuré) est présentée dans le README pour juger visuellement le gain
- [ ] Un verdict clair : l'hypothèse tient-elle, et l'idée mérite-t-elle d'être creusée comme future brique produit ?

## Risques

- Les pièges "reprise d'un point déjà traité" demandent un minimum de contexte conversationnel (ordre des blocs) que l'évaluation cas-par-cas (comme en 004) ne capture pas nativement → à documenter comme limite du protocole plutôt qu'à sur-complexifier le dataset
- Un dataset uniquement synthétique ne garantit pas la généralisation à de vraies transcriptions (verbosité, désordre, interruptions réelles) → à noter explicitement comme limite dans le verdict, pas comme un problème à résoudre ici

## Statut

Documenté — hypothèse validée (100%/91.7% d'accuracy sur les pièges), score global de 82.5% expliqué par des limites du dataset (frontière divers/hors-sujet, cas faciles ambigus) plutôt que par la méthode. Verdict : mérite un POC cliquable. Voir `README.md` et `docs/issue-draft.md`.
