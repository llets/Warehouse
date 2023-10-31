const {Rack} = require('../models/models')
const ApiError = require('../error/ApiError')
class RackController{
    async create(req, res, next){
        try{
            const {number, shelves_number, amount} = req.body
            if (!amount){
                const rack = await Rack.create({number, shelves_number})
                for (let i = 0; i < shelves_number; i++){
                        await Shelf.create({
                            number: i + 1,
                            max_size: 600,
                            occupied_size: 0,
                            rackId: rack.id
                        })
                }
                return res.json(rack)
            }

            for (let i = 0; i < amount; i++){
                const rack = await Rack.create({number, shelves_number})
                for (let j = 0; j < shelves_number; j++){
                        await Shelf.create({
                            number: j + 1,
                            max_size: 600,
                            occupied_size: 0,
                            rackId: rack.id
                        })
                }
            }
            return res.json(`${amount} стеллаж(-ей) с ${shelves_number} полками добавлено`)
        
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