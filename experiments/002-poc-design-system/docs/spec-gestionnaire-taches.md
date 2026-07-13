# Spec vivante — Gestionnaire de tâches (POC neutre)

Cette spec est volontairement légère : le but de l'expérience 002 est de tester la méthode "spec + POC cliquable", pas de spécifier une vraie fonctionnalité produit.

## Contexte

Sujet neutre choisi pour valider que la méthode (design system + données mockées) tient la route avant de l'appliquer à une vraie feature.

## Hypothèse

Un POC construit avec un design system réel (pas une maquette statique) et une API simulée (MSW) donne des retours de test plus fiables qu'une maquette Figma, pour un coût de construction raisonnable.

## Parcours couvert par le POC

1. Voir la liste des tâches, filtrer par statut, rechercher par titre
2. Créer une tâche via un formulaire modal
3. Éditer une tâche existante
4. Supprimer une tâche
5. Observer le comportement en cas d'erreur réseau ou de latence (interrupteurs dédiés)

## Critères de succès de l'expérience

- [ ] Le POC tourne en local sans backend réel
- [ ] Les états de chargement / erreur / vide sont visibles et testables à la demande
- [ ] Le temps de construction du POC est jugé raisonnable au regard de ce qu'il apporte à la spec

## Statut

En cours — première implémentation avant premier tour de test
