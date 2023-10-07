const Router = require('express')
const router = new Router()
const storageController = require('../contollers/storageController')

router.post('/', storageController.create)
router.get('/', storageController.get)
router.get('/:id', storageController.getOne)
router.delete('/:id', storageController.deleteOne)

module.exports = router