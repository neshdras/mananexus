'use strict'

const {z} = require('zod')
const domainesAutorises = ['moxfield.com', 'piltoverarchive.com', 'riftdecks.com', 'inkdecks.com', '']
const deckUrlSchema = z.string()
    .trim()
    .url()
    .refine((value) => {
        let url
        try {
            url = new URL(value)
        } catch {
            return false
        }
        return (
            ['https:', 'http:'].includes(url.protocol) &&
            domainesAutorises.includes(url.hostname)
        )
    }, {
        error: "Le lien doit venir d'un des sites autorisés"
    })

const deckSchema = z.object({
    name: z.string()
        .min(2, {error: "Le nom doit contenir au moins 2 caractères"})
        .trim(),
    format: z.string()
        .min(2, {error: "Veuillez selectionner un format valide"})
        .trim(),
    url: deckUrlSchema
})

module.exports = {deckSchema}
