const Router = require('express')
const router = new Router()
const userController = require('../contollers/userController')
const authMiddleware = require('../middleWare/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)

module.exports = router