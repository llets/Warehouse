const {Size} = require('../models/models')
const ApiError = require('../error/ApiError')
class SizeController{
    async create(req, res, next){
        try{
            const {amount, description} = req.body
            const size = await Size.create({amount, description})
            return res.json(size)
        } catch (e){
            next(ApiError.badRequest(e.message))
        }
    }
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