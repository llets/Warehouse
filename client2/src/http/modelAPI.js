import {$authHost} from "./index";

export const fetchModel= async () => {
    const {data} = await $authHost.get('api/model')
    return data
}

export const createModel= async (modelData) => {
    const {data} = await $authHost.post('api/model', modelData)
    return data
}