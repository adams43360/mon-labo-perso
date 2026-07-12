# Site — pas encore initialisé

Ce dossier accueillera le site Docusaurus qui agrège les expériences (voir `docs/adr/0001-choix-generateur-site.md`).

## Initialiser

```bash
cd site
npx create-docusaurus@latest . classic --typescript
```

Puis :
- activer le plugin i18n (`fr` par défaut, `en` en complément) dans `docusaurus.config.ts`
- brancher le plugin blog sur les `README.md` des expériences (via un plugin de contenu personnalisé ou une étape de build qui copie/normalise le frontmatter)
- déployer via `.github/workflows/docs.yml` (GitHub Pages)
