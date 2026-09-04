const express = require('express')
const { seeAll, createTournament, updateTournament, addPlayer, delPlayer } = require('../controller/tournamentController')
const router = express.Router()

router.get('/seeAll', seeAll )
router.post('/create', createTournament)
router.patch('/update/:id', updateTournament)
router.post('/join/:id', addPlayer)
router.delete('/unjoin/:id', delPlayer)
module.exports = router