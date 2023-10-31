const {Good, Model, Log, Storage, User, Shelf} = require('../models/models')
const { Op } = require("sequelize");
const rask = require('../raskroi')
const ApiError = require('../error/ApiError')
class GoodController{
    async create(req, res, next){
        try{
            const {userId, date_of_arrival, arr_models_id, arr_goods_amount } = req.body
            //userId - айди пользователя
            //date_of_arrival - дата прибытия
            //arr_models_id - массив идентификаторов моделей товаров, которые прибыли на склад. Размер n
            //arr_goods_amount - массив количеста товаров для каждой модели соответственно.     Размер n
            // проверка на правильность modelId не нужна, тк выбираем из списка
            if (!userId){
                return next(ApiError.badRequest("Отсутствует идентификатор пользователя"))
            }
            if (!await User.findOne({ where: { id: userId } })){
                return next(ApiError.badRequest("Пользователя с заданным идентификатором не существует"))
            }
            if (!date_of_arrival){
                return next(ApiError.badRequest("Не указана дата прибытия товаров"))
            }
            if (arr_models_id.length != arr_goods_amount.length){
                return next(ApiError.badRequest("Число моделей и количество размеров не совпадает "))
            }
            if (!arr_models_id){
                return next(ApiError.badRequest("Не указана(-ы) модель(-и) товаров"))
            }
            for (let i = 0; i < arr_models_id.length; i++){
                try {
                    if (!await Model.findOne({where: {id: arr_models_id[i]}})){
                        return next(ApiError.badRequest(`Модели с идентификатором ${arr_models_id[i]} не существует`))
                    }
                }
                catch(e){
                    next(ApiError.badRequest("Проверка соответствия идентификаторов пришедших моделей: " + e.message))
                }
            }
            if (!date_of_arrival){
                return next(ApiError.badRequest("Не указано количество товаров соответствующей(-их) модели(-ей)"))
            }
            // if (!await Model.findOne({ where: { id: modelId } })){
            //     return next(ApiError.badRequest("Модели с заданным идентификатором не существует"))
            // }

            //Получение данных для упаковки
            //1. Вытаскиваем из бд размеры, которые поступили на склад
            let arr_models_sizes = new Array()
            for (let i = 0; i < arr_models_id.length; i++){
                try{
                    arr_models_sizes.push(await Model.findOne({
                        attributes: ['sizeId'],
                        where: {
                            id: arr_models_id[i]
                        },
                        raw: true   //raw:true нужен для извлечения данных из БД без дополнительных метаданных
                    }))
                }
                catch(e){
                    next(ApiError.badRequest("Получение размеров пришедших моделей: " + e.message))
                }
            }
            
            //2. Вытаскиваем из бд все пустые полки (в порядке возрастания айди) и их количество
            let empty_shelves_count = -1
            let arr_empty_shelves = new Array()
            try{
                arr_empty_shelves = await Shelf.findAll({
                    attributes: ['id'],
                    where:{
                        occupied_size: 0
                    },
                    raw: true,
                    order: [['id', 'ASC']]
                })
                empty_shelves_count = arr_empty_shelves.length 
            }
            catch(e){
                next(ApiError.badRequest("Получение пустых полок: " + e.message))
            }
            let arr_empty_shelves_id = new Array()
            for (let i = 0; i < arr_empty_shelves.length; i++){
                arr_empty_shelves_id.push(arr_empty_shelves[i].id)
            }

            // Нужно найти первую полку из зоны, где ещё нет товаров (самая дальняя пустая полка, при этом полка перед ней не пустая)
            // Если такой нет, то берётся самая последняя полка, которая никогда не должна быть занята.
            let last_empty_shelf_id = '1' 

            //Чтобы найти такую полку мы должны найти последнюю непустую полку.
            //Сначала найдём все полки:

            let arr_notempty_shelves = new Array()
            try{
                arr_notempty_shelves = await Shelf.findAll({
                    attributes: ['id'],
                    where:{
                        occupied_size:{ [Op.not]: 0 }
                    },
                    raw: true
                })
            }
            catch(e){
                next(ApiError.badRequest("Получение непустых полок: " + e.message))
            }
            let arr_notempty_shelves_id = new Array()
            for (let i = 0; i < arr_notempty_shelves.length; i++){
                arr_notempty_shelves_id.push(arr_notempty_shelves[i].id)
            }
            
            console.log(`arr_empty_shelves_id: ${arr_empty_shelves_id}`)
            //Далее будем с конца проверять, идёт ли после этой непустой полки пустая
            if (arr_notempty_shelves.length == 0)
                last_empty_shelf_id = '1'
            else{
                try{    
                    for(let i = arr_notempty_shelves_id.length - 1; i >= 0; i--){
                        if (arr_empty_shelves_id.includes((parseInt(arr_notempty_shelves_id[i]) + 1).toString())){
                            last_empty_shelf_id = (parseInt(arr_notempty_shelves_id[i]) + 1).toString()
                            break
                        }
                    }
                    // if (last_empty_shelf_id == -1){
                    //     last_empty_shelf_id = 1025
                    // }
                }
                catch(e){
                    next(ApiError.badRequest("Проверка, идёт ли после непустой полки пустая: " + e.message))
                }
            }
            console.log(`last empty shelf id: ${last_empty_shelf_id}`)

            //3. Вытаскиваем из бд все непустые и не заполненные полки (в порядке возрастания АЙДИ).
            // Это двумерный массив 
            let arr_occupied_shelves = new Array()
            let arr_occupied_shelves_id = new Array()
            let arr_occupied_shelves_sizes = new Array()
            try{
                arr_occupied_shelves = await Shelf.findAll({
                    attributes: ['id', 'occupied_size'],
                    where:{
                        occupied_size:{ [Op.between]: [1, 599] }
                    },
                    order:[['id', 'ASC']],
                    raw: true
                })
                console.log(`Колисчество arr_occupied_shelves: ${arr_occupied_shelves.length}`)
                for(let i = 0; i < arr_occupied_shelves.length; i++){
                    arr_occupied_shelves_id.push(arr_occupied_shelves[i].id)
                    arr_occupied_shelves_sizes.push(arr_occupied_shelves[i].occupied_size)
                }
            }

            catch(e){
                next(ApiError.badRequest("Поиск непустых и не заполненных полок: " + e.message))
            }

            //4. Вытаскиваем из бд айди последнего товара
            let last_good_id = -1
            try{
                last_good_id = await Good.max('id')
            }
            catch(e){
                next(ApiError.badRequest(e.message))
            }

            //перевод полученных из бд данных в нормальные массивы, с которыми сможет работать функция Чулпан
            let arr_models_sizes_id = new Array()
            for(let i = 0; i < arr_models_sizes.length; i++){
                arr_models_sizes_id.push(arr_models_sizes[i].sizeId)
            }
            // let arr_occupied_shelves_id_forfunction = new Array()
            // for(let i = 0; i < arr_occupied_shelves_id.length; i++){
            //     arr_occupied_shelves_id_forfunction.push(arr_occupied_shelves_id[i])
            // }
            // let arr_occupied_shelves_sizes_forfunction = new Array()
            // for(let i = 0; i < arr_occupied_shelves_sizes.length; i++){
            //     arr_occupied_shelves_sizes_forfunction.push(arr_occupied_shelves_sizes[i])
            // }
            // let arr_empty_shelves_id_forfunction = new Array()
            // for(let i = 0; i < arr_empty_shelves_id.length; i++){
            //     arr_empty_shelves_id_forfunction.push(arr_empty_shelves_id[i].id)
            // }
            console.log(`sizes: ${(arr_models_sizes_id)}`)
            // console.log(`arr_occupied_shelves_id: ${(JSON.stringify(arr_occupied_shelves_id_forfunction))}`)
            // console.log(`arr_occupied_shelves_sizes: ${(JSON.stringify(arr_occupied_shelves_sizes_forfunction))}`)
            // console.log(`arr_empty_shelves_id: ${(JSON.stringify(arr_empty_shelves_id_forfunction))}`)
            console.log(`arr_occupied_shelves_id: ${(JSON.stringify(arr_occupied_shelves_id))}`)
            console.log(`arr_occupied_shelves_sizes: ${(JSON.stringify(arr_occupied_shelves_sizes))}`)
            console.log(`arr_empty_shelves_id: ${(JSON.stringify(arr_empty_shelves_id))}`)

            //получаем айди полок для новых товаров и айди новых товаров из функции Чулпан:
            let add_msg = ""
            let arr_shelves_of_new_goods = new Array()
            let arr_id_of_new_goods_of_n_models = new Array()
            const result = rask.add(
                arr_models_id, arr_models_sizes_id, arr_goods_amount, userId,
                //empty_shelves_count, arr_occupied_shelves_id_forfunction, arr_occupied_shelves_sizes_forfunction,
                empty_shelves_count, arr_occupied_shelves_id, arr_occupied_shelves_sizes,
                arr_empty_shelves_id, last_empty_shelf_id, last_good_id
            )
            add_msg = result[0]
            arr_shelves_of_new_goods = result[1]
            arr_id_of_new_goods_of_n_models = result[2]

            console.log(`Сообщение: ${(add_msg)}`)
            console.log(`Полки: ${(JSON.stringify(arr_shelves_of_new_goods))}`)
            console.log(`Айди товаров: ${(JSON.stringify(arr_id_of_new_goods_of_n_models))}`)



            //5. Добавляем товары
            let arr_id_new_storages = new Array()
            let arr_id_new_goods = new Array()
            let good_new_id = last_good_id + 1
            try{
                for(let i = 0; i < arr_models_id.length; i++){
                    for (let j = 0; j < arr_goods_amount[i]; j++){
                        
                        //создаём товар
                        
                        try{
                            await Good.create({
                                    date_of_arrival: date_of_arrival,
                                    modelId: arr_models_id[i]
                                })
                        }
                        catch(e){
                            next(ApiError.badRequest("Создание товара в бд: " + e.message))
                        }

                        //изменяем размер в соответствующей полке

                        let shelf = new Array()
                        try{
                            shelf.push(await Shelf.findOne({
                                where: {id: arr_shelves_of_new_goods[i][j]
                                },
                                attributes: ['occupied_size']
                            }))
                            console.log(shelf[0].occupied_size)
                        }
                        catch(e){
                            next(ApiError.badRequest("Поиск полки в бд: " + e.message))
                        }
                            let size = parseInt(shelf[0].occupied_size) + parseInt(arr_models_sizes_id[i])
                            console.log(`Размер: ${size}`)
                        try{
                            await Shelf.update({
                                occupied_size: size
                            },
                            {
                                where: {
                                    id: arr_shelves_of_new_goods[i][j]
                                },
                            })
                        }
                        catch(e){
                            next(ApiError.badRequest("Сохранение размера полки в бд: " + e.message))
                        }

                        //создаём ячейку хранилища
                        
                        try{
                            const storage = await Storage.create({
                                    goodId: good_new_id,
                                    shelfId: arr_shelves_of_new_goods[i][j]
                                })
                                arr_id_new_storages.push(storage.id)
                        }
                        catch(e){
                            next(ApiError.badRequest("Создание ячейки хранилища в бд: " + e.message))
                        }
                        
                        arr_id_new_goods.push(good_new_id)
                        good_new_id += 1
                    }
                }
            }
            catch(e){
                next(ApiError.badRequest("Процесс добавления товаров в бд: " + e.message))
            }


            return res.json(`${add_msg} Товары моделей ${arr_models_id} добавлены. Айди новых товаров: ${arr_id_new_goods}. Полки для новых товаров: ${arr_shelves_of_new_goods}. Ячейки для новых товаров: ${arr_id_new_storages}.`)
            /*
            //если количество создаваемых товаров не указано
            if (!number){
                const good = await Good.create({modelId: modelId, date_of_arrival: date_of_arrival})

                const model = await Model.findOne({where: {id: modelId}})
                const max_size = 600 - model.size
                const shelf = await Shelf.findOne({where:  { occupied_size: {[Op.lt]: max_size}}})
                if (!shelf_id && !good_id){
                    const storage = await Storage.create({
                        shelfId: shelf.id,
                        goodId: good.id
                    })
                    await Shelf.update({occupied_size: shelf.occupied_size + model.size}, {where: {id: shelf.id}})
                }
                return res.json(modelsId, date_of_arrival, storage.id, shelf.id)
            }
            //если количество указано
            for (let i = 0; i < number; i++) {
                const good = await Good.create({modelId, date_of_arrival})

                const model = await Model.findOne({where: {id: modelId}})
                const max_size = 600// - model.size

                const shelf = await Shelf.findOne({
                    where: { 
                    occupied_size: {
                        [Op.lt]: max_size,
                    }}})
                if (shelf.id && good.id){
                    const storage = await Storage.create({
                        shelfId: shelf.id,
                        goodId: good.id
                    })
                    await Shelf.update({occupied_size: shelf.occupied_size + model.size}, {where: {id: shelf.id}})
                }
            }
            return res.json(`${number} товар(-ов) модели ${modelId} добавлено ${date_of_arrival}`)
            */

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
        }
        catch(e){
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