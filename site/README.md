# Site — mon labo personnel

Site Docusaurus qui centralise les expériences du labo, avec navigation chronologique (blog) et documentation (vision, roadmap, ADR).

## Développement local

```bash
npm install
npm start
```

Ouvre http://localhost:3000 (ou l'URL affichée).

## Build

```bash
npm run build
```

Génère le site statique dans `build/`. Le déploiement sur GitHub Pages se fait automatiquement via `.github/workflows/docs.yml` à chaque push sur `main`.

## Ajouter une expérience à la page d'accueil

1. Ajoute une entrée dans `src/data/experiences.ts` (titre, résumé, statut, lien vers le dossier de l'expérience)
2. Crée un billet de blog dans `blog/<numéro>-<nom-experience>/index.md` (frontmatter : slug, title, authors, tags, date), avec `{/* truncate */}` après le résumé pour couper l'aperçu sur la page blog
3. Le billet doit renvoyer vers `experiments/<numéro>-<nom-experience>/` sur GitHub pour le détail complet (code, ADR) — le site est une vitrine, pas une duplication du repo
