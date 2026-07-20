---
slug: 005-compte-rendu-ordre-du-jour
title: "005 — Les comptes-rendus de réunion IA sont plats. On a testé une autre approche"
authors: [damien]
tags: [ia, evals]
date: 2026-07-20
---

Deuxième épisode de la série lancée avec [l'article précédent](/blog/004-harness-evals-llm) sur la mesure de fiabilité d'une IA. Cette fois, on s'attaque à un agacement du quotidien : les comptes-rendus de réunion générés par l'IA.

{/* truncate */}

## Le constat de départ

Les outils actuels (Otter, Fireflies, Fathom, les assistants intégrés à Zoom ou Teams…) produisent un résumé qui suit l'ordre chronologique de la discussion — une succession de phrases dans l'ordre où elles ont été dites. Pratique pour se remémorer l'ambiance de la réunion, beaucoup moins pour répondre vite à "qu'a-t-on décidé sur le budget ?" : il faut relire tout le texte pour retrouver le bon passage.

L'idée testée ici : beaucoup de réunions récurrentes (comité de pilotage, point de sprint, comité de direction) suivent un **ordre du jour connu à l'avance**. Plutôt qu'un résumé qui suit le fil de la conversation, pourquoi ne pas ranger chaque intervention directement dans le bon bloc de cet ordre du jour ?

## Le test

On a simulé un comité de pilotage fictif avec un ordre du jour à 5 points (budget, recrutement, priorités du trimestre, risques, points annexes), et 40 interventions de réunion inventées. Le vrai enjeu du test : certaines interventions sont volontairement piégeuses — quelqu'un mentionne un sujet budgétaire en pleine discussion recrutement, ou revient tardivement sur un point déjà traité une heure plus tôt. L'IA doit ranger chaque intervention **selon son contenu réel**, pas selon le sujet officiellement en cours de discussion à ce moment-là.

Deux IA testées (Claude et GPT-4o-mini), avec la méthode d'éval mise en place lors du précédent épisode.

## Le résultat, et pourquoi il est meilleur qu'il n'y paraît

Score brut : 82,5% de bonnes réponses pour les deux IA. À première vue, une note honnête mais pas éblouissante. Sauf qu'en regardant le détail, l'histoire est bien plus intéressante : **sur les cas pièges — ceux qui testent précisément l'idée de départ — le score grimpe à 100% et 92%.** Autrement dit, quand il s'agit de faire exactement ce qu'on voulait vérifier (ranger une intervention par son vrai sujet, peu importe le moment où elle est dite), l'IA ne se trompe quasiment jamais.

Alors d'où viennent les erreurs qui expliquent le 82,5% ? Pas de l'idée elle-même, mais de deux angles morts qu'on a repérés en creusant :

- **Une frontière mal définie dans notre propre test.** On avait prévu une catégorie "points annexes prévus à l'ordre du jour" à part d'un simple "hors sujet". Problème : rien dans le contenu d'une phrase ne permet de deviner si un point était "prévu" ou pas — c'est une information qui n'existe nulle part dans le texte lui-même. Les deux IA, logiquement, ont buté dessus de la même façon. C'est un défaut de conception du test, pas de l'IA.
- **Quelques questions du test étaient elles-mêmes ambiguës.** Une phrase comme *"il y a un risque de retard si le recrutement traîne encore"* parle à la fois d'un risque et d'un recrutement — les deux IA ont choisi "recrutement" alors qu'on attendait "risque". Une vraie zone grise qu'on n'avait pas anticipée en écrivant le test.

## Ce que ça change concrètement

Voici le même extrait de réunion, présenté des deux façons — un sujet budgétaire soulevé en pleine discussion recrutement, une candidature mentionnée tardivement en fin de réunion :

**Résumé plat (façon outil actuel)**

> Le budget trimestriel est consommé à 62%, cohérent avec le planning. Trois candidats sont en lice pour le poste de développeur backend. Une question a été posée sur le coût de la nouvelle embauche par rapport à l'enveloppe du trimestre. La priorité du prochain trimestre reste la refonte du module de facturation. Plus tard dans la réunion, une candidature intéressante est arrivée pour le poste QA.

**Compte-rendu structuré par ordre du jour**

> **Budget** — Consommation à 62% du budget trimestriel, cohérent avec le planning. Question soulevée sur le coût de la nouvelle embauche vs l'enveloppe (posée pendant le point recrutement).
>
> **Recrutement** — Trois candidats en lice pour le poste de développeur backend. Une candidature intéressante reçue pour le poste QA (mentionnée tardivement, en fin de réunion).
>
> **Roadmap** — Priorité du prochain trimestre : refonte du module de facturation.

Dans la version plate, la question budgétaire et la candidature tardive restent noyées à l'endroit exact où elles ont été dites — il faut tout relire pour les rattacher au bon sujet. Dans la version structurée, elles sont directement à leur place.

## Le verdict

**L'hypothèse tient.** Le mécanisme central — router une intervention par son vrai sujet plutôt que par le moment où elle est dite — fonctionne de façon fiable avec deux IA différentes. Les limites observées sont sur la conception du test, pas sur l'idée.

Prochaine étape : construire un vrai POC avec un ordre du jour réel et une réunion simulée plus longue et plus réaliste (pas 40 phrases isolées comme ici, mais une vraie discussion avec ses digressions), pour vérifier que ça tient à l'échelle. Ce sera l'objet d'un prochain article.

## Pour aller plus loin

Le code complet, le jeu de données et l'analyse détaillée des erreurs sont dans le repo : [`experiments/005-compte-rendu-ordre-du-jour`](https://github.com/adams43360/mon-labo-perso/tree/main/experiments/005-compte-rendu-ordre-du-jour). Une idée de test à proposer ? La [boîte à idées](https://docs.google.com/forms/d/e/1FAIpQLScoLCYcsYA1uCPFaJ12dQZVPGHOQ9f5Qvu-qtvsIzpqbUbPjw/viewform) reste ouverte.
