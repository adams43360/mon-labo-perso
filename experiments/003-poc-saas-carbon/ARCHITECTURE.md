# Analyse d'architecture — POC SaaS avec un design system complet à tokens (IBM Carbon)

## Le principe

L'expérience 002 a validé la méthode "POC cliquable" avec shadcn/ui : des composants copiés dans le projet, qu'on possède et qu'on style soi-même. Cette expérience teste l'approche opposée : adopter un design system **complet et opinioné**, piloté par des **tokens**, maintenu par une organisation tierce. La question n'est pas "lequel est le meilleur" mais "qu'est-ce que chaque modèle coûte et rapporte pour un POC dense en formulaires, type SaaS".

## Choix du design system à tokens

Critères : licence permissive, système de tokens réel (pas juste des variables CSS ad hoc), composants React maintenus, kits Figma officiels, densité de composants de formulaire.

| Critère | IBM Carbon | GitHub Primer | Adobe Spectrum | shadcn + tokens DTCG custom |
|---|---|---|---|---|
| Licence | Apache 2.0 | MIT | Apache 2.0 | MIT (mais tokens à construire soi-même) |
| Tokens | `@carbon/themes`, `@carbon/colors` — 4 thèmes complets (white, g10, g90, g100), tokens sémantiques (`$layer`, `$text-primary`…) | `@primer/primitives` (CSS vars / JSON) | `spectrum-tokens` (JSON, très granulaire) | Format W3C DTCG + Style Dictionary, tout à définir |
| Composants React | `@carbon/react`, très complet (formulaires riches : DatePicker, NumberInput, ProgressIndicator multi-étapes…) | `@primer/react`, orienté outils dev | React Spectrum / React Aria, excellent a11y | Copiés depuis shadcn, moins denses en formulaires |
| Kits Figma | Officiels, alignés sur les tokens | Officiels | Officiels | Communautaires |
| Personnalisation | Contrainte (l'esthétique IBM est marquée) | Moyenne | Contrainte | Totale |
| Effort de démarrage | Faible (npm install) | Faible | Moyen | Élevé (architecture de tokens à concevoir) |

**Décision : IBM Carbon.** Trois raisons :

1. **Contraste maximal avec 002.** shadcn = code possédé, style à construire ; Carbon = dépendance npm, système imposé. C'est ce contraste qui rend le comparatif instructif — même méthode POC, philosophie inverse.
2. **Les tokens sont le sujet.** Carbon est l'un des rares systèmes open source où les tokens sont réellement structurants : changer de thème (`white` → `g100`) rethème toute l'application via les tokens sémantiques, sans toucher aux composants. Exactement ce qu'on veut observer.
3. **Densité formulaires.** Pour un écran SaaS (onboarding, settings), Carbon fournit d'emblée ProgressIndicator, DatePicker, NumberInput, Toggle, InlineNotification… — là où 002 a dû assembler ses primitives.

### Alternatives écartées (et pourquoi)

- **shadcn + tokens DTCG custom** : la piste la plus formatrice sur l'outillage tokens (Style Dictionary, format W3C DTCG stabilisé fin 2025), mais elle prolonge 002 au lieu de tester un modèle différent. Gardée comme candidate pour une expérience 004 si le sujet tokens mérite d'être creusé seul.
- **Primer** : très propre, mais pensé pour des outils type GitHub ; moins riche en composants de formulaire SaaS.
- **Spectrum / React Aria** : référence en accessibilité, mais l'assemblage (Aria = comportements sans style) rapproche trop du modèle shadcn déjà testé.
- **DSFR** (design system de l'État français) : techniquement intéressant, mais son usage est **juridiquement réservé aux sites de l'État** — exclu même pour un POC.

## Ce que le POC doit démontrer

- Un parcours d'onboarding SaaS multi-étapes (3 étapes + récapitulatif) construit uniquement avec des composants Carbon
- Validation par étape avec messages d'erreur inline (le vocabulaire d'erreur de Carbon, pas le nôtre)
- Un **sélecteur de thème** (white / g90 / g100) prouvant que le retheming passe entièrement par les tokens
- Zéro CSS custom au-delà de la mise en page : si on doit surcharger Carbon, c'est un enseignement à documenter

## Ce qu'on comparera avec 002

| Axe | 002 (shadcn/ui) | 003 (Carbon) |
|---|---|---|
| Temps pour un écran de formulaire crédible | à mesurer | à mesurer |
| Liberté visuelle | totale | contrainte |
| Theming | variables CSS ad hoc | tokens sémantiques multi-thèmes |
| Poids / dépendances | minimal | lourd (Sass, bundle) |
| Réutilisable pour un vrai produit | oui, directement | oui si l'esthétique IBM convient |

## Crédits et licences

- [IBM Carbon Design System](https://carbondesignsystem.com/) — Apache 2.0, © IBM
- [`@carbon/react`](https://github.com/carbon-design-system/carbon/tree/main/packages/react) — Apache 2.0
