const express = require('express')  
const { register, login, sendToken, forgetPass, refreshAuth } = require('../controller/authController')
const router = express.Router()
const validate = require('../middleware/validateMiddleware')
const { loginSchema, sendTokenSchema, resetPasswordSchema } = require('../schemas/authSchema')
const {registerSchema} = require('../schemas/userSchema')
const { authMiddleware } = require('../middleware/authMiddleware')

router.get('/me', authMiddleware, (req, res) => {
    const { id_user, firstname_user, lastname_user, pseudo_user, email_user, picture_user } = req.user
    res.json({ user: { id_user, firstname_user, lastname_user, pseudo_user, email_user, picture_user } })
})

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Créer un utilisateur
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - pseudo
 *               - password
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
 *                 description: 'Au moins une majuscule, un chiffre et un caractère spécial.'
 *                 example: Password123!
 *     responses:
 *       '201':
 *         description: Utilisateur créé. Définit les cookies tokenRefresh et tokenAcess (orthographe actuelle du contrôleur).
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
 *                 user:
 *                   type: object
 *       '400':
 *         description: Email ou pseudo déjà utilisé.
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
router.post('/register', validate(registerSchema), register)

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Se connecter avec un email ou un pseudo
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - identifiant
 *               - password
 *             properties:
 *               identifiant:
 *                 type: string
 *                 minLength: 3
 *                 description: 'Email valide ou pseudo composé de lettres, chiffres, tirets et underscores.'
 *                 example: Superman
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: 'Au moins une majuscule, un chiffre et un caractère spécial.'
 *                 example: Password123!
 *     responses:
 *       '200':
 *         description: Connexion réussie. Définit les cookies HttpOnly tokenAccess (15 minutes) et tokenRefresh (7 jours).
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
 *                   properties:
 *                     id_user:
 *                       type: integer
 *                     firstname_user:
 *                       type: string
 *                     lastname_user:
 *                       type: string
 *                     pseudo_user:
 *                       type: string
 *                     email_user:
 *                       type: string
 *                       format: email
 *                     picture_user:
 *                       type: string
 *                       nullable: true
 *       '401':
 *         description: Identifiants incorrects.
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
 *                     - 401
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
router.post('/login', validate(loginSchema), login)
/**
 * @swagger
 * /api/v1/auth/send:
 *   post:
 *     summary: Obtenir un jeton de réinitialisation du mot de passe
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: clark@example.com
 *     responses:
 *       '200':
 *         description: Email de réinitialisation envoyé avec succès.
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
 *         description: Email invalide ou utilisateur introuvable.
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
router.post('/send', validate(sendTokenSchema), sendToken)
/**
 * @swagger
 * '/api/v1/auth/reset/{token}':
 *   post:
 *     summary: Réinitialiser le mot de passe
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: Jeton reçu via /api/v1/auth/send.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: 'Au moins 6 caractères dont une minuscule, une majuscule, un chiffre et un symbole.'
 *                 example: Password123!
 *     responses:
 *       '200':
 *         description: Mot de passe modifié.
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
 *         description: 'Mot de passe trop faible, jeton expiré ou non enregistré.'
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
router.post('/reset/:token', validate(resetPasswordSchema) ,forgetPass)
/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Renouveler le jeton d’accès
 *     tags:
 *       - Auth
 *     security:
 *       - refreshCookieAuth: []
 *     responses:
 *       '200':
 *         description: Jeton renouvelé pour 15 minutes via le cookie tokenAccess.
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
 *         description: Jeton de renouvellement invalide ou expiré.
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
 *       '404':
 *         description: Cookie tokenRefresh absent.
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
router.post('/refresh', refreshAuth)

module.exports = router
