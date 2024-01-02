import {$authHost, $host} from "./index";
import {jwtDecode} from "jwt-decode";

export const registration = async (login, password) => {
    const {data} = await $host.post('api/user/registration', {login, password, role: 'USER'})
    localStorage.setItem('token', data.token)
    return data.token
}
export const login = async (login, password) => {
    const {data} = await $host.post('api/user/login', {login, password})
    localStorage.setItem('token', data.token)
    return data.token
}
export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}