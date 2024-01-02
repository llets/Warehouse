const Router = require('express')
const router = new Router()
const rackController = require('../contollers/rackController')
const checkRole = require('../middleWare/checkRoleMiddleware')

router.post('/',  checkRole('ADMIN'), rackController.create)
router.get('/', rackController.getAll)
router.get('/:id', rackController.getOne)

module.exports = router