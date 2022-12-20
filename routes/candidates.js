const express = require('express');
const router = express.Router();
const cors = require('cors');
const connection = require('../databaseConnection')
const util = require('util');


function setHeadersResponse(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
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

async function getLike(id, vacancy_id){
  try {
      const row = await query(`SELECT USER_LIKED FROM MATCHED WHERE USER_ID = ${id} AND VACANCY_ID = ${vacancy_id}`);
      return row
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


router.get('/:idVacancy', async (req, res) => {
    setHeadersResponse(res);
    const idVacancy = req.params.idVacancy;
    console.log(idVacancy);

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
                let like = await getLike(result[i].ID, idVacancy);
                let value = false
                if(like[0] !== undefined){
                  if(like[0].USER_LIKED !== null){
                    value = true
                  }
                }


                exp = exp.map(format) 
                grad = grad.map(format) 
                soft = soft.map(format) 
                hard = hard.map(format) 
                lang = lang.map(format) 
                

                candidates.push({Id: result[i].ID, Nome: result[i].NOME + " " + result[i].SOBRENOME, Experiencias: exp, Formacoes: grad, HardSkills: hard, Idiomas: lang, softSkills: soft, like: value});
            }

            res.json(candidates)
        }else{
            res.json(null);
        }
    })
})

async function getCandidateInfo(id) {
  let exp = await getExperiences(id);
  let grad = await getGraduations(id);
  let soft = await getSoftSkills(id);
  let hard = await getHardSkills(id);
  let lang = await getLanguages(id);

  exp = exp.map(format) 
  grad = grad.map(format) 
  soft = soft.map(format) 
  hard = hard.map(format) 
  lang = lang.map(format) 

  return {exp, grad, hard, lang, soft}
}

router.get('/:idCandidate', async (req, res) => {
  const idCandidate = req.params.idCandidate;

  const select_candidate = "SELECT ID, NOME, SOBRENOME FROM USER WHERE ID = ?"

  connection.query(select_candidate, [idCandidate], async (err, result) => {
    if(err){
        throw err
    } if (result.length > 0) {
        let infos = await getCandidateInfo(result[0].ID)
        candidate = {Id: result[0].ID, Nome: result[0].NOME + " " + result[0].SOBRENOME, Experiencias: infos.exp, Formacoes: infos.grad, HardSkills: infos.hard, Idiomas: infos.lang, softSkills: infos.soft}
        res.json(candidate)
    } else {
        res.status(404).json({message: 'Candidate not found', code: 404});
    }
  });
})


module.exports = router;