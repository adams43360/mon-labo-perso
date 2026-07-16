---
slug: 002-poc-design-system
title: "002 — POC produit avec design system (shadcn/ui) + données mockées"
authors: [damien]
tags: [design-system]
date: 2026-07-13
---

Un POC cliquable — vrai design system, API simulée — pour tester une méthode : améliorer une spec produit et donner un environnement de test crédible, avant d'investir du temps de dev réel.

{/* truncate */}

## Le choix du design system

shadcn/ui plutôt qu'Ant Design ou Mantine : le code est copié dans le projet, pas importé comme dépendance. Le POC peut évoluer directement vers un vrai design system produit, sans migration ni verrou technique.

## Simuler une vraie API sans backend

MSW (Mock Service Worker) intercepte les vraies requêtes réseau au niveau du navigateur. Le POC fait de vrais appels `fetch`, MSW y répond avec des données simulées — ce qui permet de montrer des états de chargement, d'erreur, et de latence, exactement ce qui manque le plus souvent dans une spec.

## Le sujet du POC

Un gestionnaire de tâches volontairement neutre, avec deux interrupteurs pour forcer une erreur réseau ou une latence à la demande pendant une démo.

## Pour aller plus loin

Le code complet, l'ADR et les instructions de lancement sont dans le repo : [`experiments/002-poc-design-system`](https://github.com/adams43360/mon-labo-perso/tree/main/experiments/002-poc-design-system).
