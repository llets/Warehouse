const Router = require('express')
const router = new Router()
const sizeController = require('../contollers/sizeController')

router.post('/', sizeController.create)
router.get('/', sizeController.getAll)
router.get('/:id', sizeController.getOne)

module.exports = router