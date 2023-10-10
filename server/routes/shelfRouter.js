const Router = require('express')
const router = new Router()
const shelfController = require('../contollers/shelfController')

router.post('/', shelfController.create)
router.get('/', shelfController.getAll)
router.get('/:id', shelfController.getOne)

module.exports = router