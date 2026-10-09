const express = require('express')
const { seeAll, createTournament, updateTournament, addPlayer, delPlayer, seePlayer } = require('../controller/tournamentController')
const { authMiddleware } = require('../middleware/authMiddleware')
const validate = require('../middleware/validateMiddleware')
const { updateTournamentSchema, createTournamentSchema } = require('../schemas/tournamentSchema')
const router = express.Router()

router.get('/seeAll', authMiddleware, seeAll )
router.post('/create',authMiddleware, validate(createTournamentSchema), createTournament)
router.patch('/update/:id', authMiddleware, validate(updateTournamentSchema), updateTournament)
router.post('/join/:id', authMiddleware, addPlayer)
router.delete('/unjoin/:id', authMiddleware, delPlayer)
router.get('/:id/players', authMiddleware, seePlayer)
module.exports = router