const express = require('express');
const router = express.Router();
const cors = require('cors');
const connection = require('../databaseConnection')

function setHeadersResponse(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
}

router.post('/', (req, res) => {
    setHeadersResponse(res);

    const idCompany = req.body.idCompany;
    const company_name = req.body.companyName;

    const cargo = req.body.cargo;
    const area = req.body.area;
    const softSkill1 = req.body.softSkill1;
    const softSkill2 = req.body.softSkill2;
    const softSkill3 = req.body.softSkill3;
    const tempoExperiencia = req.body.tempoExperiencia;
    const idioma = req.body.idioma;
    const idiomaNivel = req.body.idiomaNivel;
    const cidade = req.body.cidade;

    const hardSkill1Desc = req.body.hardSkill1Desc;
    const hardSkill1Nivel = req.body.hardSkill1Nivel;

    const hardSkill2Desc = req.body.hardSkill2Desc;
    const hardSkill2Nivel = req.body.hardSkill2Nivel;

    const hardSkill3Desc = req.body.hardSkill3Desc;
    const hardSkill3Nivel = req.body.hardSkill3Nivel;

    const atributos_vacancy = [cargo, area, tempoExperiencia, idioma, idiomaNivel, cidade, idCompany, company_name];
    
    const select_company_query = 'SELECT * FROM COMPANY WHERE ID = ?'
    const insert_vacancy_query = 'INSERT INTO VACANCY (CARGO, AREA, EXPERIENCIA, IDIOMA, IDIOMA_NIVEL, CIDADE, COMPANY_ID, COMPANY_NAME) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    const insert_skills_query = 'INSERT INTO SKILLS (SS_1, SS_2, SS_3, HS_1, HS_1_NIVEL, HS_2, HS_2_NIVEL, HS_3, HS_3_NIVEL, VACANCY_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    

    connection.query(select_company_query, [idCompany], (err, result) => {
        if(err){
            res.json(err);
        }
        if(result.length == 0){
            return res.status(404).json({message: 'not found company', code: 404});
        }
        if(result.length > 0){
            connection.query(insert_vacancy_query, atributos_vacancy, (err, resultVacancy) => {
                if(err){
                    console.log(err.message);
                    res.json(err);
                }
                const vacancyId = resultVacancy.insertId;
                const atributos_skills = [softSkill1, softSkill2, softSkill3, hardSkill1Desc, hardSkill1Nivel, hardSkill2Desc, hardSkill2Nivel, hardSkill3Desc, hardSkill3Nivel, vacancyId];

                connection.query(insert_skills_query, atributos_skills, (err, result) => {
                    if(err){
                        console.log(err.message);
                        res.json(err);
                    }
                })
                res.status(200).json({message: 'vacancy registered sucessfully', code: 200});
            })            
        }
    });
})

//--------------------------------------

function calculateScore(vacancies, userAtributes){

    levels = [{name: 'básico', value: 0}, {name: 'intermediário', value: 1}, {name: 'avançado', value: 2}]

    for(i=0; i<vacancies.length; i++){
        score = 0;
        for(j=0; j<userAtributes.length; j++){
            if(userAtributes[j].NOME.toLowerCase().includes(vacancies[i].HS_1.toLowerCase())){
                score += 1

                let user_level_value = levels.find(item => item.name == userAtributes[j].NIVEL.toLowerCase()).value
                let vacancy_level_value = levels.find(item => item.name == vacancies[i].HS_1_NIVEL.toLowerCase()).value
                if(vacancy_level_value <= user_level_value){
                    score += 1
                }
            }
            

            if(userAtributes[j].NOME.toLowerCase().includes(vacancies[i].HS_2.toLowerCase())){
                score += 1
                let user_level_value = levels.find(item => item.name == userAtributes[j].NIVEL.toLowerCase()).value
                let vacancy_level_value = levels.find(item => item.name == vacancies[i].HS_2_NIVEL.toLowerCase()).value
                if(vacancy_level_value <= user_level_value){
                    score += 1
                }
            }

            if(userAtributes[j].NOME.toLowerCase().includes(vacancies[i].HS_3.toLowerCase())){
                score += 1
                let user_level_value = levels.find(item => item.name == userAtributes[j].NIVEL.toLowerCase()).value
                let vacancy_level_value = levels.find(item => item.name == vacancies[i].HS_3_NIVEL.toLowerCase()).value
                if(vacancy_level_value <= user_level_value){
                    score += 1
                }
            }
        }
        vacancies[i]['score'] = score;
    }

    return vacancies;
}

//--------------------------------------

router.get('/allVacancies/:user_id', (req, res) => {
    setHeadersResponse(res);
    let temp = '';
    let vacancies = '';

    const select_vacancy_query = 'SELECT * FROM VACANCY JOIN SKILLS ON SKILLS.VACANCY_ID=VACANCY.ID'
    connection.query(select_vacancy_query, (err, result) => {
        if(err){
            res.write(err);
        }else if(result.length > 0){

            connection.query("SELECT * FROM MATCHED WHERE USER_ID = ?", [req.params.user_id], (err, match_result) => {
                if(err){
                    res.json(err)
                }else if(result.length > 0){
                    result.map(element => {
                        match_result.forEach(item => {
                            if(element.ID === item.VACANCY_ID){
                                element['like'] = true
                            }
                        })

                        if(element.like === undefined){
                            element['like'] = false
                        }

                        return element
                    });

                    connection.query("SELECT * FROM HARDSKILLS WHERE USER_ID = ?", [req.params.user_id], (err, skills_result) => {
                        if(err){
                            res.json(err)
                        }else if(skills_result.length > 0){
                            vacancies = calculateScore(result, skills_result)
                            vacancies.sort( (a,b) => b.score - a.score ); //sort in descending order
                    
                            res.send(JSON.stringify(vacancies))
                        }else{
                            res.json({message: "No skills registered"})
                        }
                    })
                }
            })

        }
    });
}) 

//get all job vacancies from company
router.get('/:idCompany', (req, res) => {
    const idCompany = req.params.idCompany;
    const select_vacancy_query = 'SELECT * FROM VACANCY JOIN SKILLS ON SKILLS.VACANCY_ID=VACANCY.ID WHERE COMPANY_ID = ?'
    connection.query(select_vacancy_query, [idCompany], (err, result) => {
        if(err){
            res.write(err);
        }
        res.send(JSON.stringify(result))
    });
}) 

//get one job vacancy
router.get('/oneVacancy/:idVacancy', (req, res) => {
    const idVacancy = req.params.idVacancy;
    const select_one_vacancy_query = 'SELECT * FROM VACANCY JOIN SKILLS ON SKILLS.VACANCY_ID=VACANCY.ID WHERE VACANCY.ID = ?'
    connection.query(select_one_vacancy_query, [idVacancy], (err, result) => {
        if(err){
            res.write(err);
        } else if(result.length > 0){
            res.send(JSON.stringify(result))
        } else {
            res.json({message: 'Vacancy not founded. Invalid ID', code: 404})
        }
    });
}) 

router.delete('/:id', (req, res) => {
    setHeadersResponse(res);
    const idVacancy = req.params.id;

    const select_vacancy_query = 'SELECT * FROM VACANCY WHERE ID = ?'
    const delete_skills_query = 'DELETE FROM SKILLS WHERE VACANCY_ID = ?'
    const delete_vacancy_query = 'DELETE FROM VACANCY WHERE ID = ?'

    connection.query(select_vacancy_query, [idVacancy], (err, result) => {
        if(err){
            res.write(err);
        } 
        if(result.length > 0){
            connection.query(delete_skills_query, [idVacancy], (err, result) => {
                if(err){
                    res.json(err)
                } else {
                    connection.query(delete_vacancy_query, [idVacancy], (err, result) => {
                        if(err){
                        res.json(err)
                        }else{
                            res.json({message: 'Vacancy deleted successfully', code: 200})
                        }
                    })
                }
            })
        }
        else {
            res.json({message: 'Vacancy not founded', code: 404})
        }
    });
})

router.patch('/:id', (req, res) => {
    setHeadersResponse(res);
    const idVacancy = req.params.id;

    const cargo = req.body.cargo;
    const area = req.body.area;
    const softSkill1 = req.body.softSkill1;
    const softSkill2 = req.body.softSkill2;
    const softSkill3 = req.body.softSkill3;
    const tempoExperiencia = req.body.tempoExperiencia;
    const idioma = req.body.idioma;
    const idiomaNivel = req.body.idiomaNivel;
    const cidade = req.body.cidade;

    const hardSkill1Desc = req.body.hardSkill1Desc;
    const hardSkill1Nivel = req.body.hardSkill1Nivel;

    const hardSkill2Desc = req.body.hardSkill2Desc;
    const hardSkill2Nivel = req.body.hardSkill2Nivel;

    const hardSkill3Desc = req.body.hardSkill3Desc;
    const hardSkill3Nivel = req.body.hardSkill3Nivel;

    const atributos_vacancy = [cargo, area, tempoExperiencia, idioma, idiomaNivel, cidade, idVacancy];
    const atributos_skills = [softSkill1, softSkill2, softSkill3, hardSkill1Desc, hardSkill1Nivel, hardSkill2Desc, hardSkill2Nivel, hardSkill3Desc, hardSkill3Nivel, idVacancy];

    const select_vacancy_query = 'SELECT * FROM VACANCY WHERE ID = ?'
    const update_vacancy_query = 'UPDATE VACANCY SET CARGO = ?, AREA = ?, EXPERIENCIA = ?, IDIOMA = ?, IDIOMA_NIVEL = ?, CIDADE = ? WHERE ID = ?'
    const update_skills_query = 'UPDATE SKILLS SET SS_1 = ?, SS_2 = ?, SS_3 = ?, HS_1 = ?, HS_1_NIVEL = ?, HS_2 = ?, HS_2_NIVEL = ?, HS_3 = ?, HS_3_NIVEL = ? WHERE VACANCY_ID = ?'

    connection.query(select_vacancy_query, [idVacancy], (err, result) => {
        if(err){
            res.write(err);
        } 
        if(result.length > 0){
            connection.query(update_vacancy_query, atributos_vacancy, (err, result) => {
                if(err){
                    res.json(err)
                } else {
                    connection.query(update_skills_query, atributos_skills, (err, result) => {
                        if(err){
                            res.json(err)
                        }else{
                            res.json({message: 'Vacancy edited successfully', code: 200})
                        }
                    })
                }
            })
        }
        else {
            res.json({message: 'Fail to Edit: Vacancy not founded', code: 404})
        }
    });
})


module.exports = router;