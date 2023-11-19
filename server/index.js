require('dotenv').config()
const express = require('express')
const sequelize = require('./db.js')
const models = require('./models/models')
const PORT = process.env.PORT || 5000
const cors = require('cors')
const router = require('./routes/index')
const ApiError = require('./error/ApiError')
const ErrorHandler = require('./middleWare/ErrorHandlingMiddleware.js')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

// обработка ошибок, последний middleware
app.use(ErrorHandler)



const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
    } catch (e) {
        console.log((e))
    }
}

start()