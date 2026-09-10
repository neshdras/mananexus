const express = require('express')
const { seeAll, createTournament, updateTournament, addPlayer, delPlayer, seePlayer } = require('../controller/tournamentController')
const { authMiddleware } = require('../middleware/authMiddleware')
const router = express.Router()

router.get('/seeAll', authMiddleware, seeAll )
router.post('/create',authMiddleware, createTournament)
router.patch('/update/:id', authMiddleware, updateTournament)
router.post('/join/:id', authMiddleware, addPlayer)
router.delete('/unjoin/:id', authMiddleware, delPlayer)
router.get('/:id/players', authMiddleware, seePlayer)
module.exports = router