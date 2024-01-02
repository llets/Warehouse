const {Shelf} = require('../models/models')
const { Op } = require("sequelize");
const ApiError = require('../error/ApiError')
class ShelfController{
    async create(req, res, next){
        try{
            const {number, rackId, max_size, occupied_size} = req.body
            const shelf = await Shelf.create({number, rackId, max_size, occupied_size})
            return res.json(shelf)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
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
    async delete_excess(req, res, next){
        const shelves_excess = await Shelf.findAll({
            where: {
                id:{ [Op.gt]: 1024 },
                occupied_size: 0
            }
        })

        try{
            for(let i = 0; i < shelves_excess.length; i++){
                shelves_excess[i].destroy()
            }
        }
        catch(e){
            return next(ApiError.badRequest(e.message))
        }

        const size_shelves_excess = await Shelf.findAll({
            where: {
                occupied_size:{ [Op.gt]: 10 }
            }
        })

        try{
            for(let i = 0; i < size_shelves_excess.length; i++){
                await size_shelves_excess[i].update({
                    occupied_size: 10
                })
            }
        }
        catch(e){
            return next(ApiError.badRequest(e.message))
        }


        //const shelf = await Shelf.findOne({ where: {id} })
        return res.json(`Пустые шкафы с айди > 1024 удалены, шкафы с размером > 10 получили размер 10`)
    }
    // async getAllByRack(req, res){
    //     const {rackId} = req.body
    //     const shelves = await Shelf.findAll({ where: {rackId: rackId} })
    //     return res.json(shelves)
    // }
}

module.exports = new ShelfController()