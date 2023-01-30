const sequelize = require('../databaseConnection');
const bcrypt = require('bcryptjs');
const getUserRepository = require('../models/user.model.js');
const getCompanyRepository = require('../models/company.model.js');
const { DataTypes } = require('sequelize');

class AuthService {
    async syncronize(){
        await sequelize.sync();
        console.log("All models were synchronized successfully.");
    }

    constructor(){
        this.userRepository = getUserRepository(sequelize, DataTypes);
        this.companyRepository = getCompanyRepository(sequelize, DataTypes);
        this.syncronize();
    }

    async findAll(){
        const users = await this.userRepository.findAll({raw: true});
        if(!users){
            throw new Error(`No users registered`)
        }
        return users;
    }

    async login(email, password){
        const candidate = await this.userRepository.findOne({
            raw: true, 
            where : {
                email: email
            }
        });

        const company = await this.companyRepository.findOne({
            raw: true, 
            where : {
                email: email
            }
        });

        const user = ! candidate ? company : candidate;
        
        if(!user) {
            return {message: 'User not registered', code: 404}
        }

        const verified = bcrypt.compareSync(password, user.senha);

        if(!verified){
            return {message: 'Incorrect password', code: 401}
        }

        return {message: 'User sucessfully authenticated', code: 200}
    }

}

module.exports = new AuthService();