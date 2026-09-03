const express = require('express')  
const { register, login, sendToken, forgetPass } = require('../controller/authController')
const router = express.Router()

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
router.post('/register', register)

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

router.post('/login', login)
router.post('/send', sendToken)
router.post('/reset/:token', forgetPass)

module.exports = router