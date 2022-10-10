const express = require('express');
const router = express.Router();
const connection = require('../databaseConnection')

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

module.exports = router;