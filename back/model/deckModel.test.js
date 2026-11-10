jest.mock('../config/database', () => ({ query: jest.fn() }))

const db = require('../config/database')
const {
    insertDeck,
    getDeckByID,
    getDecksByUserAndGame,
    getDecksByUser,
    deleteDeckByIdAndUser,
} = require('./deckModel')

describe('Deck Model', () => {
    beforeEach(() => jest.resetAllMocks())

    it('inserts a decklist and returns its joined game name', async () => {
        const deck = { id_decklist: 8, fk_id_user: 7, fk_id_game: 3, name_decklist: 'Control', name_game: 'Magic' }
        db.query.mockResolvedValueOnce({ rows: [deck] })

        await expect(insertDeck(7, 3, {
            name: 'Control', format: 'Standard', url: 'https://moxfield.com/decks/1',
        })).resolves.toEqual(deck)

        expect(db.query).toHaveBeenCalledWith(expect.stringContaining('INNER JOIN games'), [
            7, 3, 'Control', 'Standard', 'https://moxfield.com/decks/1',
        ])
    })

    it('returns undefined when a requested decklist does not exist', async () => {
        db.query.mockResolvedValueOnce({ rows: [] })

        await expect(getDeckByID(99)).resolves.toBeUndefined()
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM decklists WHERE id_decklist = $1', [99])
    })

    it('returns a decklist when its id exists', async () => {
        const deck = { id_decklist: 8, fk_id_user: 7 }
        db.query.mockResolvedValueOnce({ rows: [deck] })

        await expect(getDeckByID(8)).resolves.toEqual(deck)
    })

    it('lists the connected user decklists for one game', async () => {
        const decks = [{ id_decklist: 8, fk_id_game: 3, name_game: 'Magic' }]
        db.query.mockResolvedValueOnce({ rows: decks })

        await expect(getDecksByUserAndGame(7, 3)).resolves.toEqual(decks)
        expect(db.query).toHaveBeenCalledWith(expect.stringContaining('fk_id_user = $1 AND d.fk_id_game = $2'), [7, 3])
    })

    it('lists an empty set when the user has no decklists for that game', async () => {
        db.query.mockResolvedValueOnce({ rows: [] })

        await expect(getDecksByUserAndGame(7, 3)).resolves.toEqual([])
    })

    it('lists all decklists for a user ordered by game and name', async () => {
        const decks = [{ id_decklist: 8, fk_id_game: 3, name_game: 'Magic' }]
        db.query.mockResolvedValueOnce({ rows: decks })

        await expect(getDecksByUser(7)).resolves.toEqual(decks)
        expect(db.query).toHaveBeenCalledWith(expect.stringContaining('ORDER BY g.name_game, d.name_decklist'), [7])
    })

    it('returns an empty set when the user has no decklists', async () => {
        db.query.mockResolvedValueOnce({ rows: [] })

        await expect(getDecksByUser(7)).resolves.toEqual([])
    })

    it('deletes a decklist only for the matching user', async () => {
        const deck = { id_decklist: 8, fk_id_user: 7, fk_id_game: 3 }
        db.query.mockResolvedValueOnce({ rows: [deck] })

        await expect(deleteDeckByIdAndUser(8, 7)).resolves.toEqual(deck)
        expect(db.query).toHaveBeenCalledWith(expect.stringContaining('id_decklist = $1 AND fk_id_user = $2'), [8, 7])
    })

    it('returns null when the decklist is missing or owned by another user', async () => {
        db.query.mockResolvedValueOnce({ rows: [] })

        await expect(deleteDeckByIdAndUser(8, 12)).resolves.toBeNull()
    })
})
