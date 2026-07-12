# Conventions de travail — mon labo personnel

## Principes non négociables

- Analyse d'architecture avant le code. Chaque expérience commence par un `ARCHITECTURE.md` qui compare les options et justifie le choix, avant d'écrire la première ligne d'implémentation.
- Tout est tracé sur GitHub. Issues pour les idées, PR pour les changements, ADR pour les décisions structurantes.
- Documentation = code. Le `README.md` de chaque expérience est la source de vérité ; le site ne fait que l'agréger (frontmatter : tags, date, stack, statut).

## Structure d'une nouvelle expérience

1. Créer une issue depuis le template `nouvelle-experience.md`
2. Remplir le mini-PRD depuis `docs/product/template-experience.md`
3. Créer `experiments/NNN-nom-de-l-experience/`
4. Écrire `ARCHITECTURE.md` avant tout code
5. Implémenter + tests
6. Mettre à jour `docs/roadmap.md`

## Conventions techniques

- Commits : Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`)
- TypeScript strict, ESM, Node.js LTS
- Tests : Vitest, tests d'intégration via testcontainers quand un service externe est impliqué
- I18N : chaque `README.md` d'expérience a une version FR (par défaut) et une section ou un fichier EN quand le contenu est destiné au site public

## Stack du site

Docusaurus (voir `docs/adr/0001-choix-generateur-site.md`) — i18n natif, plugin blog pour la navigation chronologique, MDX pour embarquer des démos interactives.
