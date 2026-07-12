# Mon labo personnel

Un carnet de bord public d'expérimentations avec l'IA et les architectures modernes — pas un portfolio figé, un journal vivant.

Chaque sujet exploré (messaging asynchrone, RAG, observabilité, orchestration d'agents...) suit le même cycle :

**Idée -> Analyse d'architecture (ADR) -> Implémentation + tests -> Documentation -> Publication -> Mise à jour du roadmap**

## Naviguer dans ce repo

- [`docs/00-vision.md`](docs/00-vision.md) — le pourquoi de ce labo
- [`docs/roadmap.md`](docs/roadmap.md) — ce qui est en cours, ce qui arrive
- [`docs/adr/`](docs/adr) — les décisions d'architecture, justifiées
- [`experiments/`](experiments) — chaque expérience, avec son code, ses tests, sa doc
- Le site (généré depuis ce repo) centralise tout ça avec une navigation chronologique — voir `docs/adr/0001-choix-generateur-site.md`

## Expériences

| # | Sujet | Statut |
|---|---|---|
| 001 | Async messaging — RabbitMQ vs Kafka | En cours |

## Conventions

Voir [`CLAUDE.md`](CLAUDE.md) pour les conventions de travail (commits, ADR, tests, i18n).
