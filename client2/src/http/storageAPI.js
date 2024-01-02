import {$host} from "./index";

export const fetchStorage = async () => {
    const {data} = await $host.get('api/storage')
    console.log(JSON.stringify(data))
    return data
}