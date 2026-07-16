---
tags: [design-system, tokens, carbon, poc, formulaires]
date: 2026-07-16
stack: [React, TypeScript, Vite, "@carbon/react", Sass, Vitest]
statut: en-cours
---

# 003 — POC SaaS avec design system à tokens (IBM Carbon)

## Contexte

Suite directe de l'expérience [002](../002-poc-design-system/README.md) : même méthode (POC cliquable), variable inversée. 002 testait des composants **possédés** (shadcn/ui) ; 003 teste un design system **complet et opinioné, piloté par des tokens** : [IBM Carbon](https://carbondesignsystem.com/) (Apache 2.0).

Voir [`ARCHITECTURE.md`](ARCHITECTURE.md) pour le comparatif (Carbon vs Primer vs Spectrum vs tokens DTCG custom) et [`docs/mini-prd.md`](docs/mini-prd.md) pour le périmètre.

## Sujet du POC

Un onboarding SaaS multi-étapes — volontairement générique :

1. **Organisation** : nom, secteur, taille d'équipe
2. **Préférences** : plan, notifications, date de lancement
3. **Invitations** : emails des coéquipiers
4. **Récapitulatif** + confirmation

Plus un **sélecteur de thème** (white / g90 / g100) pour démontrer le retheming intégral par tokens sémantiques, sans CSS custom.

## Lancer le POC

```bash
npm install
npm run dev
```

Ouvrir l'URL affichée par Vite (en général http://localhost:5173).

```bash
npm test        # tests unitaires (validation des étapes)
npm run build   # vérification TypeScript + build
```

## Ce qu'on a appris

_À compléter après le premier tour de test — inclure le comparatif 002 vs 003 (temps, DX, contraintes de personnalisation)._

## Structure

```
src/
├── features/onboarding/   # le parcours multi-étapes (étapes, validation, récap)
│   └── validation.ts      # règles de validation pures (testées)
├── App.tsx                # layout Carbon + sélecteur de thème
└── index.scss             # import des styles Carbon (seul point d'entrée CSS)
```

## Crédits

UI construite avec le [Carbon Design System](https://carbondesignsystem.com/) d'IBM (`@carbon/react`, licence Apache 2.0).

---

## English summary

Experiment 003 flips the variable tested in 002: instead of owned, copy-pasted components (shadcn/ui), it uses a complete, opinionated, token-driven design system — IBM Carbon (Apache 2.0). The POC is a generic multi-step SaaS onboarding flow (organization → preferences → invitations → summary) built exclusively with Carbon form components, plus a theme switcher (white / g90 / g100) proving that retheming happens entirely through semantic tokens, with zero custom CSS overrides. Findings and a 002-vs-003 comparison (speed, DX, customization constraints) will be documented after the first test round.
