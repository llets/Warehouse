const Router = require('express')
const router = new Router()
const workerController = require('../contollers/workerController')

router.post('/registration', workerController.registration)
router.get('/login', workerController.login)
router.get('/auth', workerController.check)

module.exports = router