const sequelize = require('../databaseConnection');
const { Model } = require('sequelize');

class User extends Model {}

module.exports = (sequelize, DataTypes) => {
    const user = User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sobrenome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data_de_nascimento: {
            type: DataTypes.DATE,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        },
        github: {
            type: DataTypes.STRING
        }
    }, 
    {
        sequelize, 
        modelName: 'user',
        tableName: 'user',
        timestamps: false 
    });

    return user;
}