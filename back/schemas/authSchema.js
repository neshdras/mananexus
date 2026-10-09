'use strict' // Active le mode strict de javascript pour detecter les erreurs courante et interdire les syntaxe nous sécurisé

const { z } = require('zod')
const validator = require('validator')

// const registerSchema = z.object({
//     firstname: z.string()
//     .min(2, {error: "Le prénom doit avoir au moins 2 caractères"})
//     .max(50, {error: "Le prénom doit avoir max 50 caractères"})
//     .trim(),
//     lastname: z.string()
//     .min(2, {error: "Le nom doit avoir au moins 2 caractères"})
//     .max(50, {error: "Le nom doit avoir au moins 2 caractères"})
//     .trim(),
//     email: z.email({error: "Adresse email invalide"}).trim().toLowerCase(),
//     pseudo: z.string().min(3, {error: "Le pseudo doit avoir au moins 2 caractères"}).max(50, {error: "Le pseudo doit avoir au moins 2 caractères"}).trim().nullable(),
//     password: z.string().min(6, {error: "Le mot de passe doit avoir au moins 6 caractères"}).regex(/[A-Z]/, {error: "1 majuscule requises"}).regex(/[0-9]/, {error: "Au moins 1 chiffres requis"}).regex(/[^a-zA-z0-9]/, {error: "Au moins un caractère spécial requis"})
// }).strict() // interdit tous champs supp non défini pour eviter le mass assignement (injection de paramètre non desiré)

const loginSchema = z.object({
    identifiant: z.string().trim()
    .min(3, {error: "L'identifiant doit contenir au moins 3 caractère"})
    .refine(
        value => validator.isEmail(value || /^[a-zA-Z0-9_-]+$/.test(value), 
        {error: "Veuillez saisir un pseudo ou un email valide"})
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