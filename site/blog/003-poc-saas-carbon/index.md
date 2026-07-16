---
slug: 003-poc-saas-carbon
title: "003 — POC SaaS avec un design system complet à tokens (IBM Carbon)"
authors: [damien]
tags: [design-system, tokens]
date: 2026-07-16
---

L'expérience 002 testait des composants qu'on possède (shadcn/ui). Celle-ci inverse la variable : un design system complet, opinioné et piloté par des tokens — IBM Carbon (Apache 2.0) — sur un sujet dense en formulaires type SaaS.

{/* truncate */}

## Pourquoi une troisième expérience plutôt que d'étendre la 002

Une expérience = une question. 002 a validé la méthode "POC cliquable" ; 003 change une seule variable — le modèle de design system — pour obtenir un comparatif à périmètre égal. C'est la logique du labo : chaque test fait évoluer la méthode, pas seulement le code.

## Le choix de Carbon

Comparé à GitHub Primer, Adobe Spectrum et une architecture de tokens custom (W3C DTCG + Style Dictionary), Carbon l'emporte pour ce test : c'est l'un des rares systèmes open source où les tokens sont réellement structurants. Quatre thèmes complets (white, g10, g90, g100), des tokens sémantiques (`$layer`, `$text-primary`…), et des composants de formulaire riches prêts à l'emploi. Le DSFR, techniquement intéressant, est exclu : son usage est juridiquement réservé aux sites de l'État.

## Le sujet du POC

Un onboarding SaaS multi-étapes (organisation → préférences → invitations → récapitulatif) construit uniquement avec des composants Carbon, plus un sélecteur de thème qui rethème toute l'application via les tokens — la règle du jeu étant zéro CSS custom. Si on doit surcharger Carbon, c'est un enseignement à documenter.

## Ce qu'on comparera avec 002

Temps pour un écran crédible, liberté visuelle, theming (variables CSS ad hoc vs tokens sémantiques multi-thèmes), poids des dépendances, réutilisabilité pour un vrai produit. Les conclusions arriveront dans le README de l'expérience après le premier tour de test.

## Pour aller plus loin

Le code complet, l'analyse d'architecture et les instructions de lancement sont dans le repo : [`experiments/003-poc-saas-carbon`](https://github.com/adams43360/mon-labo-perso/tree/main/experiments/003-poc-saas-carbon).
