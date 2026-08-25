const express = require('express')
const { seeAll } = require('../controller/tournamentController')
const router = express.Router()

router.get('/seeAll', seeAll )

module.exports = router