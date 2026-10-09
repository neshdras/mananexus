const express = require('express')  
const { register, login, sendToken, forgetPass, refreshAuth } = require('../controller/authController')
const router = express.Router()
const validate = require('../middleware/validateMiddleware')
const { loginSchema, sendTokenSchema, resetPasswordSchema } = require('../schemas/authSchema')
const {registerSchema} = require('../schemas/userSchema')

/**
 * @swagger
 * /auth/register:
 *      post:
 *          summary: créer un nouvel utilisateur
 *          tags: 
 *              - Auth
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - firstname
 *                              - lastname
 *                              - email
 *                              - password
 *                          optionnal:
 *                              - pseudo
 *                              - picture
 *                          properties:
 *                              firstname:
 *                                  type: string
 *                                  example: Superman
 *                              lastname:
 *                                  type: string
 *                                  example: Superman
 *                              email:
 *                                  type: string
 *                                  example: superman@pascher.com
 *                              password:
 *                                  type: string
 *                                  example: password123HuHu!
 *          responses:
 *              201:
 *                  description: Utilisateur créé avec succès
 *              400:
 *                  description: Données invalide
 *              500:
 *                  description: Erreur serveur
 */
router.post('/register', validate(registerSchema), register)

/**
 * @swagger
 * /auth/register:
 *      post:
 *          summary: créer un nouvel utilisateur
 *          tags: 
 *              - Auth
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - firstname
 *                              - lastname
 *                              - email
 *                              - password
 *                          properties:
 *                              firstname:
 *                                  type: string
 *                                  example: Superman
 *                              lastname:
 *                                  type: string
 *                                  example: Superman
 *                              email:
 *                                  type: string
 *                                  example: superman@pascher.com
 *                              password:
 *                                  type: string
 *                                  example: password123HuHu!
 *          responses:
 *              201:
 *                  description: Utilisateur créé avec succès
 *              400:
 *                  description: Données invalide
 *              500:
 *                  description: Erreur serveur
 */

router.post('/login', validate(loginSchema), login)
router.post('/send', validate(sendTokenSchema), sendToken)
router.post('/reset/:token', validate(resetPasswordSchema) ,forgetPass)
router.post('/refresh', refreshAuth)

module.exports = router