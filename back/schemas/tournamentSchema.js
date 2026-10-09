'use strict'
const {z}= require('zod')

const tournamentSchema = z.strictObject({
name: z.string()
    .min(2, {error: "Le nom doit contenir au moins 2 caractères"})
    .trim(),
format: z.string()
    .min(2, {error: "Veuillez selectionner un format valide"})
    .trim(),
date: z.iso.datetime({
    offset: true,
    message: "Invalid date format"
}).refine(
    (date) => new Date(date) > new Date(),
    {
        message: "The dat emust be in the future"
    }
),
price: z.string()
    .min(2, {error: "Need at least 2 caracters"})
    .trim(),
paf: z.number()
    .positive({error: "The participing price need to be positive"}),
location: z.string()
    .min(2, {error: "Location need at least 2 caracter"})
    .trim(),    
})
const createTournamentSchema = tournamentSchema
const updateTournamentSchema = tournamentSchema.partial()

module.exports = {createTournamentSchema, updateTournamentSchema}