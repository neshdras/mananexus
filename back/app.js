const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

const routeTournament = require('./route/tournamentRoute')
app.use('/api/v1/tournament', routeTournament)
app.get('/', (req, res)=> {
    res.send('Bienvenue sur mon api')
})

app.listen(port, ()=> {
    console.log(`Serveur démarré sur http://localhost:${port}`)
})