const Router = require('express')
const router = new Router()
const goodController = require('../contollers/goodController')

router.post('/', goodController.create)
router.get('/', goodController.getAll)
router.get('/:id', goodController.getOne)
router.delete('/:id', goodController.deleteOne)
router.delete('/by_model/:modelId', goodController.deleteByModelId)

module.exports = router