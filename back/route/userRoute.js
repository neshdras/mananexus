const express = require('express')
const { updateUser, seeRanking } = require('../controller/userController')
const router = express.Router()

router.patch('/update/:id', updateUser)
router.get('/ranking', seeRanking )
module.exports = router