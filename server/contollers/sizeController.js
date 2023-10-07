const {Size} = require('../models/models')
const ApiError = require('../error/ApiError')
class SizeController{
    async getAll(req, res){
        const sizes = await Size.findAll()
        return res.json(sizes)
    }
    async getOne(req, res){
        const {id} = req.params
        const size = await Size.findOne({ where: {id} })
        return res.json(size)
    }
}

module.exports = new SizeController()