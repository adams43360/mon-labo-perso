# ADR 0002 — RabbitMQ vs Kafka pour l'expérience 001

## Statut
Accepté

## Contexte
Première expérience du labo sur l'asynchrone. Objectif : comprendre concrètement deux paradigmes de messaging via un scénario partagé (envoi de tâches, pause, retry, échec).

## Grille de comparaison

| Critère | RabbitMQ | Kafka |
|---|---|---|
| Modèle | Broker à queues, exchanges + routing keys | Log distribué, topics + partitions |
| Garantie de livraison | At-least-once via ack manuel | At-least-once par défaut, exactly-once via transactions |
| Rétention | Supprimé une fois consommé | Conservé selon la politique de rétention, rejouable |
| Ordre | Garanti par queue | Garanti par partition uniquement |
| Pause / retry / DLQ | Natif (exchange DLX) | À construire (topic d'erreurs, reset d'offset) |
| Complexité opérationnelle | Plus simple à opérer seul | Cluster + partitions, plus lourd |

## Décision
Implémenter les deux, côte à côte, derrière un contrat de message commun (`src/shared/task.ts`) et un dashboard unique qui bascule de backend par variable d'environnement.

## Conséquences
- Deux implémentations à maintenir en parallèle pour cette expérience
- Le dashboard doit exposer les mêmes actions (envoyer, pause, retry) même si leur implémentation diffère radicalement (DLQ native vs topic d'erreurs)
