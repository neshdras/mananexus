const express = require('express')
const router = express.Router()
const validate = require('../middleware/validateMiddleware')
const {deckSchema} = require('../schemas/deckSchema')
const {authMiddleware} = require('../middleware/authMiddleware')
const {addDeck, seeMyDecks, seeUserDecks, deleteDeck} = require('../controller/deckController')

/**
 * @swagger
 * /api/v1/deck/adddeck/{gameId}:
 *   post:
 *     summary: Ajouter une decklist pour un jeu
 *     tags:
 *       - Decklists
 *     security:
 *       - cookieAuth: []
 *     description: La decklist est associée à l’utilisateur connecté.
 *     parameters:
 *       - name: gameId
 *         in: path
 *         required: true
 *         description: Identifiant du jeu.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - format
 *               - url
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: Mon deck Commander
 *               format:
 *                 type: string
 *                 minLength: 2
 *                 example: Commander
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: 'Lien HTTP(S) provenant de moxfield.com, piltoverarchive.com ou riftdecks.com.'
 *                 example: https://moxfield.com/decks/example
 *     responses:
 *       '201':
 *         description: Decklist créée.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *                 - deck
 *               properties:
 *                 title:
 *                   type: string
 *                   example: Created
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 201
 *                 detail:
 *                   type: string
 *                 deck:
 *                   type: object
 *                   properties:
 *                     id_decklist:
 *                       type: integer
 *                     fk_id_user:
 *                       type: integer
 *                     fk_id_game:
 *                       type: integer
 *                     name_decklist:
 *                       type: string
 *                     format_decklist:
 *                       type: string
 *                     url_decklist:
 *                       type: string
 *                       format: uri
 *       '400':
 *         description: Identifiant du jeu invalide.
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
 *         description: Erreur serveur lors de la création de la decklist.
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
router.post('/adddeck/:gameId', authMiddleware, validate(deckSchema), addDeck)
/**
 * @swagger
 * /api/v1/deck/game/{gameId}:
 *   get:
 *     summary: Consulter les decklists de l’utilisateur connecté pour un jeu
 *     tags:
 *       - Decklists
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: gameId
 *         in: path
 *         required: true
 *         description: Identifiant du jeu.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 3
 *     responses:
 *       '200':
 *         description: Liste des decklists de l’utilisateur connecté pour ce jeu.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *                 - decks
 *               properties:
 *                 title:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 200
 *                 detail:
 *                   type: string
 *                 decks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_decklist:
 *                         type: integer
 *                       fk_id_user:
 *                         type: integer
 *                       fk_id_game:
 *                         type: integer
 *                       name_decklist:
 *                         type: string
 *                       format_decklist:
 *                         type: string
 *                       url_decklist:
 *                         type: string
 *                         format: uri
 *       '400':
 *         description: Identifiant du jeu invalide.
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
 *       '429':
 *         description: Trop de requêtes (limite globale de 100 requêtes par 15 minutes).
 *       '500':
 *         description: Erreur serveur lors de la consultation des decklists.
 */
router.get('/game/:gameId', authMiddleware, seeMyDecks)
router.get('/profile/:userId', authMiddleware, seeUserDecks)
/**
 * @swagger
 * /api/v1/deck/delete/{id}:
 *   delete:
 *     summary: Supprimer une decklist de l’utilisateur connecté
 *     tags:
 *       - Decklists
 *     security:
 *       - cookieAuth: []
 *     description: Seule une decklist appartenant à l’utilisateur connecté peut être supprimée.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant de la decklist à supprimer.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 7
 *     responses:
 *       '200':
 *         description: Decklist supprimée.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - status
 *                 - detail
 *                 - deck
 *               properties:
 *                 title:
 *                   type: string
 *                   example: Deleted
 *                 status:
 *                   type: integer
 *                   enum:
 *                     - 200
 *                 detail:
 *                   type: string
 *                 deck:
 *                   type: object
 *                   properties:
 *                     id_decklist:
 *                       type: integer
 *                     fk_id_user:
 *                       type: integer
 *                     fk_id_game:
 *                       type: integer
 *                     name_decklist:
 *                       type: string
 *                     format_decklist:
 *                       type: string
 *                     url_decklist:
 *                       type: string
 *                       format: uri
 *       '400':
 *         description: Identifiant de la decklist invalide.
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
 *         description: Decklist introuvable ou n’appartenant pas à l’utilisateur connecté.
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
 *         description: Erreur serveur lors de la suppression de la decklist.
 */
router.delete('/delete/:id', authMiddleware, deleteDeck)

module.exports = router
