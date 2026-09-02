const express = require('express')
const { updateUser } = require('../controller/userController')
const router = express.Router()

router.patch('/update/:id', updateUser)

module.exports = router