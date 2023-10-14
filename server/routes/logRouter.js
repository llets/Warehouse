const Router = require('express')
const router = new Router()
const logController = require('../contollers/logController')

router.post('/', logController.create)
router.get('/', logController.getAll)
router.get('/:id', logController.getOne)

module.exports = router