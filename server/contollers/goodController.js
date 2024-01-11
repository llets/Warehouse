const {Good, Model, Storage, User, Shelf, Size} = require('../models/models')
const { Op } = require("sequelize");
const rask = require('../raskroi')
const ApiError = require('../error/ApiError');
class GoodController{
    async create(req, res, next){
        try{
            const {userId, string_date_of_arrival, string_models_id, string_goods_amount } = req.body
            let arr_models_id = JSON.parse(string_models_id)
            let arr_goods_amount = JSON.parse(string_goods_amount)

            arr_goods_amount = arr_goods_amount.map((item) => Number(item))
            arr_models_id = arr_models_id.map((item) => Number(item))

            // 31-01-2024-23-59
            // 31st of Jan, 2024
            // 23:59
            // or 11:59pm
            let parts = string_date_of_arrival.split('-')

            // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
            // January - 0, February - 1, etc.
            // creating date: year, month, day, hours, minutes
            let date_of_arrival = new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4]);

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
            if (arr_models_id.length !== arr_goods_amount.length){
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
                    return next(ApiError.badRequest("Проверка соответствия идентификаторов пришедших моделей: " + e.message))
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
            let arr_models_attr_sizeId = new Array()
            for (let i = 0; i < arr_models_id.length; i++){
                try{
                    arr_models_attr_sizeId.push(await Model.findOne({
                        attributes: ['sizeId'],
                        where: {
                            id: arr_models_id[i]
                        },
                        raw: true   //raw:true нужен для извлечения данных из БД без дополнительных метаданных
                    }))
                }
                catch(e){
                    return next(ApiError.badRequest("Получение размеров пришедших моделей: " + e.message))
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
                return next(ApiError.badRequest("Получение пустых полок: " + e.message))
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
                return next(ApiError.badRequest("Получение непустых полок: " + e.message))
            }
            let arr_notempty_shelves_id = new Array()
            for (let i = 0; i < arr_notempty_shelves.length; i++){
                arr_notempty_shelves_id.push(arr_notempty_shelves[i].id)
            }
            
            //console.log(`arr_empty_shelves_id: ${arr_empty_shelves_id}`)
            //Далее будем с конца проверять, идёт ли после этой непустой полки пустая
            if (arr_empty_shelves.length == 0)
                last_empty_shelf_id = '1025'
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
                    return next(ApiError.badRequest("Проверка, идёт ли после непустой полки пустая: " + e.message))
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
                        occupied_size:{ [Op.between]: [1, 9] }
                    },
                    order:[['id', 'ASC']],
                    raw: true
                })
                //console.log(`Колисчество arr_occupied_shelves: ${arr_occupied_shelves.length}`)
                for(let i = 0; i < arr_occupied_shelves.length; i++){
                    arr_occupied_shelves_id.push(arr_occupied_shelves[i].id)
                    console.log(10 - arr_occupied_shelves[i].occupied_size)
                    arr_occupied_shelves_sizes.push(10 - arr_occupied_shelves[i].occupied_size)
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
                return next(ApiError.badRequest(e.message))
            }

            // //перевод полученных из бд данных в нормальные массивы, с которыми сможет работать функция Чулпан
            // let normal_arr_models_attr_sizeId = new Array()
            // for(let i = 0; i < arr_models_attr_sizeId.length; i++){
            //     normal_arr_models_attr_sizeId.push(arr_models_attr_sizeId[i].sizeId)
            // }

            let arr_models_sizes = new Array()
            for(let i = 0; i < arr_models_attr_sizeId.length; i++){
                const size_attr_amount = await Size.findOne({
                    ttributes: ['amount'],
                    where:{
                        id: arr_models_attr_sizeId[i].sizeId
                    },
                    raw: true
                })
                console.log(`size_attr_amount: ${size_attr_amount.amount}`)
                arr_models_sizes.push(size_attr_amount.amount)
            }

            //console.log(`sizes: ${(normal_arr_models_attr_sizeId)}`)
            //console.log(`arr_occupied_shelves_id: ${(JSON.stringify(arr_occupied_shelves_id))}`)
            //console.log(`arr_occupied_shelves_sizes: ${(JSON.stringify(arr_occupied_shelves_sizes))}`)
            //console.log(`arr_empty_shelves_id: ${(JSON.stringify(arr_empty_shelves_id))}`)

            console.log(`arr_models_sizes: ${arr_models_sizes}`)

            //получаем айди полок для новых товаров и айди новых товаров из функции Чулпан:
            let add_msg = ""
            let arr_shelves_of_new_goods = new Array()
            let arr_id_of_new_goods_of_n_models = new Array()
            const result = rask.add(
                arr_models_id, arr_models_sizes, arr_goods_amount, userId,
                empty_shelves_count, arr_occupied_shelves_id, arr_occupied_shelves_sizes,
                arr_empty_shelves_id, last_empty_shelf_id, last_good_id
            )
            console.log(result[0],result[1],result[2])

            if (result[1] == null || result[2] == null){
                return next(ApiError.badRequest("Функция раскроя: " + result[0]))
            }
            else if (result[1].length == 0 || result[2].length == 0){
                return next(ApiError.badRequest("Функция раскроя: " + result[0]))
            }
            add_msg = result[0]
            arr_shelves_of_new_goods = result[1]
            console.log(`arr_shelves_of_new_goods: ${arr_shelves_of_new_goods}`)
            arr_id_of_new_goods_of_n_models = result[2]

            //console.log(`Сообщение: ${(add_msg)}`)
            //console.log(`Полки: ${(JSON.stringify(arr_shelves_of_new_goods))}`)
            //console.log(`Айди товаров: ${(JSON.stringify(arr_id_of_new_goods_of_n_models))}`)

            //5. Добавляем товары
            let arr_id_new_storages = new Array()
            let arr_id_new_goods = new Array()
            let good_new_id = last_good_id + 1
            try{
                for(let i = 0; i < arr_models_id.length; i++){
                    for (let j = 0; j < arr_goods_amount[i]; j++){
                        
                        //создаём товар
                        
                        try{
                            good_new_id = (await Good.create({
                                    date_of_arrival: date_of_arrival,
                                    modelId: arr_models_id[i]
                                })).id
                        }
                        catch(e){
                            return next(ApiError.badRequest("Создание товара в бд: " + e.message))
                        }

                        //изменяем размер в соответствующей полке

                        let shelf = new Array()
                        try{
                            shelf.push(await Shelf.findOne({
                                where: {id: arr_shelves_of_new_goods[i][j]
                                },
                                attributes: ['occupied_size']
                            }))
                            //console.log(shelf[0].occupied_size)
                        }
                        catch(e){
                            return next(ApiError.badRequest("Поиск полки в бд: " + e.message))
                        }
                            let size = parseInt(shelf[0].occupied_size) + parseInt(arr_models_sizes[i])
                            //console.log(`Размер: ${size}`)
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
                            return next(ApiError.badRequest("Сохранение размера полки в бд: " + e.message))
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
                            return next(ApiError.badRequest("Создание ячейки хранилища в бд: " + e.message))
                        }
                        
                        arr_id_new_goods.push(good_new_id)
                        good_new_id += 1
                    }
                }
            }
            catch(e){
                return next(ApiError.badRequest("Процесс добавления товаров в бд: " + e.message))
            }


            return res.json(`${add_msg} Товары моделей ${arr_models_id} добавлены. Айди новых товаров: ${arr_id_new_goods}. Полки для новых товаров: ${arr_shelves_of_new_goods}. Ячейки для новых товаров: ${arr_id_new_storages}.`)
        }
        catch(e){
            return next(ApiError.badRequest(e.message))
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
    async deleteOne(req, res, next){
        const {id} = req.params

        let del_storage = true
        let del_shelf = true

        let good
        try{
            good = await Good.findOne({
            where:{
                id: id
            },
            raw: true
        })
        } catch(e){
            return next(ApiError.badRequest("Поиск айди удаляемого товара: " + e.message))
        }

        if (good == null){
            return res.json(`Товара с идентификатором ${id} на складе нет.`)
        }

        //Из товара вытаскиваем модель, из модели её размер.
        //Из ячейки хранилища вытаскиваем полку, меняем размер полки.
        //Удаляем ячейку хранилища. Удаляем товар.
        //1.1) достаём айди модели
        let model_id
        try{
            model_id = await Good.findOne({
                attributes:['modelId'],
                where:{
                    id: id
                },
                raw: true
            })
        } catch(e){
            return next(ApiError.badRequest("Поиск айди модели удаляемого товара: " + e.message))
        }

        if (model_id == null){
            return res.json(`Модели для товара ${id} не существует`)
        }

        //1.2) достаём размер из найденной модели
        let size
        try {
            size = await Model.findOne({
                attributes: ['sizeId'],
                where: {
                    id: model_id.modelId
                },
                raw: true
            })
        } catch(e){
            return next(ApiError.badRequest("Поиск размера удаляемого товара: " + e.message))
        }
        
        //2.1) находим полку, на которой лежит товар
        let shelf_id
        try {
            shelf_id = await Storage.findOne({
                attributes: ['shelfId'],
                where: {
                    goodId: id
                },
                raw: true
            })
        } catch(e){
            return next(ApiError.badRequest("Поиск полки товара: " + e.message))
        }

        if (shelf_id == null){
            del_storage = false
            //return res.json(`Полки с идентификатором ${shelf_id} не существует`)
        }

        if (del_storage == true){
            //2.2) достаём размер этой полки
            let curr_shelf_size
            try {
                curr_shelf_size = await Shelf.findOne({
                    attributes: ['occupied_size'],
                    where: {
                        id: shelf_id.shelfId
                    },
                    raw: true
                })
            } catch(e){
                return next(ApiError.badRequest("Поиск текущего размера полки: " + e.message))
            }

            if (curr_shelf_size == null){
                del_shelf = false
            }

            if (del_shelf == true){
            //2.3) меняем размер этой полки
                let new_size
                try{
                    new_size = (curr_shelf_size.occupied_size - size.sizeId).toString()
                } catch(e){
                    return next(ApiError.badRequest("Задаём новый размер полки: " + e.message))
                }

                try {
                    await Shelf.update({
                        occupied_size: new_size
                    },
                    {
                        where: {
                            id: shelf_id.shelfId
                        },
                    })
                } catch(e){
                    return next(ApiError.badRequest("Изменение раземра полки: " + e.message))
                }
            }
            //3.1) Удаляем ячейку хранилища
            try{
                await Storage.destroy({
                    where: {
                        goodId: id
                    }
                });
            } catch(e){
                return next(ApiError.badRequest("Удаление ячейки хранилища: " + e.message))
            }
        }
        //3.2) Удаляем товар
        try{
            await Good.destroy({
                where: {
                    id: id
                }
            });
            return res.json({message: "OK"})
        } catch(e){
            return next(ApiError.badRequest("Удаление товара в БД товаров: " + e.message))
        }
    }

    async deleteByModelId(req, res, next){

        let del_storage = true
        let del_shelf = true
        
        //Находим рандомный товар заданной модели.
        //Из модели вытаскиваем её размер.
        //Из ячейки хранилища вытаскиваем полку, меняем размер полки.
        //Удаляем ячейку хранилища. Удаляем товар.

        //1. Ищем товар заданной модели
        //
        const {modelId} = req.params
        // let modelId
        // if (model_Id == undefined){
        //     //return res.json("Товаров данной модели на складе нет.")
        //     modelId = Math.floor(Math.random() * 3 + 1)
        // }
        // else{
        //     modelId = model_Id
        // }

        let id
        try{
            id = await Good.findOne({
            where:{
                modelId: modelId
            }
        })
        } catch(e){
            return next(ApiError.badRequest("Поиск товара соответствующей модели для удаления: " + e.message))
        }
        if (id === undefined || id === null || id < 0){
            return res.json("Товаров данной модели на складе нет!")
        }

        //2.1) достаём размер из модели
        let size
        try {
            size = await Model.findOne({
                attributes: ['sizeId'],
                where: {
                    id: modelId
                }
            })
        } catch(e){
            return next(ApiError.badRequest("Поиск размера удаляемого товара: " + e.message))
        }
        
        //3.1) находим полку, на которой лежит товар
        let shelf_id
        try {
            shelf_id = await Storage.findOne({
                attributes: ['shelfId'],
                where: {
                    goodId: id.id
                }
            })
        } catch(e){
            return next(ApiError.badRequest("Поиск полки товара: " + e.message))
        }

        if (shelf_id == null){
            del_storage = false
            //return res.json("Не найдена ячейка для удаляемого товара.")
        }

        if (del_storage == true){
            //3.2) достаём размер этой полки
            let curr_shelf_size
            try {
                curr_shelf_size = await Shelf.findOne({
                    attributes: ['occupied_size'],
                    where: {
                        id: shelf_id.shelfId
                    }
                })
            } catch(e){
                return next(ApiError.badRequest("Поиск текущего размера полки: " + e.message))
            }

            if (curr_shelf_size == null){
                del_shelf = false
                //return res.json("Не найдена полка для удаляемого товара.")
            }

            if (del_shelf == true){
                //3.3) меняем размер этой полки
                const new_size = (curr_shelf_size.occupied_size - size.sizeId).toString()

                try {
                    await Shelf.update({
                        occupied_size: new_size
                    },
                    {
                        where: {
                            id: shelf_id.shelfId
                        },
                    })
                } catch(e){
                    return next(ApiError.badRequest("Изменение раземра полки: " + e.message))
                }
            }

            //4.1) Удаляем ячейку хранилища

            if (del_storage == true){
                try{
                    await Storage.destroy({
                        where: {
                            goodId: id.id
                        }
                    });
                } catch(e){
                    return next(ApiError.badRequest("Удаление ячейки хранилища: " + e.message))
                }
            }
        }
        //4.2) Удаляем товар
        try{
            await Good.destroy({
                where: {
                    id: id.id
                }
            });
            return res.json({message: "OK"})
        } catch(e){
            return next(ApiError.badRequest("Удаление товара в БД товаров: " + e.message))
        }
    }
}

module.exports = new GoodController()