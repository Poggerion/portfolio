# Systems in Motion

Portfolio de Felipe Portugal, étudiant en génie logiciel à l'ÉTS.

**En ligne : [poggerion.github.io/portfolio](https://poggerion.github.io/portfolio/)**

Site statique bilingue (français et anglais). Le mode professionnel présente le parcours, les projets et les compétences. Le mode créatif transforme la sculpture 3D de l'accueil en quatre domaines à explorer : logiciel, robotique, systèmes embarqués, données et infrastructure.

## Technologies

- Next.js (App Router, export statique) et React, en TypeScript
- Three.js pour la sculpture, générée de façon procédurale (aucun modèle 3D importé)
- CSS Modules, sans bibliothèque d'interface
- Vitest et ESLint
- GitHub Actions et GitHub Pages pour le déploiement

Le site reste lisible sans WebGL et respecte la préférence « mouvement réduit » : une image SVG de la même sculpture remplace alors la scène 3D.

## Lancer en local

Node 22.18 ou plus récent.

```sh
npm ci
npm run dev        # http://localhost:3000/fr/
```

## Vérifier et construire

```sh
npm run check      # typage, lint, tests, build
npm run build      # génère le site statique dans out/
```

Pour prévisualiser l'export, servir `out/` avec n'importe quel serveur de fichiers statiques, puis ouvrir `/fr/`.

## Déploiement

Chaque push sur `main` lance `.github/workflows/deploy.yml`, qui vérifie le projet, construit le site pour le chemin du dépôt (`/portfolio`) et le publie sur GitHub Pages.

Pour construire à la main pour une page de projet GitHub (`https://<utilisateur>.github.io/<dépôt>/`) :

```sh
NEXT_PUBLIC_BASE_PATH=/portfolio NEXT_PUBLIC_SITE_URL=https://poggerion.github.io npm run build
```

## Structure

```
src/
  app/
    (root)/            redirection de / vers /fr/ ou /en/
    [lang]/            accueil par langue
    [lang]/work/[slug] études de cas, une URL partageable par projet
  components/          composants de présentation
    sculpture/         scène WebGL (three.js) de la sculpture
    creative/          mode créatif
  content/             contenu bilingue, séparé de la présentation
  lib/
    sculpture/         géométrie procédurale de la sculpture (partagée entre WebGL et SVG)
scripts/
  generate-fallback.ts rendu SVG statique de la sculpture vers public/sculpture.svg
tests/                 tests du contenu et de la géométrie
```

## Sculpture

`src/lib/sculpture/geometry.ts` génère un faisceau de filaments tressés le long d'un nœud de tore. La même géométrie alimente la scène WebGL (`src/components/sculpture/`) et l'image SVG statique (`npm run sculpture`, vers `public/sculpture.svg`).
