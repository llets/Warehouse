const Router = require('express')
const router = new Router()
const shelfController = require('../contollers/shelfController')

router.get('/', shelfController.get)
router.get('/:id', shelfController.getOne)

module.exports = router