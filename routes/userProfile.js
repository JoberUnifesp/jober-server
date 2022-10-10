const express = require('express');
const router = express.Router();
const cors = require('cors');
const connection = require('../databaseConnection')
const bcrypt = require('bcryptjs')

router.post('/Edit/Experience/:id', (req, res) => {  
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    let cargo = req.body.Cargo;
    let empresa = req.body.Empresa;
    let inicio = req.body.Inicio;
    let fim = req.body.Fim;

    let select_query = 'SELECT * FROM EXPERIENCES WHERE CARGO = ? AND EMPRESA = ? AND USER_ID = ?'
    connection.query(select_query, [cargo, empresa, req.params.id], (err, result) =>{
        if(err){
            res.json(err)
        }else{
            if (result.length === 0){
                console.log('aq')
                let insert_query = 'INSERT INTO EXPERIENCES(USER_ID, CARGO, EMPRESA, INICIO, FIM) VALUES (?, ?, ?, ?, ?)'
                connection.query(insert_query, [req.params.id, cargo, empresa, inicio, fim], (err, result) => {
                    if(err){
                        res.json(err)
                    }
                })
            }
        }
    })

    return res.status(200).json({message: 'experience sucessfully added', code: 200});
})


router.post('/Edit/HardSkills/:id', (req, res) => {  
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    let nome = req.body.Skill;
    let nivel = req.body.Nivel;

    let select_query = 'SELECT * FROM HARDSKILLS WHERE NOME = ? AND USER_ID = ?'
    connection.query(select_query, [nome, req.params.id], (err, result) =>{
        if(err){
            res.json(err)
        }else{
            if (result.length === 0){
                let insert_query = 'INSERT INTO HARDSKILLS (USER_ID, NOME, NIVEL) VALUES (?, ?, ?)'
                connection.query(insert_query, [req.params.id, nome, nivel], (err, result) => {
                    if(err){
                        res.json(err)
                    }
                })
            }
        }
    })

    return res.status(200).json({message: 'skill sucessfully added', code: 200});
})


router.post('/Edit/Graduation/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    let curso = req.body.Curso;
    let instituicao = req.body.Instituicao;
    let inicio = req.body.Inicio;
    let fim = req.body.Fim;

    let select_query = 'SELECT * FROM GRADUATIONS WHERE CURSO = ? AND INSTITUICAO = ? AND USER_ID = ?'
    connection.query(select_query, [curso, instituicao, req.params.id], (err, result) =>{
        if(err){
            res.json(err)
        }else{
            if (result.length === 0){
   
                let insert_query = 'INSERT INTO GRADUATIONS(USER_ID, CURSO, INSTITUICAO, INICIO, FIM) VALUES (?, ?, ?, ?, ?)'
                connection.query(insert_query, [req.params.id, curso, instituicao, inicio, fim], (err, result) => {
                    if(err){
                        res.json(err)
                    }
                })
            }
        }
    })

    return res.status(200).json({message: 'Graduation sucessfully added', code: 200});
})


router.post('/Edit/Languages/:id', (req, res) => {  
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    let nome = req.body.Lingua;
    let nivel = req.body.Nivel;

    let select_query = 'SELECT * FROM LANGUAGES WHERE NOME = ? AND USER_ID = ?'
    connection.query(select_query, [nome, req.params.id], (err, result) =>{
        if(err){
            res.json(err)
        }else{
            if (result.length === 0){
                let insert_query = 'INSERT INTO LANGUAGES (USER_ID, NOME, NIVEL) VALUES (?, ?, ?)'
                connection.query(insert_query, [req.params.id, nome, nivel], (err, result) => {
                    if(err){
                        res.json(err)
                    }
                })
            }
        }
    })

    return res.status(200).json({message: 'language sucessfully added', code: 200});
})


router.post('/Edit/SoftSkills/:id', (req, res) => {  
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    

    let skill = req.body.skill
    let select_query = 'SELECT * FROM SOFTSKILLS WHERE USER_ID = ? AND NOME = ?'
    connection.query(select_query, [req.params.id, skill], (err, result) =>{
        if(err){
            res.json(err)
        }else{
            if (result.length === 0){
                let insert_query = 'INSERT INTO SOFTSKILLS (USER_ID, NOME) VALUES (?, ?)'
                connection.query(insert_query, [req.params.id, skill], (err, result) => {
                    if(err){
                        res.json(err)
                    }
                })
            }
        }
    })

    return res.status(200).json({message: 'softskill sucessfully added', code: 200});
})

