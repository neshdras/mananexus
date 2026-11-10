# Shuffle Nexus — Front

Shuffle Nexus est une application web pour gérer son compte, consulter les profils et les tournois, et gérer ses decklists.

## Pré-requis

- Node.js
- npm

## Installation et lancement local

Depuis le dossier `front`, installez les dépendances et lancez le serveur de développement :

```bash
npm install
npm run dev
```

Vite affiche l’adresse locale de l’application dans le terminal, généralement `http://localhost:5173`.

## Configuration

Le front communique avec l’API via la variable `VITE_API_BASE_URL`. Sans cette variable, il utilise `http://localhost:3000/api/v1`.

Pour utiliser une autre API en local, créez `front/.env` et indiquez son URL :

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Commandes utiles

```bash
npm run dev      # lancer le serveur de développement
npm run build    # créer la version de production dans dist/
npm run preview  # prévisualiser la version compilée
npm run lint     # vérifier le code avec ESLint
```

## Déploiement

Le front est déployé sur Vercel : [shufflenexus.vercel.app](https://shufflenexus.vercel.app/). Le projet utilise `front/vercel.json` pour rediriger les routes de l’application vers `index.html`, notamment lors de l’accès direct à une page.

Dans les paramètres du projet Vercel, définissez `VITE_API_BASE_URL` avec l’URL de l’API de production, puis lancez le déploiement depuis le dossier `front`.

## Application installable

Le front est configuré comme une Progressive Web App (PWA) et peut être installé depuis un navigateur compatible.

## Documentation du back

Consultez le [README du back](../back/README.md) pour installer et configurer l’API.
