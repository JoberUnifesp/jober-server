const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./databaseConnection')
const bcrypt = require('bcryptjs')

app.use(express.json())
app.use(cors())

const company = require("./routes/company.js");
const userProfile = require("./routes/userProfile.js");
const vacancy = require("./routes/vacancy.js");
const interaction = require("./routes/interaction.js");

app.use("/company", company);
app.use("/UserProfile", userProfile);
app.use("/vacancy", vacancy);
app.use("/interaction", interaction);

app.post('/SignUp', (req, res) => {     
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
    const senha = bcrypt.hashSync(req.body.senha, 3);
    const select_query = 'SELECT * FROM USER WHERE EMAIL = ?'
    const insert_query = 'INSERT INTO USER (NOME, SOBRENOME, DATA_DE_NASCIMENTO, EMAIL, SENHA) VALUES (?, ?, ?, ?, ?)'


    connection.query(select_query, [email], (err, result) => {
        if(err){
            res.json(err);
        }
        else if(result.length == 0){
            connection.query(insert_query, [nome, sobrenome, data_de_nascimento, email, senha], (err, result) => {
                if(err){
                    res.json(err);
                }
            })
            res.status(200).json({message: 'user registered sucessfully', code: 200});
        }
        if(result.length > 0){
            return res.status(409).json({message: 'email already registered', code: 409});
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
    const select_user_query = 'SELECT * FROM USER WHERE EMAIL = ?'
    const select_company_query = 'SELECT * FROM COMPANY WHERE EMAIL = ?'


    connection.query(select_user_query, [email], (err, result_user) => {
        if(err){
            res.json(err);
        }
        else if(result_user.length == 0){
            connection.query(select_company_query, [email], (err, result_company) => {
                if(err){
                    res.json(err);
                }else if(result_company.length == 0){
                    return res.status(404).json({message: 'user or company not found', code: 404})
                }else{
                    const verified = bcrypt.compareSync(senha, result_company[0].SENHA);

                    if(result_company.length > 0 && verified){
                        return res.status(200).json({message: 'company sucessfully authenticated', code: 200, id: result_company[0].ID, user: false});
                    }else{
                        return res.status(401).json({message: 'incorrect password', code: 401})
                    }
                }
            })
        }else{
            const verified = bcrypt.compareSync(senha, result_user[0].SENHA);

            if(result_user.length > 0 && verified){
                return res.status(200).json({message: 'user sucessfully authenticated', code: 200, id: result_user[0].ID, user: true});
            }else{
                return res.status(401).json({message: 'incorrect password', code: 401})
            }
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





