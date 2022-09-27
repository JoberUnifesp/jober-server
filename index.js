const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

// const dotenv = require('dotenv');
// dotenv.config();


//conexao temporaria com mysql:
const connection = mysql.createConnection({
    host: 'engsoft-mysql.mysql.database.azure.com',
    user: 'globaluser',
    password: 'xgJ3zFFhn5B6wA',
    database: 'APP'
})

connection.connect((err) => {
    if (err){
        console.log('Connection failed: ', err);
        return;
    }

    console.log(`Conected sucessfully to ${process.env.DATABASE}`)
})

//-------------------------


app.use(express.json())
app.use(cors())


app.post('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );

      
    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const data_de_nascimento = req.body.data_de_nascimento;
    const email = req.body.email;
    const senha = req.body.senha;
    const select_query = 'SELECT * FROM USER WHERE EMAIL = ?'
    const insert_query = 'INSERT INTO USER (NOME, SOBRENOME, DATA_DE_NASCIMENTO, EMAIL, SENHA) VALUES (?, ?, ?, ?, ?)'


    connection.query(select_query, [email], (err, result) => {
        if(err){
            res.json(err);
        }
        if(result.length == 0){
            connection.query(insert_query, [nome, sobrenome, data_de_nascimento, email, senha], (err, result) => {
                if(err){
                    res.json(err);
                }
            })
        }
    });
});

// app.get('/jober/SignUp', (req, res) => {
//     res.send('Server side')
// }) 

app.get('/', (req, res) => {
    res.send('homepage')
}) 

port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server running on port 3001')
})

