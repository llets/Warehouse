const {Log} = require('../models/models')
const ApiError = require('../error/ApiError')
class LogController{
    async create(req, res, next){
        try{
            const {goodId, userId, action} = req.body
            const log = await Storage.create({goodId,  userId, action})
            return res.json(log)
        } catch (e){
            next(ApiError.badRequest(e.message))
        }
    }
    async getAll(req, res){
        const logs = await Log.findAll()
        return res.json(logs)
    }
    async getOne(req, res){
        const {id} = req.params
        const log = await Log.findOne({ where: {id} })
        return res.json(log)
    }
}

module.exports = new LogController()