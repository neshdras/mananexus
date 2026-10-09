const express = require('express')
const { updateUser, seeRanking, getProfile } = require('../controller/userController')
const {authMiddleware} = require('../middleware/authMiddleware')
const validate = require('../middleware/validateMiddleware')
const { updateSchema } = require('../schemas/userSchema')
const router = express.Router()

router.get('/profile/:id', authMiddleware, getProfile)
router.patch('/update', authMiddleware, validate(updateSchema), updateUser)
router.get('/ranking', authMiddleware, seeRanking )
module.exports = router