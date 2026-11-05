const express = require('express')
const { updateUser, seeRanking, getProfile } = require('../controller/userController')
const {authMiddleware} = require('../middleware/authMiddleware')
const validate = require('../middleware/validateMiddleware')
const { updateSchema } = require('../schemas/userSchema')
const router = express.Router()

/**
 * @swagger
 * '/api/v1/user/profile/{id}':
 *   get:
 *     summary: Consulter un profil utilisateur
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant de l’utilisateur à consulter.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Réponse contenant la propriété user.
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
 *                 user:
 *                   type: object
 *                   nullable: true
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
router.get('/profile/:id', authMiddleware, getProfile)
/**
 * @swagger
 * /api/v1/user/update:
 *   patch:
 *     summary: Modifier le profil de l’utilisateur connecté
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             properties:
 *               firstname:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Clark
 *               lastname:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Kent
 *               email:
 *                 type: string
 *                 format: email
 *                 example: clark@example.com
 *               pseudo:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: Superman
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: 'Au moins 6 caractères dont une minuscule, une majuscule, un chiffre et un symbole.'
 *                 example: Password123!
 *     responses:
 *       '200':
 *         description: Profil modifié.
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
 *         description: 'Email ou pseudo déjà utilisé, ou données refusées par le contrôleur.'
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
 */
router.patch('/update', authMiddleware, validate(updateSchema), updateUser)
/**
 * @swagger
 * /api/v1/user/ranking:
 *   get:
 *     summary: Consulter le classement des utilisateurs
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Classement par points de victoire croissants.
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
 *                 ranking:
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
 *                       victorypts:
 *                         type: integer
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
router.get('/ranking', authMiddleware, seeRanking )
module.exports = router