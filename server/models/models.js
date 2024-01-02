const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const Rack = sequelize.define('rack',{
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    number: {type: DataTypes.INTEGER, allowNull:false},
    shelves_number: {type: DataTypes.INTEGER, allowNull:false},
})
const Shelf = sequelize.define('shelf',{
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    number: {type: DataTypes.INTEGER, allowNull:false},
    max_size: {type: DataTypes.INTEGER, allowNull:false},
    occupied_size: {type: DataTypes.INTEGER, allowNull:false},
})
const Storage = sequelize.define('storage',{
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
})
const Size = sequelize.define('size', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    amount: {type: DataTypes.INTEGER, allowNull:false},
    description: {type: DataTypes.TEXT, allowNull:false},
})
const Model = sequelize.define('model', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.TEXT, unique:true, allowNull:false},
    description: {type: DataTypes.TEXT, allowNull:true},
})
const Good = sequelize.define('good', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    date_of_arrival: {type: DataTypes.DATE, allowNull:false},
})
const User = sequelize.define('user', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.TEXT, unique: true},
    password: {type: DataTypes.TEXT, allowNull:false},
    role: {type: DataTypes.STRING, defaultValue: 'USER'}
})
const Log = sequelize.define('log', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    action: {type: DataTypes.TEXT, allowNull:false,}
})

Rack.hasMany(Shelf)
Shelf.belongsTo(Rack)

Shelf.hasMany(Storage)
Storage.belongsTo(Shelf)

Size.hasMany(Model)
Model.belongsTo(Size)

Model.hasMany(Good)
Good.belongsTo(Model)

Good.hasOne(Storage)
Storage.belongsTo(Good)

Good.hasMany(Log)
Log.belongsTo(Good)

User.hasMany(Log)
Log.belongsTo(User)

module.exports = {
    Rack, Shelf, Storage,
    Size, Model, Good,
    User, Log
}