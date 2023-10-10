const {Category} = require('../models/models')
const ApiError = require('../error/ApiError')
class CategoryController{
    async create(req, res, next){
        try{
            const {name} = req.body
            const category = await Category.create({name})
            return res.json(category)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getAll(req, res){
        const categories = await Category.findAll()
        return res.json(categories)
    }
    async getOne(req, res){
        const {id} = req.params
        const category = await Category.findOne({ where: {id} })
        return res.json(category)
    }
}

module.exports = new CategoryController()