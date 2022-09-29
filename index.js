const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./databaseConnection')


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
            res.redirect('/home');
        }
        if(result.length > 0){
            return res.status(409).json({errorMessage: 'email already registered'});
        }

    });
});





app.post('/login', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );

    const email = req.body.email;
    const senha = req.body.senha;
    const select_query = 'SELECT * FROM USER WHERE EMAIL = ?'


    connection.query(select_query, [email], (err, result) => {
        if(err){
            res.json(err);
        }
        if(result.length == 0){
            return res.status(404).json({errorMessage: 'user not found'})
        }
        if(result.length > 0 && result[0].SENHA == senha){
            return res.status(200).json({status: 'user sucessfully authenticated'});
        }else{
            return res.status(401).json({errorMessage: 'incorrect password'})
        }

    });
});




app.get('/', (req, res) => {
    connection.query("SELECT * FROM USER", (err, result) => {
        if(err){
            res.write(err);
        }
        res.send(JSON.stringify(result))

    });
}) 

app.get('/home', (req, res) => {
    connection.query("SELECT * FROM USER", (err, result) => {
        if(err){
            res.write(err);
        }
        res.send(JSON.stringify(result))

    });
}) 



function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
  
    if (port >= 0) {
      return port;
    }
  
    return false;
  }

var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

