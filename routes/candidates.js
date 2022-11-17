const express = require('express');
const router = express.Router();
const cors = require('cors');
const connection = require('../databaseConnection')
const util = require('util');

function setHeadersResponse(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
}


const query = util.promisify(connection.query).bind(connection);

async function getExperiences(id){
    try {
        const rows = await query(`SELECT CARGO, EMPRESA, INICIO, FIM FROM EXPERIENCES WHERE USER_ID = ${id}`);
        return rows
      } catch (e) {
        return e
      }

}

async function getGraduations(id){
    try {
        const rows = await query(`SELECT CURSO, INSTITUICAO, INICIO, FIM FROM GRADUATIONS WHERE USER_ID = ${id}`);
        return rows
      } catch (e) {
        return e
      }
}

async function getSoftSkills(id){
    try {
        const rows = await query(`SELECT NOME FROM SOFTSKILLS WHERE USER_ID = ${id}`);
        return rows
      } catch (e) {
        return e
      }
}

async function getHardSkills(id){
    try {
        const rows = await query(`SELECT NOME, NIVEL FROM HARDSKILLS WHERE USER_ID = ${id}`);
        return rows
      } catch (e) {
        return e
      }
}

async function getLanguages(id){
    try {
        const rows = await query(`SELECT NOME, NIVEL FROM LANGUAGES WHERE USER_ID = ${id}`);
        return rows
      } catch (e) {
        return e
      }
}


router.get('/', async (req, res) => {
    setHeadersResponse(res);


    let candidates = [];

    const select_ids = "SELECT ID, NOME FROM USER"

    connection.query(select_ids, async (err, result) => {
        if(err){
            res.json(err);
        }
        if(result.length > 0){
            for(i = 0; i < result.length; i++){
                const exp = await getExperiences(result[i].ID);
                const grad = await getGraduations(result[i].ID);
                const soft = await getSoftSkills(result[i].ID);
                const hard = await getHardSkills(result[i].ID);
                const lang = await getLanguages(result[i].ID);
                

                candidates.push({id: result[i].ID, nome: result[i].NOME, experiences: exp, graduations: grad, hardskills: hard, softskills: soft, languages: lang});
            }

            res.json(candidates)
        }else{
            res.json(null);
        }
    })
})

module.exports = router;