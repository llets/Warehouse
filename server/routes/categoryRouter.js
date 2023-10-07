const Router = require('express')
const router = new Router()
const categoryController = require('../contollers/categoryController')

router.post('/', categoryController.create)
router.get('/', categoryController.get)
router.get('/:id', categoryController.getOne)

module.exports = router