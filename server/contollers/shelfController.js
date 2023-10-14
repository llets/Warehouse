const {Shelf} = require('../models/models')
const ApiError = require('../error/ApiError')
class ShelfController{
    async create(req, res, next){
        try{
            const {number, rackId, max_size, occupied_size} = req.body
            const shelf = await Shelf.create({number, rackId, max_size, occupied_size})
            return res.json(shelf)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getAll(req, res){
        const shelves = await Shelf.findAll()
        return res.json(shelves)
    }
    async getOne(req, res){
        const {id} = req.params
        const shelf = await Shelf.findOne({ where: {id} })
        return res.json(shelf)
    }
    // async getAllByRack(req, res){
    //     const {rackId} = req.body
    //     const shelves = await Shelf.findAll({ where: {rackId: rackId} })
    //     return res.json(shelves)
    // }
}

module.exports = new ShelfController()