# ADR 0001 — Choix du générateur de site

## Statut
Accepté

## Contexte
Le site doit centraliser les expériences avec une navigation chronologique ("au fil de l'eau"), supporter le FR/EN, et permettre d'embarquer des démos interactives (dashboards).

## Options considérées

| Critère | Docusaurus | Astro + Starlight |
|---|---|---|
| I18N | Natif, builds par locale, hreflang | Natif via i18next, sélecteur de langue |
| Navigation chronologique | Plugin blog natif | Pas de blog natif, à assembler |
| Démos interactives | MDX + composants React natifs | Islands React, hors du thème Starlight |
| Maturité / risque solo | Très large adoption, versioning natif | Plus jeune sur l'axe docs+blog combiné |

## Décision
Docusaurus. Le plugin blog natif correspond directement au besoin de navigation chronologique, et le support MDX facilite l'intégration des dashboards de démonstration.

## Conséquences
- Bundle plus lourd qu'Astro, builds plus lents — acceptable pour un site de contenu, pas une app
- Si le site évolue vers une interface produit sur-mesure, réévaluer Astro
