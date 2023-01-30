const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
    logging: false
})

sequelize.authenticate().then(() => {
    console.log('Conected sucessfully to the database on azure');
 }).catch((error) => {
    console.error('Connection failed: ', error);
 });

module.exports = sequelize;