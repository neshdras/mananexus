jest.mock('pg', () => ({
    Pool: jest.fn().mockImplementation(() => ({
        query: jest.fn(),
    })),
}))

const { Pool } = require('pg')
const database = require('./database')

describe('Database adapter', () => {
    it('forwards a parameterized query to the connection pool', async () => {
        const pool = Pool.mock.results[0].value
        pool.query.mockResolvedValueOnce({ rows: [{ value: 1 }] })

        await expect(database.query('SELECT $1 AS value', [1])).resolves.toEqual({
            rows: [{ value: 1 }],
        })
        expect(pool.query).toHaveBeenCalledWith('SELECT $1 AS value', [1])
    })
})
