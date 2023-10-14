const {Model, Size} = require('../models/models')
const ApiError = require('../error/ApiError')
class ModelController{
    async create(req, res, next){
        try{
            // descrip can be null
            // sizeId cannot
            const {sizeId, name, description} = req.body
            if (!sizeId || !name){
                return next(ApiError.badRequest("Нет названия модели или sizeId"))
            }
            const size_record = await Size.findOne({where: {id: sizeId}})
            if (size_record === null) {
                return next(ApiError.badRequest("Неправильное значение sizeId"))
            }
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