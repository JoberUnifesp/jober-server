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


function format(x){
  if(x.INICIO != undefined){
    x.INICIO = JSON.stringify(x.INICIO)
    x.INICIO = x.INICIO.substring(0, x.INICIO.indexOf('T'))
    x.FIM = JSON.stringify(x.FIM)
    x.FIM = x.FIM.substring(0, x.FIM.indexOf('T'))
  }


  x = JSON.stringify(x); 
  x = x.toLowerCase(); 
  x = x.replace(/"|{|/g, ''); 
  x = x.replace(/,/g, ', '); 
  x = x.replace(/:/g, ': ');
  x = x.replace(/[\\]/g, '');
  x = x.slice(0, -1);

  if(x.includes('nome:')){
    x = x.replace(/nome: |, nivel:/g, '');
  }
  if(x.includes('empresa')){
    x = x.replace(/empresa/, 'Empresa');
    
    x = x.replace('fim', 'Fim');
    x = x.replace('inicio', 'Início');
  }
  if(x.includes('instituicao')){
    x = x.replace(/instituicao/, 'Instituição');
    
    x = x.replace('fim', 'Fim');
    x = x.replace('inicio', 'Início');
  }

  
  return x.charAt(0).toUpperCase() + x.slice(1);
}


router.get('/', async (req, res) => {
    setHeadersResponse(res);


    let candidates = [];

    const select_ids = "SELECT ID, NOME, SOBRENOME FROM USER"

    connection.query(select_ids, async (err, result) => {
        if(err){
            res.json(err);
        }
        if(result.length > 0){
            for(i = 0; i < result.length; i++){
                let exp = await getExperiences(result[i].ID);
                let grad = await getGraduations(result[i].ID);
                let soft = await getSoftSkills(result[i].ID);
                let hard = await getHardSkills(result[i].ID);
                let lang = await getLanguages(result[i].ID);


                exp = exp.map(format) 
                grad = grad.map(format) 
                soft = soft.map(format) 
                hard = hard.map(format) 
                lang = lang.map(format) 
                

                candidates.push({Id: result[i].ID, Nome: result[i].NOME + " " + result[i].SOBRENOME, Experiencias: exp, Formacoes: grad, HardSkills: hard, Idiomas: lang, softSkills: soft});
            }

            res.json(candidates)
        }else{
            res.json(null);
        }
    })
})

module.exports = router;