# Analyse d'architecture — RabbitMQ vs Kafka

Voir aussi [`docs/adr/0002-rabbitmq-vs-kafka.md`](../../docs/adr/0002-rabbitmq-vs-kafka.md) pour la décision formelle.

## Le scénario partagé

Un producteur envoie des "tâches" (job générique avec un type et un payload). Un ou plusieurs consumers les traitent. Le dashboard permet de :

- envoyer une tâche
- mettre le consumer en pause / le relancer
- observer un échec de traitement
- visualiser où va la tâche en échec (DLQ RabbitMQ, ou topic d'erreurs Kafka)

## Pourquoi comparer plutôt que choisir

Les deux backends répondent à des besoins différents. RabbitMQ est un broker "intelligent" : il gère nativement le routage, les acquittements, et les dead-letter queues. Kafka est un log distribué : "broker bête, consommateur intelligent" — la rétention et le replay sont natifs, mais la gestion des échecs (retry, DLQ) doit être construite par l'application.

## Grille de comparaison

| Critère | RabbitMQ | Kafka |
|---|---|---|
| Modèle | Broker à queues, exchanges + routing keys | Log distribué, topics + partitions |
| Garantie de livraison | At-least-once via ack manuel | At-least-once par défaut, exactly-once via transactions |
| Rétention | Supprimé une fois consommé | Conservé selon la politique de rétention, rejouable |
| Ordre | Garanti par queue | Garanti par partition uniquement |
| Pause / retry / DLQ | Natif (exchange DLX) | À construire (topic d'erreurs, reset d'offset) |
| Complexité opérationnelle | Plus simple à opérer seul | Cluster + partitions, plus lourd |

## Ce que le code doit démontrer

- Un contrat de message commun (`src/shared/task.ts`) pour que la comparaison porte sur le comportement des backends, pas sur le format des données
- Le même ensemble d'actions dashboard pour les deux backends, avec des implémentations volontairement différentes en dessous (c'est le point pédagogique)
