const express = require('express')
const { seeAll, createTournament, updateTournament } = require('../controller/tournamentController')
const router = express.Router()

router.get('/seeAll', seeAll )
router.post('/create', createTournament)
router.patch('/update/:id', updateTournament)
module.exports = router