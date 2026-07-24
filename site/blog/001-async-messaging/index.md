---
slug: 001-async-messaging
title: "001 — Async messaging : RabbitMQ vs Kafka"
authors: [damien]
tags: [async]
date: 2026-07-12
---

Quand une tâche prend du temps — envoyer un email, générer un rapport, traiter une commande — on ne veut pas faire attendre l'utilisateur devant son écran. La solution classique : la déposer dans une file d'attente, traitée en coulisses par un autre programme. C'est ce qu'on appelle la messagerie asynchrone.

Première expérience du labo : comparer avec les mains, sur un même scénario, les deux technologies les plus connues pour faire ça — RabbitMQ et Kafka — pour comprendre concrètement leurs compromis plutôt qu'en survolant de la documentation.

{/* truncate */}

## Deux philosophies, pas une bonne réponse

RabbitMQ et Kafka répondent au même besoin — faire transiter des messages entre programmes — avec deux logiques opposées.

RabbitMQ est un "broker intelligent" : il sait quels messages ont bien été traités (via un accusé de réception) et route automatiquement les échecs vers une file spéciale — la dead-letter queue — pour ne rien perdre.

Kafka, lui, est plutôt un "broker bête, consommateur intelligent" : un journal (log) où les messages restent stockés même après lecture, rejouables à volonté. En échange de cette mémoire, la gestion des échecs (relancer un message raté, l'isoler) n'est pas fournie — c'est à l'application de la construire.

Ni l'un ni l'autre n'est meilleur dans l'absolu : le bon choix dépend de ce dont on a vraiment besoin.

## Le scénario de test

Pour comparer à périmètre égal, on a construit un même petit tableau de bord piloté par les deux backends en parallèle : envoyer une tâche fictive, mettre le traitement en pause, relancer un worker, et surtout observer où atterrit une tâche qui échoue.

Concrètement : côté RabbitMQ, la tâche en échec apparaît directement dans une file dédiée, sans rien coder de plus. Côté Kafka, il faut prévoir soi-même un "topic" (un canal) réservé aux erreurs, et la logique pour l'y envoyer.

## Ce qu'on en retient

| | RabbitMQ | Kafka |
|---|---|---|
| Bon pour | Traiter une tâche puis l'oublier, avec gestion d'échec prête à l'emploi | Conserver un historique complet, rejouable, à fort volume |
| Le prix à payer | Les messages traités disparaissent — pas d'historique | La gestion des échecs (retry, isolement) est à construire soi-même |
| Simplicité d'exploitation | Plus simple à opérer seul | Cluster plus lourd à faire tourner |

Concrètement : besoin de traiter une tâche puis passer à la suite, avec un filet de sécurité en cas d'échec ? RabbitMQ demande moins d'efforts. Besoin de garder une trace complète et rejouable de tout ce qui se passe — audit, gros volumes ? Kafka devient pertinent, à condition d'accepter de construire soi-même la gestion des échecs.

## Une idée de test à proposer ?

Si un sujet — IA ou pas — te trotte dans la tête et que tu te demandes "est-ce que ça marcherait vraiment ?", dépose-la ici : [**boîte à idées**](https://docs.google.com/forms/d/e/1FAIpQLScoLCYcsYA1uCPFaJ12dQZVPGHOQ9f5Qvu-qtvsIzpqbUbPjw/viewform).

## Pour aller plus loin

Le code complet, l'ADR détaillé et les instructions pour lancer l'expérience en local sont dans le repo : [`experiments/001-async-messaging`](https://github.com/adams43360/mon-labo-perso/tree/main/experiments/001-async-messaging).
