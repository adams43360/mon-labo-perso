# Mini-PRD — 006 · POC compte-rendu structuré par ordre du jour

## Contexte

L'expérience [005](../005-compte-rendu-ordre-du-jour/README.md) a validé le mécanisme central de l'idée : un LLM route fiablement une intervention de réunion vers le bon bloc d'ordre du jour (100%/92% d'accuracy sur les cas conçus pour le tester), indépendamment du bloc officiellement en cours. Mais 005 testait des phrases isolées, une par une — pas une vraie réunion, avec ses digressions, ses redites, son désordre naturel. Cette expérience POC vérifie si l'idée tient à l'échelle, sur un transcript complet traité en une seule fois, et produit une démonstration concrète et comparative (résumé plat généré par IA vs compte-rendu structuré généré par IA, sur le même contenu).

## Hypothèse

Un LLM peut lire un transcript de réunion complet et un ordre du jour, et produire directement un compte-rendu structuré par bloc (plutôt qu'un routage intervention par intervention comme en 005), avec une qualité perçue nettement supérieure à un résumé plat classique généré par la même IA sur le même contenu.

## Scope

Dans le périmètre :

- Un transcript de réunion fictif plus long et réaliste (~20-25 tours de parole, digressions et redites incluses) et un ordre du jour à 5 blocs, dans la continuité du scénario de 005
- Une génération en une seule passe (tout le transcript + l'ordre du jour dans un seul prompt), avec sortie structurée validée (schéma Zod)
- Une génération comparative d'un résumé plat classique, à partir du même transcript et du même modèle, pour une comparaison à conditions égales
- Un rendu HTML autonome (ouvrable dans un navigateur) présentant les deux résultats côte à côte — le "POC cliquable" de cette expérience
- Un jeu de tests unitaires sur la validation du schéma de sortie et la génération HTML, sans clé API

Hors périmètre :

- Un nouveau benchmark chiffré d'accuracy (déjà fait en 005 sur le mécanisme de routage) — cette expérience est qualitative, pas un nouveau comparatif de scores
- Une vraie interface web interactive (React, formulaire de saisie) : si le POC convainc, ce sera l'étape suivante, sur le modèle 002/003
- Transcription audio réelle, intégration calendrier/Notion : toujours hors périmètre du labo à ce stade

## Critères de succès

- [ ] Le générateur tourne sans clé API en mode test (schéma + rendu HTML testés avec des données figées)
- [ ] Un run réel produit une page HTML comparant clairement résumé plat vs compte-rendu structuré, sur le même transcript
- [ ] Verdict qualitatif : le compte-rendu structuré est-il lisiblement meilleur ? Tient-il sur un texte plus long et désordonné que les phrases isolées de 005 ?

## Risques

- Un seul transcript fictif ne suffit pas à généraliser — le verdict reste qualitatif et indicatif, pas statistique (c'est assumé : le chiffrage a déjà été fait en 005)
- La sortie structurée peut être mal formée (JSON invalide) : prévoir une validation Zod stricte avec un message d'erreur clair plutôt qu'un plantage silencieux

## Statut

En cours
