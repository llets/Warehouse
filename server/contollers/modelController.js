const {Model, Size} = require('../models/models')
const ApiError = require('../error/ApiError')
class ModelController{
    async create(req, res, next){
        try{
            const {sizeId, name, description} = req.body
            const size_record = await Size.findOne({where: {id: sizeId}})
            // if (!size_record || !name){
            //     return next(ApiError.badRequest("Нет имени имя или неправильный sizeId"))
            // }
            const model = await Model.create({
                sizeId: size_record.id,
                name, description
            })
            return res.json(model)
        } catch (e){
            next(ApiError.badRequest(e.message))
        }

    }
    async getAll(req, res){
        const models = await Model.findAll()
        return res.json(models)
    }
    async getOne(req, res){
        const {id} = req.params
        const model = await Model.findOne({ where: {id} })
        return res.json(model)
    }
}

module.exports = new ModelController()