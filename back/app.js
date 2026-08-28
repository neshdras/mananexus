const express = require('express')
const app = express()
const port = 3000
require('dotenv').config()
app.use(express.json())

const routeTournament = require('./route/tournamentRoute')
const routeAuth = require('./route/authRoute')
app.use('/api/v1/auth', routeAuth)
app.use('/api/v1/tournament', routeTournament)
app.get('/', (req, res)=> {
    res.send('Bienvenue sur mon api')
})

app.listen(port, ()=> {
    console.log(`Serveur démarré sur http://localhost:${port}`)
})