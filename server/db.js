const {Sequelize} = require('sequelize')
const {config} = require('dotenv')


config();

module.exports = new Sequelize(
    "Warehouse",
    "postgres",
    "root",
    {
        dialect: 'postgres',
        host: "localhost",
        port: 5432
    }
)