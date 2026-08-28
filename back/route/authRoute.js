const express = require('express')  
const { register, login, sendToken, forgetPass } = require('../controller/authController')
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/send', sendToken)
router.post('/reset/:token', forgetPass)
module.exports = router