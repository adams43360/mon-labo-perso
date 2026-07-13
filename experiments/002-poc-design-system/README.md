# 002 — POC produit avec design system (shadcn/ui) + données mockées

## Contexte

Cette expérience teste une méthode, pas une fonctionnalité produit réelle : peut-on construire un POC cliquable — avec un vrai design system et une API simulée — pour améliorer une spec produit et donner un environnement de test crédible, avant d'investir du temps de dev réel ?

Voir [`ARCHITECTURE.md`](ARCHITECTURE.md) pour l'analyse (choix du design system, choix de MSW pour les données mockées) et [`docs/spec-gestionnaire-taches.md`](docs/spec-gestionnaire-taches.md) pour la "spec vivante" qui accompagne ce POC.

## Sujet du POC

Un gestionnaire de tâches simple — volontairement neutre — avec :
- liste filtrable par statut + recherche
- création / édition / suppression d'une tâche
- deux interrupteurs de simulation : erreur réseau et latence, pour montrer les états qu'une maquette statique ne montre jamais (chargement, erreur, retry)

## Lancer le POC

```bash
npm install
npx msw init public --save   # génère le service worker MSW (une seule fois)
npm run dev
```

Ouvrir l'URL affichée par Vite (en général http://localhost:5173).

## Ce qu'on a appris

_À compléter après le premier tour de test._

## Structure

```
src/
├── components/ui/    # primitives shadcn (Button, Input, Select, Dialog, Badge, Skeleton)
├── features/tasks/   # la feature du POC (liste, filtres, formulaire)
├── mocks/            # handlers MSW (données, latence, erreurs simulées)
└── lib/              # utilitaires (cn, appels API)
```

---

## EN — Product POC with a design system + mocked data

Testing a method, not a real feature: build a clickable POC — real design system, simulated API — to sharpen a product spec and give testers a credible environment before committing real dev time. See `ARCHITECTURE.md` for the analysis.
