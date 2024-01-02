// const {Sequelize} = require('sequelize')
// const {config} = require('dotenv')
//
//
// config();
//
// module.exports = new Sequelize(
//     "Warehouse",
//     "postgres",
//     "root",
//     {
//         dialect: 'postgres',
//         host: "localhost",
//         port: 5432
//     }
// )

const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
)