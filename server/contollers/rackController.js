const {Rack, Shelf} = require('../models/models')
const ApiError = require('../error/ApiError')
class RackController{
    async create(req, res, next){
    
        const {number, shelves_number, amount} = req.body
        let rack
        if (!amount){
            try{
                rack = await Rack.create({number, shelves_number})
            }
            catch(e){
                return next(ApiError.badRequest("Создание стеллажа: " + e.message))
            }
            try{
                for (let i = 0; i < shelves_number; i++){
                        await Shelf.create({
                            number: i + 1,
                            max_size: 600,
                            occupied_size: 0,
                            rackId: rack.id
                        })
                }
            }
            catch(e){
                return next(ApiError.badRequest("Создание полок для одного стеллажа: " + e.message))
            }
        return res.json(rack)
        }
        

        for (let i = 0; i < amount; i++){
            try{
                rack = await Rack.create({number: (parseInt(number) + i).toString(), shelves_number})
            }
            catch(e){
                return next(ApiError.badRequest("Создание стеллажа: " + e.message))
            }
            for (let j = 0; j < shelves_number; j++){
                try{
                    await Shelf.create({
                        number: j + 1,
                        max_size: 600,
                        occupied_size: 0,
                        rackId: rack.id
                    })
                }
                catch(e){
                  return next(ApiError.badRequest("Создание полок в нескольких стеллажах: " + e.message))
                }
                console.log("amogus")
            }
        }
        return res.json(`${amount} стеллаж(-ей) с ${shelves_number} полками добавлено`)
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