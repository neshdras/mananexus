jest.mock('../config/database', () => ({ query: jest.fn() }))

const db = require('../config/database')
const { getAllGames } = require('./gameModel')

describe('Game Model', () => {
    beforeEach(() => jest.resetAllMocks())

    it('returns games ordered by id', async () => {
        const games = [{ id_game: 1, name_game: 'Magic' }, { id_game: 2, name_game: 'Pokémon' }]
        db.query.mockResolvedValueOnce({ rows: games })

        await expect(getAllGames()).resolves.toEqual(games)
        expect(db.query).toHaveBeenCalledWith('SELECT id_game, name_game FROM games ORDER BY id_game')
    })

    it('returns an empty list when there are no games', async () => {
        db.query.mockResolvedValueOnce({ rows: [] })

        await expect(getAllGames()).resolves.toEqual([])
    })
})
