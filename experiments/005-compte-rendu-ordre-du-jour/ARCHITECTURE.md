# Analyse d'architecture — Compte-rendu de réunion structuré par ordre du jour

## Le principe

L'expérience 004 a tranché l'outil d'évals du labo (harness maison Vitest). Cette expérience ne rouvre pas ce débat : elle réutilise directement cette méthode, sur une nouvelle tâche. La question n'est pas "avec quel outil mesurer" mais "est-ce que l'idée elle-même tient" — un LLM peut-il router fidèlement les échanges d'une réunion vers un ordre du jour connu à l'avance.

## Choix de la granularité de la tâche

Le vrai objectif final (produire un compte-rendu structuré complet) mélange deux problèmes différents : router chaque échange vers le bon bloc, et extraire dans chaque bloc les décisions/actions/points ouverts. Faire les deux dans une seule expérience violerait le principe "une expérience = une question" (cf. expérience 003). On isole le premier problème :

| Option | Ce qu'on teste | Risque |
|---|---|---|
| **Routage seul** (retenu) | Chaque intervention → le bon bloc d'ordre du jour, ou hors-sujet | Isolé, mesurable simplement en accuracy, réutilise le harness 004 tel quel |
| Routage + extraction (décisions/actions) | Les deux à la fois | Deux hypothèses mélangées ; si ça échoue, on ne sait pas laquelle est en cause |
| Extraction seule (sans routage) | Suppose le routage déjà résolu | Ne teste pas l'idée de départ de Damien (router par ordre du jour connu) |

**Décision : routage seul.** L'extraction fine (décisions/actions par bloc) devient candidate pour une expérience 006 si celle-ci est concluante — elle a d'ailleurs des atomes communs avec la brique "structured output fiable" du backlog (#1).

## Choix du format d'entrée : intervention isolée vs transcript complet

| Option | Description | Décision |
|---|---|---|
| **Intervention isolée + ordre du jour** (retenu) | Chaque cas de test est une intervention unique (comme un message email en 004), avec la liste des blocs d'ordre du jour fournie en contexte | Réutilise le harness 004 à l'identique (même forme : texte → catégorie). Permet une accuracy propre et comparable |
| Transcript complet en une passe | Fournir toute la réunion d'un coup, demander une sortie structurée par bloc | Plus proche de l'usage réel final, mais rend l'évaluation cas-par-cas impossible (une seule sortie à juger globalement, pas 40 mesures indépendantes) — reporté à une itération produit si l'expérience est concluante |

**Décision : intervention isolée.** C'est le choix qui permet de réutiliser tel quel `src/dataset.ts`, `src/scorer.ts`, `src/report.ts` de 004 (même shape `{ id, message, expected, difficulte }` → `Category`), avec uniquement le prompt système et le jeu de données qui changent. Le passage à un traitement "transcript complet en une passe" est noté comme prolongement naturel si l'hypothèse tient — pas testé ici.

## Construction du dataset

- **Ordre du jour fixe à 5 blocs** + une catégorie `hors_ordre_du_jour` (6 catégories, comme 004)
- **~40 interventions fictives**, dont au moins 30% de pièges construits sur 3 motifs :
  1. **Sujet mentionné en passant dans le mauvais bloc** ("pendant qu'on parle recrutement, ça va coûter combien...")
  2. **Reprise tardive d'un point déjà traité** (le tour de parole a lieu pendant le bloc N, mais le contenu relève du bloc N-2)
  3. **Banalité hors-sujet** (déjà couvert par la catégorie `hors_ordre_du_jour`, comme le `hors_sujet` de 004)
- Chaque cas garde l'ordre du bloc "officiellement en cours" en information annexe (`blocEnCours`), pour permettre de construire des pièges de type 2 sans ambiguïté sur ce qui doit être testé

## Ce que l'architecture reprend tel quel de 004

`src/types.ts`, `src/dataset.ts`, `src/scorer.ts`, `src/providers.ts`, `src/report.ts`, `src/run.ts` : structure identique, seuls `data/dataset.json`, `prompts/system.md` et la liste de catégories changent. Pas de nouveau comparatif promptfoo/DeepEval — le verdict de 004 s'applique.

## Ce que l'expérience doit produire

1. **Accuracy de routage** (globale + sur les pièges), avec matrice de confusion
2. **Une démonstration comparative** : un mini-transcript (5-6 interventions) présenté en résumé plat classique vs en compte-rendu structuré par bloc — pour juger visuellement, pas seulement en accuracy, si l'idée apporte un vrai gain de lisibilité
3. **Un verdict** : l'hypothèse tient-elle, et le sujet mérite-t-il une itération produit (POC cliquable, comme 002/003) au-delà du labo
