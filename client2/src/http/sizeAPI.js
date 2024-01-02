import {$host} from "./index";

export const fetchSize = async () => {
    const {data} = await $host.get('api/size')
    return data
}