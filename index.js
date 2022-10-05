const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./databaseConnection')
const bcrypt = require('bcryptjs')

app.use(express.json())
app.use(cors())


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
                        return res.status(200).json({message: 'company sucessfully authenticated', code: 200, id: result_company[0].ID});
                    }else{
                        return res.status(401).json({message: 'incorrect password', code: 401})
                    }
                }
            })
        }else{
            const verified = bcrypt.compareSync(senha, result_user[0].SENHA);

            if(result_user.length > 0 && verified){
                return res.status(200).json({message: 'user sucessfully authenticated', code: 200, id: result_user[0].ID});
            }else{
                return res.status(401).json({message: 'incorrect password', code: 401})
            }
        }

    });
});

app.post('/UserProfile/Edit/Experience', (req, res) => {  
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
    for(i=0; i<req.body.length; i++){
        let info = req.body[i]

        let cargo = info.cargo;
        let empresa = info.empresa;
        let inicio = info.inicio;
        let fim = info.fim;

        let select_query = 'SELECT * FROM EXPERIENCES WHERE CARGO = ? AND EMPRESA = ?'
        connection.query(select_query, [cargo, empresa], (err, result) =>{
            if(err){
                res.json(err)
            }else{
                if (result.length === 0){
                    console.log('aq')
                    let insert_query = 'INSERT INTO EXPERIENCES(USER_ID, CARGO, EMPRESA, INICIO, FIM) VALUES (7, ?, ?, ?, ?)'
                    connection.query(insert_query, [cargo, empresa, inicio, fim], (err, result) => {
                        if(err){
                            res.json(err)
                        }
                    })
                }
            }
        })
    }

    return res.status(200).json({message: 'experience sucessfully added', code: 200});
})


app.post('/UserProfile/Edit/HardSkills', (req, res) => {  
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
    for(i=0; i<req.body.length; i++){
        let info = req.body[i]

        let nome = info.nome;
        let nivel = info.nivel;

        let select_query = 'SELECT * FROM HARDSKILLS WHERE NOME = ?'
        connection.query(select_query, [nome], (err, result) =>{
            if(err){
                res.json(err)
            }else{
                if (result.length === 0){
                    console.log('aq')
                    let insert_query = 'INSERT INTO HARDSKILLS(USER_ID, NOME, NIVEL) VALUES (7, ?, ?)'
                    connection.query(insert_query, [nome, nivel], (err, result) => {
                        if(err){
                            res.json(err)
                        }
                    })
                }
            }
        })
    }

    return res.status(200).json({message: 'skill sucessfully added', code: 200});
})


app.post('/UserProfile/Edit/Graduation', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
 
    for(i=0; i<req.body.length; i++){
        let info = req.body[i]

        let user_id = 15;
        let curso = info.curso;
        let instituicao = info.instituicao;
        let inicio = info.inicio;
        let fim = info.fim;

        let select_query = 'SELECT * FROM GRADUATIONS WHERE CURSO = ? AND INSTITUICAO = ? AND USER_ID = ?'
        connection.query(select_query, [curso, instituicao, user_id], (err, result) =>{
            if(err){
                return res.json(err)
            }else{
                if (result.length === 0){
                    let insert_query = 'INSERT INTO GRADUATIONS(USER_ID, CURSO, INSTITUICAO, INICIO, FIM) VALUES (?, ?, ?, ?, ?)'
                    connection.query(insert_query, [user_id, curso, instituicao, inicio, fim], (err, result) => {
                        if(err){
                            return res.json(err)
                        }
                    })
                }
            }
        })
    }
    return res.status(200).json({message: 'graduation sucessfully added', code: 200});
})




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

app.get('/ViewExperiences/:id', (req, res) => {
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


/*------------COMPANY-------------*/
app.post('/company/SignUp', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
      
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = bcrypt.hashSync(req.body.senha, 3);
    const cnpj = req.body.cnpj;
    const telefone = req.body.telefone;
    const select_query = 'SELECT * FROM COMPANY WHERE EMAIL = ?'
    const insert_query = 'INSERT INTO COMPANY (NOME, EMAIL, SENHA, CNPJ, TELEFONE) VALUES (?, ?, ?, ?, ?)'
    
    connection.query(select_query, [email], (err, result) => {
        if(err){
            res.json(err);
        }
        if(result.length == 0){
            connection.query(insert_query, [nome, email, senha, cnpj, telefone], (err, result) => {
                if(err){
                    res.json(err);
                }
            })
            res.status(200).json({message: 'company registered sucessfully', code: 200});
        }
        if(result.length > 0){
            return res.status(409).json({message: 'email already registered', code: 409});
        }

    });
})

app.get('/company', (req, res) => {
    connection.query("SELECT * FROM COMPANY", (err, result) => {
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