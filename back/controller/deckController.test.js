jest.mock('../model/deckModel', () => ({
    insertDeck: jest.fn(),
    getDecksByUserAndGame: jest.fn(),
    deleteDeckByIdAndUser: jest.fn()
}))

const { insertDeck, getDecksByUserAndGame, deleteDeckByIdAndUser } = require('../model/deckModel')
const { addDeck, seeMyDecks, deleteDeck } = require('./deckController')

describe('Deck Controller', () => {
    let req, res, deck
    beforeEach(() => {
        jest.resetAllMocks()
        req = {
            params: { gameId: '3', id: '7' },
            user: { id_user: 1 },
            body: { name: 'Mon deck', format: 'Commander', url: 'https://example.com/deck' }
        }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        deck = { id_decklist: 7, fk_id_user: 1, fk_id_game: 3, name_decklist: 'Mon deck', format_decklist: 'Commander', url_decklist: 'https://example.com/deck' }
    })

    describe('addDeck', () => {
        it('should create a deck for the connected user and selected game', async () => {
            insertDeck.mockResolvedValueOnce(deck)
            await addDeck(req, res)
            expect(insertDeck).toHaveBeenCalledWith(1, 3, req.body)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({ title: 'Created', status: 201, detail: 'Decklist created successfully', deck })
        })
        it.each(['abc', '0', '-1', '1.5'])('should reject invalid game id %s', async gameId => {
            req.params.gameId = gameId
            await addDeck(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ title: 'Bad request', status: 400, detail: 'Invalid game id' })
            expect(insertDeck).not.toHaveBeenCalled()
        })
        it('should return 500 if deck creation fails', async () => {
            insertDeck.mockRejectedValueOnce(new Error('Insert failed'))
            await addDeck(req, res)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ title: 'Server error', status: 500, detail: 'Insert failed' })
        })
    })

    describe('seeMyDecks', () => {
        it('should return the connected user decks for the selected game', async () => {
            const decks = [deck, { ...deck, id_decklist: 8 }]
            getDecksByUserAndGame.mockResolvedValueOnce(decks)
            await seeMyDecks(req, res)
            expect(getDecksByUserAndGame).toHaveBeenCalledWith(1, 3)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ title: 'Decklists retrieved', status: 200, detail: 'The connected user decklists were retrieved successfully', decks })
        })
        it('should return an empty list when the user has no decks for the game', async () => {
            getDecksByUserAndGame.mockResolvedValueOnce([])
            await seeMyDecks(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ title: 'Decklists retrieved', status: 200, detail: 'The connected user decklists were retrieved successfully', decks: [] })
        })
        it.each(['abc', '0', '-1', '1.5'])('should reject invalid game id %s', async gameId => {
            req.params.gameId = gameId
            await seeMyDecks(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ title: 'Bad request', status: 400, detail: 'Invalid game id' })
            expect(getDecksByUserAndGame).not.toHaveBeenCalled()
        })
        it('should return 500 if retrieving decks fails', async () => {
            getDecksByUserAndGame.mockRejectedValueOnce(new Error('Database unavailable'))
            await seeMyDecks(req, res)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ title: 'Server error', status: 500, detail: 'Database unavailable' })
        })
    })

    describe('deleteDeck', () => {
        it('should delete a deck belonging to the connected user', async () => {
            deleteDeckByIdAndUser.mockResolvedValueOnce(deck)
            await deleteDeck(req, res)
            expect(deleteDeckByIdAndUser).toHaveBeenCalledWith(7, 1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ title: 'Deleted', status: 200, detail: 'Decklist deleted successfully', deck })
        })
        it.each(['abc', '0', '-1', '1.5'])('should reject invalid deck id %s', async id => {
            req.params.id = id
            await deleteDeck(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ title: 'Bad request', status: 400, detail: 'Invalid decklist id' })
            expect(deleteDeckByIdAndUser).not.toHaveBeenCalled()
        })
        it('should return 404 if the deck does not belong to the user or does not exist', async () => {
            deleteDeckByIdAndUser.mockResolvedValueOnce(null)
            await deleteDeck(req, res)
            expect(deleteDeckByIdAndUser).toHaveBeenCalledWith(7, 1)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ title: 'Not found', status: 404, detail: 'Decklist not found' })
        })
        it('should return 500 if deleting the deck fails', async () => {
            deleteDeckByIdAndUser.mockRejectedValueOnce(new Error('Delete failed'))
            await deleteDeck(req, res)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ title: 'Server error', status: 500, detail: 'Delete failed' })
        })
    })
})
