const Router = require('express')
const router = new Router()
const modelController = require('../contollers/modelController')
const checkRole = require('../middleWare/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), modelController.create)
router.get('/', modelController.getAll)
router.get('/:id', modelController.getOne)

module.exports = router