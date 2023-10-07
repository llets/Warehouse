const sequelize = require('../db')
const { DataTypes } = require('sequelize')


const Rack = sequelize.define('Rack',{
    id_rack: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    number: {type: DataTypes.INTEGER, allowNull:false},
    shelfs_number: {type: DataTypes.INTEGER, allowNull:false},
})
const Shelf = sequelize.define('Shelf',{
    id_shelf: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    number: {type: DataTypes.INTEGER, allowNull:false},
    max_size: {type: DataTypes.INTEGER, allowNull:false},
    occup_size: {type: DataTypes.INTEGER, allowNull:false},
})
const Floor = sequelize.define('Floor',{
    id_floor: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    number: {type: DataTypes.INTEGER, allowNull:false},
    max_size: {type: DataTypes.INTEGER, allowNull:false},
    occup_size: {type: DataTypes.INTEGER, allowNull:false},
})
const Storage = sequelize.define('Storage',{
    id_storage: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
})

const Category = sequelize.define('Category', {
    id_categ: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    categ_name: {type: DataTypes.TEXT, allowNull:false},
})
const Size = sequelize.define('Size', {
    id_size: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    amount: {type: DataTypes.INTEGER, allowNull:false},
    description: {type: DataTypes.TEXT, allowNull:false},
})
const Model = sequelize.define('Model', {
    id_model: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    model_name: {type: DataTypes.TEXT, unique:true, allowNull:false},
    description: {type: DataTypes.TEXT, allowNull:true},
})
const Good = sequelize.define('Good', {
    id_good: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    date_of_arrival: {type: DataTypes.DATE, allowNull:false},
})

const User_data = sequelize.define('User_data', {
    id_user: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.TEXT, unique: true,},
    password: {type: DataTypes.TEXT, allowNull:false},
    name: {type: DataTypes.TEXT, allowNull:false},
})
const Log = sequelize.define('Log', {
    id_log: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    action: {type: DataTypes.TEXT, allowNull:false,},
})

Rack.hasMany(Shelf)
Shelf.belongsTo(Rack)

Rack.hasMany(Storage)
Storage.belongsTo(Rack)

Shelf.hasMany(Storage)
Storage.belongsTo(Shelf)

Floor.hasMany(Storage)
Storage.belongsTo(Floor)

Storage.hasMany(Log)
Log.belongsTo(Storage)


Category.hasMany(Good)
Good.belongsTo(Category)

Size.hasMany(Model)
Model.belongsTo(Size)

Model.hasMany(Good)
Good.belongsTo(Model)

Good.hasOne(Storage)
Storage.belongsTo(Good)

Good.hasMany(Log)
Log.belongsTo(Good)


User_data.hasMany(Log)
Log.belongsTo(User_data)


module.exports = {
    Rack, Shelf, Floor, Storage,
    Category, Size, Model, Good,
    User_data, Log
}