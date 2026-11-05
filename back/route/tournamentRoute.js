const express = require('express')
const { seeAll, createTournament, updateTournament, addPlayer, delPlayer, seePlayer } = require('../controller/tournamentController')
const { authMiddleware } = require('../middleware/authMiddleware')
const validate = require('../middleware/validateMiddleware')
const { updateTournamentSchema, createTournamentSchema } = require('../schemas/tournamentSchema')
const router = express.Router()

/**
 * @swagger
 * /api/v1/tournament/seeAll:
 *   get:
 *     summary: Consulter les tournois à venir
 *     tags:
 *       - Tournois
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Résultat de la consultation des tournois.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *               properties:
 *                 title:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 200
 *                 detail:
 *                   type: string
 *                 tournaments:
 *                   type: array
 *                   items:
 *                     type: object
 *       '401':
 *         description: 'Cookie token absent, invalide, expiré ou utilisateur inexistant.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '429':
 *         description: Trop de requêtes (limite globale de 100 requêtes par 15 minutes).
 *       '500':
 *         description: Erreur serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *               properties:
 *                 title:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 500
 *                 detail:
 *                   type: string
 */
router.get('/seeAll', authMiddleware, seeAll )
/**
 * @swagger
 * /api/v1/tournament/create:
 *   post:
 *     summary: Créer un tournoi
 *     tags:
 *       - Tournois
 *     security:
 *       - cookieAuth: []
 *     description: L’organisateur est déduit de l’utilisateur connecté.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - name
 *               - format
 *               - date
 *               - price
 *               - paf
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: Tournoi du samedi
 *               format:
 *                 type: string
 *                 minLength: 2
 *                 example: Commander
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: 'Date ISO 8601 dans le futur, avec fuseau horaire.'
 *                 example: '2030-11-15T14:00:00+01:00'
 *               price:
 *                 type: string
 *                 minLength: 2
 *                 example: Deux boosters
 *               paf:
 *                 type: number
 *                 minimum: 0
 *                 exclusiveMinimum: true
 *                 example: 5
 *               location:
 *                 type: string
 *                 minLength: 2
 *                 example: Paris
 *     responses:
 *       '201':
 *         description: 'Tournoi créé, réponse contenant message et tournamentInfo.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *               properties:
 *                 title:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 201
 *                 detail:
 *                   type: string
 *                 tournamentInfo:
 *                   type: object
 *       '400':
 *         description: 'Un tournoi existe déjà pour ce format, cette date, cet organisateur et ce lieu.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *               properties:
 *                 title:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 400
 *                 detail:
 *                   type: string
 *       '401':
 *         description: 'Cookie token absent, invalide, expiré ou utilisateur inexistant.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '422':
 *         description: Corps rejeté par la validation Zod.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: Data invalid
 *                 status:
 *                   type: integer
 *                   example: 422
 *                 invalidParams:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                       message:
 *                         type: string
 *       '429':
 *         description: Trop de requêtes (limite globale de 100 requêtes par 15 minutes).
 *       '500':
 *         description: Erreur serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *               properties:
 *                 title:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 500
 *                 detail:
 *                   type: string
 */
router.post('/create',authMiddleware, validate(createTournamentSchema), createTournament)
/**
 * @swagger
 * '/api/v1/tournament/update/{id}':
 *   patch:
 *     summary: Modifier un tournoi
 *     tags:
 *       - Tournois
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du tournoi à modifier.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: Tournoi du samedi
 *               format:
 *                 type: string
 *                 minLength: 2
 *                 example: Commander
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: 'Date ISO 8601 dans le futur, avec fuseau horaire.'
 *                 example: '2030-11-15T14:00:00+01:00'
 *               price:
 *                 type: string
 *                 minLength: 2
 *                 example: Deux boosters
 *               paf:
 *                 type: number
 *                 minimum: 0
 *                 exclusiveMinimum: true
 *                 example: 5
 *               location:
 *                 type: string
 *                 minLength: 2
 *                 example: Paris
 *     responses:
 *       '200':
 *         description: Tournoi modifié.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *               properties:
 *                 title:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 200
 *                 detail:
 *                   type: string
 *       '401':
 *         description: 'Cookie token absent, invalide, expiré ou utilisateur inexistant.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Tournoi introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *               properties:
 *                 title:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 404
 *                 detail:
 *                   type: string
 *       '422':
 *         description: Corps rejeté par la validation Zod.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: Data invalid
 *                 status:
 *                   type: integer
 *                   example: 422
 *                 invalidParams:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                       message:
 *                         type: string
 *       '429':
 *         description: Trop de requêtes (limite globale de 100 requêtes par 15 minutes).
 *       '500':
 *         description: Erreur serveur.
 */
router.patch('/update/:id', authMiddleware, validate(updateTournamentSchema), updateTournament)
/**
 * @swagger
 * '/api/v1/tournament/join/{id}':
 *   post:
 *     summary: Inscrire l’utilisateur connecté à un tournoi
 *     tags:
 *       - Tournois
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du tournoi.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Inscription effectuée.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *               properties:
 *                 title:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 200
 *                 detail:
 *                   type: string
 *       '401':
 *         description: 'Cookie token absent, invalide, expiré ou utilisateur inexistant.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Tournoi indisponible pour la date du jour ou utilisateur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *               properties:
 *                 title:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 404
 *                 detail:
 *                   type: string
 *       '409':
 *         description: Utilisateur déjà inscrit.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *               properties:
 *                 title:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 409
 *                 detail:
 *                   type: string
 *       '429':
 *         description: Trop de requêtes (limite globale de 100 requêtes par 15 minutes).
 *       '500':
 *         description: Erreur serveur.
 */
router.post('/join/:id', authMiddleware, addPlayer)
/**
 * @swagger
 * '/api/v1/tournament/unjoin/{id}':
 *   delete:
 *     summary: Désinscrire l’utilisateur connecté d’un tournoi
 *     tags:
 *       - Tournois
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du tournoi.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Désinscription effectuée.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *               properties:
 *                 title:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 200
 *                 detail:
 *                   type: string
 *       '400':
 *         description: Utilisateur non inscrit.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *               properties:
 *                 title:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 400
 *                 detail:
 *                   type: string
 *       '401':
 *         description: 'Cookie token absent, invalide, expiré ou utilisateur inexistant.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Le contrôleur signale un tournoi ou un utilisateur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *               properties:
 *                 title:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 404
 *                 detail:
 *                   type: string
 *       '429':
 *         description: Trop de requêtes (limite globale de 100 requêtes par 15 minutes).
 *       '500':
 *         description: Erreur serveur.
 */
router.delete('/unjoin/:id', authMiddleware, delPlayer)
/**
 * @swagger
 * '/api/v1/tournament/{id}/players':
 *   get:
 *     summary: Lister les joueurs inscrits à un tournoi
 *     tags:
 *       - Tournois
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du tournoi.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Liste des joueurs inscrits.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *               properties:
 *                 title:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 200
 *                 detail:
 *                   type: string
 *                 players:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       firstname:
 *                         type: string
 *                       lastname:
 *                         type: string
 *                       pseudo:
 *                         type: string
 *       '401':
 *         description: 'Cookie token absent, invalide, expiré ou utilisateur inexistant.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '429':
 *         description: Trop de requêtes (limite globale de 100 requêtes par 15 minutes).
 *       '500':
 *         description: Erreur serveur.
 */
router.get('/:id/players', authMiddleware, seePlayer)
module.exports = router