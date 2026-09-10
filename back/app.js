const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
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
    origin: 'http://localhost:3000'
}
app.use(cors(corsOption))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const routeTournament = require('./route/tournamentRoute')
const routeAuth = require('./route/authRoute')
const routeUser = require('./route/userRoute')

app.use('/api/v1/auth', routeAuth)
app.use('/api/v1/user', routeUser)
app.use('/api/v1/tournament', routeTournament)
app.get('/', (req, res)=> {
    res.send('Bienvenue sur mon api')
})

app.listen(port, ()=> {
    console.log(`Serveur démarré sur http://localhost:${port}`)
})