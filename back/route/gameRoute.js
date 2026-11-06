const express = require('express')
const { seeAll } = require('../controller/gameController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/seeAll', authMiddleware, seeAll)

module.exports = router
