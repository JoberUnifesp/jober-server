const sequelize = require('../databaseConnection');
const { Model } = require('sequelize');

class Company extends Model {}

module.exports = (sequelize, DataTypes) => {
    const company = Company.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
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
        cnpj: {
            type: DataTypes.STRING,
            allowNull: false
        },
        telefone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        endereco: {
            type: DataTypes.STRING
        },
        descricao: {
            type: DataTypes.STRING
        }
    }, 
    {
        sequelize, 
        modelName: 'company',
        tableName: 'company',
        timestamps: false 
    });

    return company;
}