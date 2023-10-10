const {Rack} = require('../models/models')
const ApiError = require('../error/ApiError')
class RackController{
    async create(req, res, next){
        try{
            const {number, shelves_number} = req.body
            const rack = await Rack.create({number, shelves_number})
            return res.json(rack)
        } catch (e){
            next(ApiError.badRequest(e.message))
        }
    }
    async getAll(req, res){
        const racks = await Rack.findAll()
        return res.json(racks)
    }
    async getOne(req, res){
        const {id} = req.params
        const rack = await Rack.findOne({ where: {id} })
        return res.json(rack)
    }
}

module.exports = new RackController()