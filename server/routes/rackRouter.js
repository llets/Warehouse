const Router = require('express')
const router = new Router()
const rackController = require('../contollers/rackController')

router.get('/', rackController.get)
router.get('/:id', rackController.getOne)

module.exports = router