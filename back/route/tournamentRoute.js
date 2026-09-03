const express = require('express')
const { seeAll, createTournament } = require('../controller/tournamentController')
const router = express.Router()

router.get('/seeAll', seeAll )
router.post('/create', createTournament)
module.exports = router