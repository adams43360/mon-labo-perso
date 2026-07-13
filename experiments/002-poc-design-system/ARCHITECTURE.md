# Analyse d'architecture — POC produit avec design system

## Le principe

Un cran au-dessus d'une maquette Figma statique, un cran en dessous du vrai dev : un POC cliquable, avec de vrais composants et de vraies interactions, mais sans backend réel. Deux briques à choisir : le design system (l'UI) et la façon de simuler les données (le comportement réseau).

## Choix du design system

| Critère | shadcn/ui | Ant Design | Mantine |
|---|---|---|---|
| Licence | MIT | MIT | MIT |
| Modèle | Code copié dans le projet, tu le possèdes | Dépendance npm classique | Dépendance npm classique |
| Vitesse pour un POC dense en données | Moyenne (moins de composants prêts à l'emploi) | Très rapide (tables/formulaires riches) | Rapide |
| Réutilisable pour un vrai produit ensuite | Oui, directement (pas de verrou technique) | Oui, mais impose son propre look | Oui |
| Écosystème IA (Claude Code, v0...) | Très bien supporté | Standard | Standard |

**Décision : shadcn/ui.** Le code étant copié dans le projet plutôt qu'importé comme dépendance, le POC peut évoluer directement vers un vrai design system produit sans migration ni verrou technique. Pour un POC ponctuel très dense en tableaux/formulaires, Ant Design resterait plus rapide à assembler — à réévaluer selon le sujet du prochain POC.

## Choix de la simulation de données : MSW (Mock Service Worker)

L'alternative aurait été des données codées en dur dans les composants (`const tasks = [...]`). Problème : ça ne montre jamais les états de chargement, d'erreur, ou de latence — exactement ce qui manque le plus souvent dans une spec.

MSW intercepte les vraies requêtes réseau (fetch) au niveau du navigateur : le code applicatif fait de vrais appels `fetch('/api/tasks')`, MSW les intercepte et répond avec des données simulées. Avantages pour ce cas d'usage :
- les mêmes handlers peuvent servir au POC, aux tests, et plus tard aux vrais tests d'intégration
- on peut simuler des scénarios précis (erreur 500, latence de 2s) via des en-têtes de requête, pilotés par des interrupteurs dans l'UI elle-même

## Ce que le POC doit démontrer

- Liste de tâches avec filtre par statut et recherche
- Formulaire de création/édition dans une modale (Dialog)
- Suppression avec confirmation
- Skeleton pendant le chargement, message d'erreur avec retry, état vide
- Deux interrupteurs pour forcer une erreur réseau ou une latence, afin de tester ces états à la demande pendant une démo
