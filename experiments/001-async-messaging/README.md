# 001 — Async messaging : RabbitMQ vs Kafka

## Contexte

Première expérience du labo. Comparer concrètement deux paradigmes de messaging asynchrone via un scénario partagé : envoi de tâches, pause, retry, visualisation des échecs.

Voir [`ARCHITECTURE.md`](ARCHITECTURE.md) pour l'analyse d'architecture complète (grille de comparaison, choix des critères).

## Ce qu'on a appris

_À compléter au fil de l'expérience._

## Lancer l'expérience en local

```bash
docker compose up -d        # démarre RabbitMQ + Kafka
npm install
npm run dev:dashboard        # démarre l'API du dashboard sur http://localhost:3000
```

Ouvrir `src/dashboard/public/index.html` dans un navigateur pour piloter les deux backends (envoyer une tâche, pause, retry) depuis la même interface.

## Structure

```
src/
├── shared/       # contrat de message commun (schéma de tâche)
├── rabbitmq/     # producer + consumer RabbitMQ
├── kafka/        # producer + consumer Kafka
└── dashboard/    # API + UI de contrôle, commune aux deux backends
```

---

## EN — Async messaging: RabbitMQ vs Kafka

First experiment of the lab. A side-by-side comparison of two asynchronous messaging paradigms through a shared scenario: sending tasks, pausing, retrying, and inspecting failures. See `ARCHITECTURE.md` for the full architecture analysis.
