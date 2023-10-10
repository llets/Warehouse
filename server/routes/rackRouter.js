const Router = require('express')
const router = new Router()
const rackController = require('../contollers/rackController')

router.post('/', rackController.create)
router.get('/', rackController.getAll)
router.get('/:id', rackController.getOne)

module.exports = router