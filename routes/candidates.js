const express = require('express');
const router = express.Router();
const cors = require('cors');
const connection = require('../databaseConnection')
const fetch = require('node-fetch');

function setHeadersResponse(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
}

const base_url = "https://jober.azurewebsites.net";
const local_url = "http://localhost:3001";

async function getExperiences(id){
    try{
        const res = await fetch(`${base_url}/UserProfile/ViewExperiences/${id}`, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
            }
          });
          const data = await res.json();
          return data
    }catch(error){
        return error;
    }

}

async function getGraduations(id){
    try{
        const res = await fetch(`${base_url}/UserProfile/ViewGraduations/${id}`, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
            }
          });
          const data = await res.json();
          return data
    }catch(error){
        return error;
    }
}

async function getSoftSkills(id){
    try{
        const res = await fetch(`${base_url}/UserProfile/ViewSoftSkills/${id}`, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
            }
          });
          const data = await res.json();
          return data
    }catch(error){
        return error;
    }
}

async function getHardSkills(id){
    try{
        const res = await fetch(`${base_url}/UserProfile/ViewHardSkills/${id}`, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
            }
          });
          const data = await res.json();
          return data
    }catch(error){
        return error;
    }
}

async function getLanguages(id){
    try{
        const res = await fetch(`${base_url}/UserProfile/ViewLanguages/${id}`, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
            }
          });
          const data = await res.json();
          return data
    }catch(error){
        return error;
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