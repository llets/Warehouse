import {makeAutoObservable} from 'mobx'

class UserStore{

    _isAuth = false
    _user = false
    _isAdmin = false
    _id = 0

    constructor(){
        this._isAuth = false
        this._user = false
        this._isAdmin = false
        this._id = 0
        makeAutoObservable(this)
    }

    setIsAuth(a){
        this._isAuth = a
    }

    setUser(user){
        this._user = user
    }

    setIsAdmin(a){
        this._isAdmin = a
    }

    setId(num){
        this._id = num
    }

    get IsAuth(){
        return this._isAuth
    }

    get User(){
        return this._user
    }

    get UserId() {
        return this._id
    }

    get IsAdmin(){
        return this._isAdmin
    }
}

export default UserStore