router.get('/ViewSoftSkills/:id', (req, res) => {
    let select_query = 'SELECT NOME FROM SOFTSKILLS WHERE USER_ID = ?';
    connection.query(select_query, [req.params.id], (err, result) =>{
        if(err){
            res.json(err)
        }else{
            if (result.length !== 0){
                let skills = []
                for(i=0; i<result.length; i++){
                    skills.push(result[i].NOME)
                }
                res.json(skills)
            }
        }
    })
})

router.get('/ViewExperiences/:id', (req, res) => {
    connection.query("SELECT * FROM EXPERIENCES WHERE USER_ID = ?", [req.params.id], (err, result) => {
        if(err){
            res.write(err);
        }
        else{
            if(result.length > 0){
                res.json(result)
            }
        }

    });

})

router.get('/ViewGraduations/:id', (req, res) => {
    connection.query("SELECT * FROM GRADUATIONS WHERE USER_ID = ?", [req.params.id], (err, result) => {
        if(err){
            res.write(err);
        }
        else{
            if(result.length > 0){
                res.json(result)
            }
        }

    });

})


router.get('/ViewHardSkills/:id', (req, res) => {
    connection.query("SELECT * FROM HARDSKILLS WHERE USER_ID = ?", [req.params.id], (err, result) => {
        if(err){
            res.write(err);
        }
        else{
            if(result.length > 0){
                res.json(result)
            }
        }

    });

})

router.get('/ViewLanguages/:id', (req, res) => {
    connection.query("SELECT * FROM LANGUAGES WHERE USER_ID = ?", [req.params.id], (err, result) => {
        if(err){
            res.write(err);
        }
        else{
            if(result.length > 0){
                res.json(result)
            }
        }

    });

})



router.get('/github/:id', (req, res) => {
    const select_query = "SELECT GITHUB FROM USER WHERE ID = ?";
    connection.query(select_query, [req.params.id], (err, result) => {
        if(err){
            res.json(err);
        }else{
            res.json(result[0].GITHUB)
        }
    })
})

router.get('/NomeSobrenome/:id', (req, res) => {
    const select_query = "SELECT NOME, SOBRENOME FROM USER WHERE ID = ?";
    connection.query(select_query, [req.params.id], (err, result) => {
        if(err){
            res.json(err);
        }else{
            res.json(result[0].NOME + ' ' + result[0].SOBRENOME)
        }
    })
})

router.get('/email/:id', (req, res) => {
    const select_query = "SELECT EMAIL FROM USER WHERE ID = ?";
    connection.query(select_query, [req.params.id], (err, result) => {
        if(err){
            res.json(err);
        }else{
            res.json(result[0].EMAIL)
        }
    })
})

router.put('/Edit/Github/:id', (req, res) => {  
    const update_query = "UPDATE USER SET GITHUB = ? WHERE ID = ?";
    const github = req.body.github;

    connection.query(update_query, [github, req.params.id], (err, result) => {
        if(err){
            res.json(err);
        }else{
            res.json({message: 'github updated successfully', code: 200})
        }
    })
})

router.delete('/Delete/Experience/:id', (req, res) => {
    const delete_query = "DELETE FROM EXPERIENCES WHERE ID = ?"
    const select_query = "SELECT * FROM EXPERIENCES WHERE USER_ID = ? ORDER BY ID DESC LIMIT 1"
    connection.query(select_query, [req.params.id], (err, result) => {
        if(err){
            res.json(err);
        }else{
            if(result.length > 0){
                let exp_id = result[0].ID
                connection.query(delete_query, [exp_id], (err, result) => {
                    if(err){
                    res.json(err)
                    }else{
                        res.json({message: 'experience deleted successfully', code: 200})
                    }
                })
            }
        }
    })
})

router.delete('/Delete/SoftSkill/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    const delete_query = "DELETE FROM SOFTSKILLS WHERE ID = ?"
    const select_query = "SELECT * FROM SOFTSKILLS WHERE USER_ID = ? ORDER BY ID DESC LIMIT 1"
    connection.query(select_query, [req.params.id], (err, result) => {
        if(err){
            res.json(err);
        }else{
            if(result.length > 0){
                let item_id = result[0].ID
                connection.query(delete_query, [item_id], (err, result) => {
                    if(err){
                    res.json(err)
                    }else{
                        res.json({message: 'SoftSkill deleted successfully', code: 200})
                    }
                })
            }
        }
    })
})


module.exports = router;
