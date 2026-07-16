# Mini-PRD — Expérience 003 : POC SaaS avec design system à tokens (IBM Carbon)

## Contexte

L'expérience 002 a testé la méthode POC avec shadcn/ui (composants possédés, style à construire). Elle a conclu : "Ant Design resterait plus rapide à assembler pour un POC dense en formulaires — à réévaluer selon le sujet du prochain POC". Cette expérience prend le contre-pied : adopter un design system complet, opinioné et piloté par des tokens (IBM Carbon, Apache 2.0), sur un sujet dense en formulaires type SaaS. La logique du labo évolue avec les tests : 002 a validé la méthode, 003 teste une variable (le modèle de design system).

## Hypothèse

Un design system complet à tokens permet de construire un écran SaaS de formulaires crédible **plus vite** que l'assemblage de primitives, au prix d'une liberté visuelle réduite — et le retheming par tokens sémantiques fonctionne sans toucher au code des composants.

## Scope

Dans le périmètre :
- Onboarding SaaS multi-étapes (organisation → préférences → invitations → récapitulatif) avec les composants de formulaire Carbon
- Validation par étape, messages d'erreur inline, notification de succès
- Sélecteur de thème (white / g90 / g100) démontrant le retheming par tokens
- Comparaison documentée avec 002 (temps, DX, contraintes)

Hors périmètre :
- Backend réel ou données mockées réseau (MSW non nécessaire ici : le sujet est le design system, pas les états réseau — déjà couvert en 002)
- Personnalisation de la marque (on assume l'esthétique Carbon)
- Kit Figma (piste notée pour une expérience ultérieure)

## Critères de succès

- [ ] Le parcours 3 étapes + récap fonctionne de bout en bout avec validation
- [ ] Changer de thème rethème 100 % de l'écran sans CSS custom
- [ ] Zéro surcharge CSS des composants Carbon (ou chaque surcharge documentée comme enseignement)
- [ ] Section "Ce qu'on a appris" du README remplie avec le comparatif 002 vs 003

## Risques

- Poids du bundle et compilation Sass : friction possible avec Vite
- Esthétique IBM très marquée : risque de conclure "inutilisable pour une vraie marque" — c'est un résultat acceptable, à documenter
- Courbe d'apprentissage des conventions Carbon (grille 2x, tokens d'espacement)

## Statut

En cours
