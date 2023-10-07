const Router = require('express')
const router = new Router()
const modelController = require('../contollers/modelController')

router.post('/', modelController.create)
router.get('/', modelController.get)
router.get('/:id', modelController.getOne)

module.exports = router