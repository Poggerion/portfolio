# Systems in Motion

Portfolio de Felipe Portugal, étudiant en génie logiciel à l'ÉTS.

**En ligne : [poggerion.github.io/portfolio](https://poggerion.github.io/portfolio/)**

Site statique bilingue (français et anglais) qui présente le parcours, les projets et les compétences.

## Technologies

- Next.js (App Router, export statique) et React, en TypeScript
- CSS Modules, sans bibliothèque d'interface
- Vitest et ESLint
- GitHub Actions et GitHub Pages pour le déploiement

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

## Nuages de points

Le nuage derrière la page change de forme selon la section : portrait, carte du Québec, téléphone, Spot, carte électronique, Cégep, ÉTS, puis le titre du contact. Les formes sont précalculées dans `public/clouds/` (16 384 points par forme, 8 octets par point) avec un aperçu fixe en WebP. Un point sur vingt flotte autour de la forme, en léger bruit d’ambiance.

```sh
npm run clouds     # régénère public/clouds/ à partir de cloud-sources/
```

Les photos sources (`cloud-sources/`) ne sont pas versionnées.

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
  components/scan/     panneau de scan et suivi de la section active
  content/             contenu bilingue, séparé de la présentation
  lib/                 outils de langue, d'URL et de section active
public/
  clouds/              formes du nuage de points (.bin) et aperçus (.webp)
  cv/                  CV en PDF, français et anglais
  og/                  images de partage 1200 × 630, une par langue
scripts/build-clouds.mts  génération des nuages de points (sharp)
tests/                 tests du contenu, de la section active et des nuages
```
