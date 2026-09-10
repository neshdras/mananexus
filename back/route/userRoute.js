const express = require('express')
const { updateUser, seeRanking, getProfile } = require('../controller/userController')
const {authMiddleware} = require('../middleware/authMiddleware')
const router = express.Router()

router.get('/profile', authMiddleware, getProfile)
router.patch('/update', authMiddleware, updateUser)
router.get('/ranking', authMiddleware, seeRanking )
module.exports = router