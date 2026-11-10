jest.mock('../model/gameModel', () => ({ getAllGames: jest.fn() }))

const { getAllGames } = require('../model/gameModel')
const { seeAll } = require('./gameController')

describe('Game Controller', () => {
    let req, res

    beforeEach(() => {
        jest.resetAllMocks()
        req = {}
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    })

    it('returns all available games', async () => {
        const games = [{ id_game: 1, name_game: 'Magic' }, { id_game: 2, name_game: 'Pokémon' }]
        getAllGames.mockResolvedValueOnce(games)

        await seeAll(req, res)

        expect(getAllGames).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            title: 'Games retrieved',
            status: 200,
            detail: 'The games were retrieved successfully',
            games,
        })
    })

    it('returns an empty list when no games exist', async () => {
        getAllGames.mockResolvedValueOnce([])

        await seeAll(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ games: [] }))
    })

    it('returns a server error when game lookup fails', async () => {
        getAllGames.mockRejectedValueOnce(new Error('Database unavailable'))

        await seeAll(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({
            title: 'Server error',
            status: 500,
            detail: 'Database unavailable',
        })
    })
})
