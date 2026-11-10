const gameRoute = require('./gameRoute')
const deckRoute = require('./deckRoute')
const userRoute = require('./userRoute')
const tournamentRoute = require('./tournamentRoute')

const listRoutes = (router) => router.stack
    .filter((layer) => layer.route)
    .map(({ route }) => `${Object.keys(route.methods).join(',').toUpperCase()} ${route.path}`)

describe('API route registration', () => {
    it('registers the game catalog endpoint', () => {
        expect(listRoutes(gameRoute)).toEqual(['GET /seeAll'])
    })

    it('registers deck creation, listing, and deletion endpoints', () => {
        expect(listRoutes(deckRoute)).toEqual([
            'POST /adddeck/:gameId',
            'GET /game/:gameId',
            'GET /profile/:userId',
            'DELETE /delete/:id',
        ])
    })

    it('registers user profile, update, and ranking endpoints', () => {
        expect(listRoutes(userRoute)).toEqual([
            'GET /profile/:id',
            'PATCH /update',
            'GET /ranking',
        ])
    })

    it('registers tournament creation with its separate game-aware payload route', () => {
        expect(listRoutes(tournamentRoute)).toEqual([
            'GET /seeAll',
            'POST /create',
            'PATCH /update/:id',
            'POST /join/:id',
            'DELETE /unjoin/:id',
            'GET /:id/players',
        ])
    })
})
