const {User} = require('../models/models')
const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJwt = (id, login, role) => {
    return jwt.sign({id, login, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'})
}

// const checkEmail = (email) => {
//     const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;
//     return EMAIL_REGEXP.test(email);
// }
const checkPassword = (password) => {
    const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&-+=()!? "]).{8,128}$/;
    return PASSWORD_REGEXP.test(password);
}

class UserController {
    async registration(req, res, next) {
        try {
            const {login, password, role} = req.body
            if (!login) {
                // if (!login || !checkEmail(login)) {
                return next(ApiError.badRequest("Некорректный email"))
            }
            const candidate = await User.findOne({where: {login}})
            if (candidate) {
                return next(ApiError.badRequest("Пользователь с таким email уже существует"))
            }
            if (!password || !checkPassword(password)){
                return next(ApiError.badRequest("Некорректный пароль"))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({login, role, password: hashPassword})
            const token = generateJwt(user.id, user.login, user.role)
            return res.json({token: token})
        } catch (e) {
            next(ApiError.badRequest((e.message)))
        }
    }

    async login(req, res, next) {
        const {login, password} = req.body
        const user = await User.findOne({where: {login}})
        if (!user) {
            return next(ApiError.internal("Пользователь не найден"))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal("Указан неверный пароль"))
        }
        const token = generateJwt(user.id, user.login, user.role)
        return res.json({token: token})
    }

    async check(req, res) {
        // генерация нового токена и отправка на клиент
        const token = generateJwt(req.user.id, req.user.login, req.user.role)
        return res.json({token: token})
    }

    async getAll(req, res) {
        let users = await User.findAll()
        return res.json(users)
    }
}

module.exports = new UserController()