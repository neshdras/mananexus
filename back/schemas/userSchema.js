'use strict'

const {z} = require('zod')

const userSchema = z.strictObject({
    firstname: z.string()
        .min(2, {error: "Le prénom doit avoir au moins 2 caractères"})
        .max(50, {error: "Le prénom doit avoir max 50 caractères"})
        .trim(),
    lastname: z.string()
        .min(2, {error: "Le nom doit avoir au moins 2 caractères"})
        .max(50, {error: "Le nom doit avoir au moins 2 caractères"})
        .trim(),
    email: z.email({error: "Adresse email invalide"})
        .trim()
        .toLowerCase(),
    pseudo: z.string()
        .min(3, {error: "Le pseudo doit avoir au moins 2 caractères"})
        .max(50, {error: "Le pseudo doit avoir au moins 2 caractères"})
        .trim(),
    password: z.string()
        .min(6, {error: "Le mot de passe doit avoir au moins 6 caractères"})
        .regex(/[A-Z]/, {error: "1 majuscule requises"})
        .regex(/[0-9]/, {error: "Au moins 1 chiffres requis"})
        .regex(/[^a-zA-z0-9]/, {error: "Au moins un caractère spécial requis"})
        
})
const registerSchema = userSchema
const updateSchema = userSchema.partial()
module.exports = {registerSchema, updateSchema}