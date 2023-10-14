const {Storage} = require('../models/models')
const ApiError = require('../error/ApiError')
class StorageController{
    async create(req, res, next){
        try{
            const {goodId, shelfId} = req.body
            const storage = await Storage.create({goodId, shelfId})
            return res.json(storage)
        } catch (e){
            next(ApiError.badRequest(e.message))
        }
    }
    async getAll(req, res){
        const storages = await Storage.findAll()
        return res.json(storages)
    }
    async getOne(req, res){
        const {id} = req.params
        const storage = await Storage.findOne({ where: {id} })
        return res.json(storage)
    }

    async deleteOne(req, res){
        const {id} = req.body
        try{
            await Storage.destroy({
                where: {
                    id: id
                }
            });
            return res.json({message: "OK"})
        } catch(e){
            next(ApiError.badRequest((e.message)))
        }
    }
}

module.exports = new StorageController()