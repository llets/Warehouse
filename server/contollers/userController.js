const {User} = require('../models/models')
const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJwt = (id, login, name) => {
    return jwt.sign({id, login, name},
        process.env.SECRET_KEY,
        {expiresIn: '24h'})
}

class UserController{
    async registration(req, res, next){
        const {login, password, name} = req.body
        if (!login || !password){
            return next(ApiError.badRequest("Некорректный login или пароль"))
        }
        const candidate = await User.findOne({where: {login}})
        if (candidate){
            return next(ApiError.badRequest("Пользователь с таким login уже существует"))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({name, login, password: hashPassword})
        const token = generateJwt(user.id, user.login, user.name)
        return res.json(token)
    }
    async login(req, res, next){
        const {login, password} = req.body
        const user =  await User.findOne({where: {login}})
        if (!user){
            return next(ApiError.internal("Пользоавтель не найден"))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword){
            return next(ApiError.internal("Указан неверный пароль"))
        }
        const token = generateJwt(user.id, user.login, user.name)
        return res.json({token})
    }
    async check(req, res, next){
        // генерация нового токена и отправка на клиент
        const token = generateJwt(req.user.id, req.user.login, req.user.name)
        return res.json({token})
    }

}

module.exports = new UserController()