# Roadmap

## Now

- 001 — Async messaging : RabbitMQ vs Kafka, comparatif côte à côte (dashboard commun)
- 002 — POC produit avec design system (shadcn/ui) + données mockées (MSW) : tester la méthode avant de l'appliquer à une vraie feature TeamFit
- 003 — POC SaaS formulaires avec design system complet à tokens (IBM Carbon) : la variable inverse de 002 (système opinioné vs composants possédés), retheming par tokens
- 004 — Harness d'évals LLM : promptfoo vs DeepEval vs harness Vitest maison, sur une classification de 50 messages RH → **terminé**, verdict : harness maison (Vitest) adopté comme standard du labo (voir [experiments/004-harness-evals-llm](../experiments/004-harness-evals-llm/README.md))
- 005 — Compte-rendu de réunion structuré par ordre du jour : router les interventions vers les blocs connus de l'ordre du jour plutôt qu'un résumé plat, réutilise le harness de 004 (voir [experiments/005-compte-rendu-ordre-du-jour](../experiments/005-compte-rendu-ordre-du-jour/README.md))

## Next

- Observabilité / tracing distribué (OpenTelemetry)
- Vector DB / RAG (comparatif pgvector, Qdrant, Weaviate)

## Later

- Orchestration d'agents (comparatif frameworks)
- Infrastructure as Code (Terraform vs Pulumi)

## Backlog priorisé

Voir [backlog-ia.md](./backlog-ia.md) : 28 idées d'expériences IA scorées en RICE adapté (Réutilisabilité × Impact d'apprentissage × Confidence / Effort). Les entrées "Next"/"Later" existantes (vector DB, OTel, agents) y sont intégrées pour comparaison sur la même base.
