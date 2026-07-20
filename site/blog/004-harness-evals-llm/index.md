---
slug: 004-harness-evals-llm
title: "004 — Comment savoir si une IA se trompe ? On a testé trois façons de le mesurer"
authors: [damien]
tags: [ia, evals]
date: 2026-07-20
---

Quand on demande à une IA de faire une tâche répétitive — trier des messages, classer des documents, extraire une information — comment sait-on qu'elle fait bien son travail ? On ne peut pas se contenter de "ça a l'air correct" en regardant quelques exemples. Il faut une méthode pour la tester à grande échelle, objectivement, et pouvoir répéter le test à chaque fois qu'on change quelque chose. C'est ce qu'on appelle une **éval** (évaluation) — l'équivalent d'un contrôle qualité pour l'IA.

{/* truncate */}

## Le problème : plusieurs outils, aucune idée duquel choisir

Toutes les prochaines expériences IA du labo vont devoir mesurer si l'IA fait bien son travail. Plutôt que de se poser la question à chaque fois, autant trancher une bonne fois pour toutes : quel outil utiliser par défaut ? Trois candidats se distinguaient, chacun représentant une famille différente : **promptfoo** (un outil en ligne de commande dédié aux tests d'IA), **DeepEval** (un framework Python, pensé pour s'intégrer aux tests automatisés), et une solution maison construite directement dans la stack du labo (TypeScript + Vitest, l'outil de test déjà utilisé partout ailleurs dans le projet).

Plutôt que de choisir au feeling, on a organisé un test en trois manches : les faire travailler tous les trois sur exactement le même exercice, dans les mêmes conditions, et comparer.

## L'exercice : trier des emails de recrutement, avec des pièges

On a inventé 50 emails fictifs, comme on pourrait en recevoir sur une boîte de recrutement, et demandé à l'IA de les ranger dans 6 catégories : candidature, relance, désistement, demande d'information, remerciement, ou hors-sujet.

Le piège — littéralement — c'est que 16 de ces 50 messages sont volontairement ambigus, pour vérifier que l'IA comprend l'intention réelle et pas juste les mots employés. Par exemple :

- *"Merci encore pour l'entretien de la semaine dernière. Avez-vous pu avancer sur votre décision ?"* — le mot "merci" pourrait faire penser à un simple remerciement, mais le message est en réalité une relance.
- *"Merci beaucoup pour votre proposition, mais j'ai décidé de rester dans mon entreprise actuelle."* — un remerciement qui cache en fait un refus.
- *"Nous organisons un salon de recrutement, souhaitez-vous réserver un stand ?"* — parle de recrutement, mais c'est en fait une sollicitation commerciale sans rapport avec une candidature.

Sans ces pièges, une IA pourrait avoir 100% de bonnes réponses simplement en reconnaissant des mots-clés, sans vraiment comprendre le message. Avec eux, on mesure une vraie compréhension.

## Le test : deux IA, trois outils, un même verdict

On a fait passer ce test à deux IA différentes (Claude et GPT-4o-mini, d'Anthropic et OpenAI), en utilisant à chaque fois les trois outils sur exactement les mêmes 50 messages.

Résultat : **les trois outils sont arrivés exactement à la même conclusion.** Claude a obtenu 98% de bonnes réponses (49 sur 50, avec une seule erreur sur un cas vraiment limite — un candidat demandant s'il peut "repostuler" après un entretien passé, que l'IA a interprété comme une nouvelle candidature plutôt qu'une simple question). GPT-4o-mini, lui, a fait un sans-faute : 100%, y compris sur les 16 pièges.

C'est une bonne nouvelle en soi : ça veut dire que la mesure est fiable, peu importe l'outil utilisé pour la faire. Le vrai enseignement de cette expérience n'est donc pas dans les scores — mais dans la façon dont chaque outil s'est comporté pour y arriver.

## Le vrai départage : pas la précision, mais la simplicité d'usage

Puisque les trois outils mesurent la même chose avec la même fiabilité, la question devient : lequel est le plus simple et le plus fiable à utiliser au quotidien ?

Sur ce terrain, l'écart a été net. Le harness maison (construit avec Vitest, l'outil de test déjà utilisé partout ailleurs dans le labo) s'est installé en une minute et a produit un rapport clair, prêt à être collé directement dans une fiche de suivi. **promptfoo** a été presque aussi simple, avec en prime une jolie interface web pour explorer les résultats cas par cas — pratique pour une exploration rapide. **DeepEval**, en revanche, nous a fait perdre près d'une demi-heure avant le premier test réussi : son installation dépend d'un langage différent (Python) et d'une chaîne d'outils cachée qui a échoué à plusieurs reprises, pour des raisons qui n'avaient rien à voir avec l'IA elle-même — juste de la plomberie technique récalcitrante. Une vraie source de friction, à mille lieues de la fiabilité qu'on attend d'un outil de mesure.

## Le verdict, et ce que ça change pour la suite

**Le labo adopte le harness maison comme standard pour toutes les futures évals IA.** Il est déjà dans la même stack que le reste du projet, ne dépend d'aucun outil externe, et produit un rapport directement exploitable. promptfoo reste dans la boîte à outils pour de l'exploration ponctuelle. DeepEval est mis de côté pour l'instant — il pourrait redevenir utile si un futur test a besoin de ses fonctionnalités avancées (juger la pertinence ou la fidélité d'une réponse plutôt qu'une simple bonne/mauvaise réponse), mais ce n'est pas le choix par défaut.

Concrètement, cette expérience n'est pas un test isolé : c'est un outil qu'on va réutiliser directement pour la vingtaine d'expériences IA prévues dans le labo (voir la [roadmap](/docs/roadmap)) — extraction de données, résumés, recherche par similarité, et bien d'autres. Plutôt que de repartir de zéro à chaque fois, on a désormais une méthode testée, validée, et prête à l'emploi.

## Pour aller plus loin

Le code complet, le jeu de données de test, les trois implémentations et le détail chiffré des résultats sont dans le repo : [`experiments/004-harness-evals-llm`](https://github.com/adams43360/mon-labo-perso/tree/main/experiments/004-harness-evals-llm).
