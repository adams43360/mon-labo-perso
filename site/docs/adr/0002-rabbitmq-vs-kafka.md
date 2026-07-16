---
sidebar_position: 2
---

# ADR 0002 — RabbitMQ vs Kafka pour l'expérience 001

## Statut
Accepté

## Grille de comparaison

| Critère | RabbitMQ | Kafka |
|---|---|---|
| Modèle | Broker à queues, exchanges + routing keys | Log distribué, topics + partitions |
| Garantie de livraison | At-least-once via ack manuel | At-least-once par défaut, exactly-once via transactions |
| Rétention | Supprimé une fois consommé | Conservé selon la politique de rétention, rejouable |
| Pause / retry / DLQ | Natif (exchange DLX) | À construire (topic d'erreurs, reset d'offset) |

## Décision
Implémenter les deux, côte à côte, derrière un contrat de message commun et un dashboard unique qui bascule de backend.

Détail complet dans [`docs/adr/0002-rabbitmq-vs-kafka.md`](https://github.com/adams43360/mon-labo-perso/blob/main/docs/adr/0002-rabbitmq-vs-kafka.md) sur GitHub.
