const Router = require('express')
const router = new Router()
const sizeController = require('../contollers/sizeController')
const checkRole = require("../middleWare/CheckRoleMiddleware");


router.post('/', checkRole('ADMIN'), sizeController.create)
router.get('/', sizeController.getAll)
router.get('/:id', sizeController.getOne)

module.exports = router