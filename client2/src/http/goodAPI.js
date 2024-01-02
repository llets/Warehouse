import {$host} from "./index";

export const createGood= async (goodData) => {
    const {data} = await $host.post('api/good', goodData)
    return data
}

export const deleteGood= async (arr_models_id, arr_model_names, arr_goods_amount) => {
    let result = ''
    let response = ''
    let count  = 0
    // loop for each model
    for (let i = 0; i < arr_models_id.length; i++) {
        count = 0
        // loop for each item of model
        for (let j = 0; j < arr_goods_amount[i]; j++) {
            let modelId = arr_models_id[i]
            response = await $host.delete('api/good/by_model/' + modelId)
            if (response.data.message === 'OK')
                count += 1
        }
        if (count === arr_goods_amount[i])
            result += `All ${arr_goods_amount[i]} items of the model "${arr_model_names[i]}" were deleted.\n`
        else if (count === 0)
            result += `There are no items of the model "${arr_model_names[i]}" in the storage. Nothing is deleted.\n`
        else
            result += `${count} of ${arr_goods_amount[i]} items of the model "${arr_model_names[i]}" were deleted. There are no more items.\n`
    }
    return result
}