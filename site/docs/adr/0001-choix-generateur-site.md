---
sidebar_position: 1
---

# ADR 0001 — Choix du générateur de site

## Statut
Accepté, avec un avenant sur le calendrier de mise en œuvre.

## Contexte
Le site doit centraliser les expériences avec une navigation chronologique ("au fil de l'eau"), supporter le FR/EN, et permettre d'embarquer des démos interactives.

## Décision initiale
Docusaurus — le plugin blog natif correspond directement au besoin de navigation chronologique, et le support MDX facilite l'intégration de démos.

## Avenant
Avec seulement 2-3 expériences, l'investissement complet (i18n, blog, versioning) était jugé prématuré. Une page d'accueil statique légère a été envisagée comme étape intermédiaire, avant de trancher pour l'initialisation complète de Docusaurus dès maintenant plutôt que de gérer une migration ultérieure.

## Conséquences
- Bundle plus lourd qu'une page statique — acceptable pour un site de contenu
- L'i18n complet (traduction EN de chaque billet) reste à construire au fil des expériences, pas fait rétroactivement d'un coup
