# Shuffle Nexus API

Shuffle Nexus est une API REST Express pour gérer les comptes, les profils, les jeux, les decklists et les tournois de Shuffle Nexus.

## Pré-requis

- Node.js
- npm
- Une base de données PostgreSQL accessible par l’API

## Installation et lancement local

Depuis le dossier `back`, créez un fichier `.env` avec les variables nécessaires, puis lancez :

```bash
npm install
npm start
```

L’API est disponible sur `http://localhost:3000`. Le port peut être modifié avec la variable `PORT`.

## Configuration

Les variables à définir dans `back/.env` sont :

```env
PORT=3000
DATABASE_URI=postgresql://utilisateur:motdepasse@localhost:5432/shufflenexus
JWT_SECRET=remplacer-par-une-cle-secrete
BREVO_API_KEY=cle-api-brevo
URL_WEBSITE=http://localhost:5173
```

`DATABASE_URI` et `JWT_SECRET` sont nécessaires au fonctionnement de l’API. `BREVO_API_KEY` et `URL_WEBSITE` servent à envoyer les liens de réinitialisation de mot de passe. Ne publiez pas les valeurs secrètes dans le dépôt.

## Documentation et routes principales

La documentation interactive des routes est disponible sur `http://localhost:3000/api-docs`.

- `GET /` — vérifier que l’API répond
- `POST /api/v1/auth/register` et `POST /api/v1/auth/login` — créer un compte et se connecter
- `POST /api/v1/auth/send` et `POST /api/v1/auth/reset/:token` — réinitialiser un mot de passe
- `GET /api/v1/user/profile/:id` et `GET /api/v1/user/ranking` — consulter un profil et le classement
- `GET /api/v1/tournament/seeAll` et `POST /api/v1/tournament/create` — consulter et créer des tournois
- `GET /api/v1/game/seeAll` — consulter les jeux disponibles
- `POST /api/v1/deck/adddeck/:gameId` et `GET /api/v1/deck/game/:gameId` — gérer ses decklists

Les routes protégées nécessitent une session valide. La connexion fournit des cookies d’authentification utilisés par l’API.

## Tests

```bash
npm test
```
