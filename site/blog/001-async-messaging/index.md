---
slug: 001-async-messaging
title: "001 — Async messaging : RabbitMQ vs Kafka"
authors: [damien]
tags: [async]
date: 2026-07-12
---

Première expérience du labo : comparer concrètement deux paradigmes de messaging asynchrone via un scénario partagé — envoi de tâches, pause, retry, visualisation des échecs.

{/* truncate */}

## Ce qu'on compare

RabbitMQ est un broker "intelligent" : routage par exchanges, acquittements, dead-letter queues natives. Kafka est un log distribué : rétention et replay natifs, mais la gestion des échecs (retry, DLQ) doit être construite par l'application.

## Le scénario de démo

Un producteur envoie des tâches, un consumer les traite. Un dashboard commun permet d'envoyer une tâche, de mettre la queue en pause, de relancer un worker, et de visualiser où va une tâche en échec — DLQ native côté RabbitMQ, topic d'erreurs dédié côté Kafka.

## Pour aller plus loin

Le code complet, l'ADR détaillé et les instructions pour lancer l'expérience en local sont dans le repo : [`experiments/001-async-messaging`](https://github.com/adams43360/mon-labo-perso/tree/main/experiments/001-async-messaging).
