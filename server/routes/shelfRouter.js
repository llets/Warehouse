const Router = require('express')
const router = new Router()
const shelfController = require('../contollers/shelfController')
const checkRole = require("../middleWare/CheckRoleMiddleware");

router.post('/', checkRole('ADMIN'),shelfController.create)
router.get('/', shelfController.getAll)
router.get('/:id', shelfController.getOne)
router.delete('/', shelfController.delete_excess)

module.exports = router