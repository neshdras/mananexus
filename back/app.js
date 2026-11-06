const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
require('dotenv').config()


const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json')
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy : { policy: "cross-origin"}
    })
)

const limiter = rateLimit({
    windowMs: 15*60*1000,
    limit: 100,
    message: { status: 429, error: "Too many query, try later"}
})
app.use(limiter)
app.use(express.json())

const corsOption = {
    origin: 'https://shufflenexus.vercel.app',
    credentials: true 
}
app.use(cors(corsOption))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(cookieParser())
const routeTournament = require('./route/tournamentRoute')
const routeAuth = require('./route/authRoute')
const routeUser = require('./route/userRoute')
const routeDeck = require('./route/deckRoute')
const routeGame = require('./route/gameRoute')

app.use('/api/v1/auth', routeAuth)
app.use('/api/v1/user', routeUser)
app.use('/api/v1/tournament', routeTournament)
app.use('/api/v1/deck', routeDeck)
app.use('/api/v1/game', routeGame)
/**
 * @swagger
 * /:
 *   get:
 *     summary: Afficher le message d’accueil de l’API
 *     tags:
 *       - Accueil
 *     responses:
 *       '200':
 *         description: Message d’accueil.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Bienvenue sur mon api
 *       '429':
 *         description: Trop de requêtes (limite globale de 100 requêtes par 15 minutes).
 *       '500':
 *         description: Erreur serveur.
 */
app.get('/', (req, res)=> {
    res.send('Bienvenue sur mon api')
})

app.listen(port, ()=> {
    console.log(`Serveur démarré sur http://localhost:${port}`)
})
