const express = require('express')
const { loginUser, register } = require('../controllers/userController')

const router = express.Router()

//Define the routes

//Login route
router.post('/login', loginUser)

//Register route
router.post('/register', register)

module.exports = router