const express = require('express');
const router = express.Router();
const connection = require('../databaseConnection')
const bcrypt = require('bcryptjs')

function setHeadersResponse(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
}

router.post('/SignUp', (req, res) => {
    setHeadersResponse(res);
      
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = bcrypt.hashSync(req.body.senha, 3);
    const cnpj = req.body.cnpj;
    const telefone = req.body.telefone;
    const select_email_query = 'SELECT * FROM COMPANY WHERE EMAIL = ?'
    const select_cnpj_query = 'SELECT * FROM COMPANY WHERE CNPJ = ?'
    const insert_query = 'INSERT INTO COMPANY (NOME, EMAIL, SENHA, CNPJ, TELEFONE) VALUES (?, ?, ?, ?, ?)'
    
    connection.query(select_email_query, [email], (err, result) => {
        if(err){
            res.json(err);
        }
        if(result.length == 0){
            connection.query(select_cnpj_query, [cnpj], (err, result) => {
                if(err) {
                    res.json(err);
                }
                if(result.length == 0) {
                    connection.query(insert_query, [nome, email, senha, cnpj, telefone], (err, result) => {
                        if(err){
                            res.json(err);
                        }
                    })
                    res.status(200).json({message: 'company registered sucessfully', code: 200});
                }
                if(result.length > 0){
                    return res.status(409).json({message: 'cnpj already registered', code: 409});
                }
            })
        }
        if(result.length > 0){
            return res.status(409).json({message: 'email already registered', code: 409});
        }

    });
})

router.get('/', (req, res) => {
    connection.query("SELECT * FROM COMPANY", (err, result) => {
        if(err){
            res.write(err);
        }
        res.send(JSON.stringify(result))
    });
}) 

router.get('/:id', (req, res) => {  
    const id = req.params.id;

    let select_query = 'SELECT ID, NOME, EMAIL, CNPJ, TELEFONE, ENDERECO, DESCRICAO FROM COMPANY WHERE ID = ?'
    connection.query(select_query, [id], (err, result) =>{
        if (err) {
            console.log("error: ", err);
            res.send(err);
            return;
        }
        if (result.length) {
            res.send(JSON.stringify(result[0]));
            return;
        }
        res.status(404).json({message: 'company not founded', code: 404});
    });
})

router.patch('/updateNameAndEmail/:id', (req, res) => {
    setHeadersResponse(res);
    
    const id = req.params.id;
    const nome = req.body.nome;
    const email = req.body.email;

    const select_id_query = 'SELECT * FROM COMPANY WHERE ID = ?'
    const update_query = 'UPDATE COMPANY SET NOME = ?, EMAIL = ? WHERE ID = ?'
    
    connection.query(select_id_query, [id], (err, result) => {
        if(err){
            res.json(err);
        }
        if(result.length == 0){
            return res.status(404).json({message: 'company id not found', code: 404});
        }
        if(result.length > 0){
            connection.query(update_query, [nome, email, id], (err, result) => {
                if(err) {
                    res.json(err);
                }
                if(result.length == 0) {
                    return res.status(200).json({message: 'company info updated sucessfully', code: 200});
                }
            })
            return res.status(200).json({message: 'company info updated sucessfully', code: 200});
        }
    });
})

router.patch('/profile/:id', (req, res) => {
    setHeadersResponse(res);
    
    const id = req.params.id;
    const endereco = req.body.endereco;
    const telefone = req.body.contato;
    const descricao = req.body.descricao;

    const select_id_query = 'SELECT * FROM COMPANY WHERE ID = ?'
    const update_query = 'UPDATE COMPANY SET ENDERECO = ?, TELEFONE = ?, DESCRICAO = ? WHERE ID = ?'
    
    connection.query(select_id_query, [id], (err, result) => {
        if(err){
            res.json(err);
        }
        if(result.length == 0){
            return res.status(404).json({message: 'company id not found', code: 404});
        }
        if(result.length > 0){
            connection.query(update_query, [endereco, telefone, descricao, id], (err, result) => {
                if(err) {
                    res.json(err);
                }
                if(result.length == 0) {
                    return res.status(200).json({message: 'company profile updated sucessfully', code: 200});
                }
                if(result.length > 0){
                    return res.status(409).json({message: 'company profile already registered', code: 409});
                }
            })
            return res.status(200).json({message: 'company profile updated sucessfully', code: 200});
        }
    });
})

module.exports = router;