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

## Alternative envisagée : Figma-first avec synchronisation par tokens

Cette expérience part du code (shadcn/ui) comme source de vérité. Une autre organisation du travail existe et mérite d'être documentée, notamment parce qu'elle correspond à un usage professionnel réel : le design system est défini dans Figma, les développeurs codent les éléments pour y correspondre et les publient (GitLab, GitHub...), et l'équipe product design construit ses maquettes et ses specs directement sur ce système.

### Ce que cette approche apporte

- Le design peut avancer plus vite et être en avance sur le dev — exploration de nouveaux patterns sans attendre un cycle d'implémentation
- N'importe qui dans l'organisation (PM, marketing, autres designers) peut consulter et réutiliser le système sans toucher au code
- Les visuels de spec produits par l'équipe product design s'appuient directement sur le système — cohérence garantie côté maquettes, dès la conception

### Le risque principal : la dérive entre les deux sources de vérité

Sans mécanisme de synchronisation, Figma et le code divergent avec le temps — quelqu'un modifie un composant d'un côté sans répercuter le changement de l'autre. Même l'équipe design system de Figma s'est fait piéger : en migrant son système de couleurs d'un tableur vers un outil structuré, elle a découvert plus de 280 écarts entre ce qui était censé être la référence et ce qui était réellement en usage. Le document de référence n'en était un que de nom.

### Ce qui règle ce risque aujourd'hui : les tokens comme source de vérité partagée

Plutôt que de trancher entre "Figma d'abord" ou "code d'abord", la pratique qui s'est standardisée en 2025-2026 consiste à définir les tokens (couleurs, espacements, typographie) dans un format neutre — le standard W3C DTCG, stabilisé en octobre 2025 — consommé à la fois par Figma (Variables natives, ou le plugin Tokens Studio pour des besoins plus avancés) et par le code (Style Dictionary transforme les tokens en CSS/Tailwind/Swift/etc.), avec une synchronisation automatisée en CI : une action qui ouvre une PR côté code dès qu'un token change côté Figma, sans étape manuelle de recopie.

### Pour ce labo : pourquoi code-first quand même, ici

Pour un POC solo, sans équipe design dédiée, l'aller-retour Figma → code n'apporte rien : shadcn/ui reste le bon choix pour ce cas précis — pas de délai de traduction, comportement interactif garanti dès l'écriture (les états de chargement/erreur simulés par MSW n'ont pas d'équivalent statique dans une maquette).

L'approche Figma-first + tokens partagés devient pertinente à partir du moment où plusieurs personnes produisent des specs en parallèle sur plusieurs surfaces (web, mobile, marketing) — c'est ce contexte-là, pas celui de ce labo, qui la justifie.
