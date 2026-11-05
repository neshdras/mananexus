'use strict' // Active le mode strict de javascript pour detecter les erreurs courante et interdire les syntaxe nous sécurisé

const { z } = require('zod')
const validator = require('validator')

const loginSchema = z.object({
    identifiant: z.string().trim()
    .min(3, {error: "L'identifiant doit contenir au moins 3 caractère"})
    .refine(
        value => validator.isEmail(value ) || /^[a-zA-Z0-9_-]+$/.test(value), 
        {error: "Veuillez saisir un pseudo ou un email valide"}
    ),
    password: z.string().min(6, {error: "Le mot de passe doit avoir au moins 6 caractères"}).regex(/[A-Z]/, {error: "1 majuscule requises"}).regex(/[0-9]/, {error: "Au moins 1 chiffres requis"}).regex(/[^a-zA-z0-9]/, {error: "Au moins un caractère spécial requis"})

}).strict()

const sendTokenSchema = z.object({
    email: z.email({error: "adresse mail invaldie"}).trim().toLowerCase()
}).strict()
const resetPasswordSchema = z.object({
    password: z.string().min(6, {error: "Le mot de passe doit avoir au moins 6 caractères"}).regex(/[A-Z]/, {error: "1 majuscule requises"}).regex(/[0-9]/, {error: "Au moins 1 chiffres requis"}).regex(/[^a-zA-z0-9]/, {error: "Au moins un caractère spécial requis"})
}).strict()
module.exports = { loginSchema, sendTokenSchema, resetPasswordSchema }