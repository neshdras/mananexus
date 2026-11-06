jest.mock('../model/deckModel', () => ({
    insertDeck: jest.fn(),
    getDecksByUserAndGame: jest.fn(),
    getDecksByUser: jest.fn(),
    deleteDeckByIdAndUser: jest.fn(),
}))

const deckModel = require('../model/deckModel')
const { addDeck, seeMyDecks, seeUserDecks, deleteDeck } = require('./deckController')

describe('Deck Controller', () => {
    let req, res

    beforeEach(() => {
        jest.resetAllMocks()
        req = { params: {}, body: {}, user: { id_user: 7 } }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    })

    describe('addDeck', () => {
        it('should add a decklist for the connected user and selected game', async () => {
            req.params.gameId = '3'
            req.body = { name: 'Control', format: 'Standard', url: 'https://moxfield.com/decks/1' }
            const deck = { id_decklist: 8, fk_id_user: 7, fk_id_game: 3, ...req.body }
            deckModel.insertDeck.mockResolvedValueOnce(deck)

            await addDeck(req, res)

            expect(deckModel.insertDeck).toHaveBeenCalledWith(7, 3, req.body)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Created',
                status: 201,
                detail: 'Decklist created successfully',
                deck,
            })
        })

        it.each(['abc', '0', '-2', '1.5'])('should reject invalid game id %s', async (gameId) => {
            req.params.gameId = gameId

            await addDeck(req, res)

            expect(deckModel.insertDeck).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Bad request',
                status: 400,
                detail: 'Invalid game id',
            })
        })

        it('should return 500 when insertion fails', async () => {
            req.params.gameId = '3'
            deckModel.insertDeck.mockRejectedValueOnce(new Error('Database unavailable'))

            await addDeck(req, res)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Server error',
                status: 500,
                detail: 'Database unavailable',
            })
        })
    })

    describe('seeMyDecks', () => {
        it('should list decklists for the connected user and selected game', async () => {
            req.params.gameId = '3'
            const decks = [{ id_decklist: 8, fk_id_game: 3, name_decklist: 'Control' }]
            deckModel.getDecksByUserAndGame.mockResolvedValueOnce(decks)

            await seeMyDecks(req, res)

            expect(deckModel.getDecksByUserAndGame).toHaveBeenCalledWith(7, 3)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Decklists retrieved',
                status: 200,
                detail: 'The connected user decklists were retrieved successfully',
                decks,
            })
        })

        it.each(['abc', '0', '1.5'])('should reject invalid game id %s', async (gameId) => {
            req.params.gameId = gameId

            await seeMyDecks(req, res)

            expect(deckModel.getDecksByUserAndGame).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(400)
        })

        it('should return 500 when listing decklists fails', async () => {
            req.params.gameId = '3'
            deckModel.getDecksByUserAndGame.mockRejectedValueOnce(new Error('Database unavailable'))

            await seeMyDecks(req, res)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Server error',
                status: 500,
                detail: 'Database unavailable',
            })
        })
    })

    describe('seeUserDecks', () => {
        it('should list the requested user decklists', async () => {
            req.params.userId = '12'
            const decks = [{ id_decklist: 3, fk_id_game: 1, name_decklist: 'Control' }]
            deckModel.getDecksByUser.mockResolvedValueOnce(decks)

            await seeUserDecks(req, res)

            expect(deckModel.getDecksByUser).toHaveBeenCalledWith(12)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Decklists retrieved',
                status: 200,
                detail: 'The requested user decklists were retrieved successfully',
                decks,
            })
        })

        it('should return an empty list when the user has no decklists', async () => {
            req.params.userId = '12'
            deckModel.getDecksByUser.mockResolvedValueOnce([])

            await seeUserDecks(req, res)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ decks: [] }))
        })

        it.each(['abc', '0', '1.5'])('should reject invalid user id %s', async (userId) => {
            req.params.userId = userId

            await seeUserDecks(req, res)

            expect(deckModel.getDecksByUser).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(400)
        })

        it('should return 500 when listing a user decklists fails', async () => {
            req.params.userId = '12'
            deckModel.getDecksByUser.mockRejectedValueOnce(new Error('Database unavailable'))

            await seeUserDecks(req, res)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Server error',
                status: 500,
                detail: 'Database unavailable',
            })
        })
    })

    describe('deleteDeck', () => {
        it('should scope deletion to the connected user', async () => {
            req.params.id = '18'
            const deck = { id_decklist: 18, fk_id_user: 7 }
            deckModel.deleteDeckByIdAndUser.mockResolvedValueOnce(deck)

            await deleteDeck(req, res)

            expect(deckModel.deleteDeckByIdAndUser).toHaveBeenCalledWith(18, 7)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Deleted',
                status: 200,
                detail: 'Decklist deleted successfully',
                deck,
            })
        })

        it('should return 404 when the decklist is missing or belongs to another user', async () => {
            req.params.id = '18'
            deckModel.deleteDeckByIdAndUser.mockResolvedValueOnce(null)

            await deleteDeck(req, res)

            expect(deckModel.deleteDeckByIdAndUser).toHaveBeenCalledWith(18, 7)
            expect(res.status).toHaveBeenCalledWith(404)
        })

        it.each(['abc', '0', '-1', '2.5'])('should reject invalid decklist id %s', async (deckId) => {
            req.params.id = deckId

            await deleteDeck(req, res)

            expect(deckModel.deleteDeckByIdAndUser).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(400)
        })

        it('should return 500 when deletion fails', async () => {
            req.params.id = '18'
            deckModel.deleteDeckByIdAndUser.mockRejectedValueOnce(new Error('Database unavailable'))

            await deleteDeck(req, res)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Server error',
                status: 500,
                detail: 'Database unavailable',
            })
        })
    })
})
