const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'eggeggegg', require('../token.json').dbpw, {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: './DB/db.sqlite'
});
module.exports = { sequelize, DataTypes };