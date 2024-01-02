const ApiError = require('../error/ApiError')
const {Storage, Good, Model} = require('../models/models')

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
    async getAll(req, res, next){
        const storages = await Storage.findAll({raw: true})
        if (storages == null){
            return res.json("Ячейки пусты")
        }

        let storages_more_info = new Array()
        try{
            for (let i = 0; i < storages.length; i++){
                let model_Id
                try{
                    model_Id = await Good.findOne({
                        attributes: ['modelId'],
                        where:{
                            id: storages[i].goodId
                        }
                    })
                }
                catch(e){
                    continue
                }
                if (model_Id == null) {continue}
                let good_model_info
                try{
                    good_model_info = await Model.findOne({
                        attributes: ['name','sizeId'],
                        where: {
                            id: model_Id.modelId
                        }
                    })
                }catch(e){
                    continue
                }
                if (good_model_info == null) {continue}
                storages_more_info.push({
                    "id": storages[i].id,
                    "shelf_id": storages[i].shelfId,
                    "good_id": storages[i].goodId,
                    "model_name": good_model_info.name,
                    "size": good_model_info.sizeId
                })
            }
        }
        catch(e){
            return next(ApiError.badRequest("Поиск информации о моделях товара: " + e.message))
        }

        return res.json(storages_more_info)
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