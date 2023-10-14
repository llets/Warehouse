const {Good, Model, Log, Storage} = require('../models/models')
const ApiError = require('../error/ApiError')
class GoodController{
    async create(req, res, next){
        try{
            const {userId, modelsId, date_of_arrival} = req.body
            // проверка на правильность modelId не нужна, тк выбираем из списка

            // получение sizeId по массиву modelsId
            // получение sizes из sizeId
            // отправка в функцию Чулпан

            // проверка, что размер всех товаров < свободное место на складе в функции Чулпан
            // в функции Чулпан: невозможно разместить товары
            // или вывод массива и потом запись в бд

            // создание записи в таблице товаров
            // const good =
            //     await Good.create({
            //         modelId: modelItem.id,
            //         date_of_arrival: date_of_arrival
            //     })
            // создание записи в таблице логов
            // const log =
            //     await Log.create({
            //         userId: user.id,
            //         goodId: good.id,
            //         action: "create"
            //     })
            // создание записи в таблице хранилища
            // const storage =
            //     await Storage.create({
            //         goodId: good.id,
            //         shelfId: shelf.id,
            //         rackId: rack,id
            //     })
            // return res.json(good)
        } catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async getAll(req, res){
        const goods = await Good.findAll()
        return res.json(goods)
    }
    async getOne(req, res){
        const {id} = req.params
        const good = await Good.findOne({ where: {id} })
        return res.json(good)
    }
    async deleteOne(req, res){
        const {id} = req.body
        try{
            await Good.destroy({
                where: {
                    id: id
                }
            });
            return res.json({message: "OK"})
        } catch(e){
            next(ApiError.badRequest((e.message)))
        }
    }
    async deleteByModelId(req, res){
        // to delete number of goods of the model, we pass this func in a loop
        const {modelId} = req.body
        try{
            await Good.destroy({
                where: {
                    modelId: modelId
                }
            });
            return res.json({message: "OK"})
        } catch(e){
            next(ApiError.badRequest((e.message)))
        }
    }
}

module.exports = new GoodController()