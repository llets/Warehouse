require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const PORT = process.env.PORT || 5000
const cors = require('cors')
const router = require('./routes/index')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

// обработка ошибок, последний middleware
app.use(errorHandler)

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