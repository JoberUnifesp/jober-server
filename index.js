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

app.post('/UserProfile/Edit/Experience/:id', (req, res) => {  
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


app.post('/UserProfile/Edit/HardSkills/:id', (req, res) => {  
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


app.post('/UserProfile/Edit/Graduation/:id', (req, res) => {
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


app.post('/UserProfile/Edit/Languages/:id', (req, res) => {  
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


app.post('/UserProfile/Edit/SoftSkills/:id', (req, res) => {  
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    

    for(i=0; i<req.body.length; i++){
        let skill = req.body[i].skill
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
    }

    return res.status(200).json({message: 'softskill sucessfully added', code: 200});
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

app.get('/ViewGraduations/:id', (req, res) => {
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


app.get('/ViewHardSkills/:id', (req, res) => {
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

app.get('/ViewLanguages/:id', (req, res) => {
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



app.get('/github/:id', (req, res) => {
    const select_query = "SELECT GITHUB FROM USER WHERE ID = ?";
    connection.query(select_query, [req.params.id], (err, result) => {
        if(err){
            res.json(err);
        }else{
            res.json(result[0].GITHUB)
        }
    })
})

app.get('/NomeSobrenome/:id', (req, res) => {
    const select_query = "SELECT NOME, SOBRENOME FROM USER WHERE ID = ?";
    connection.query(select_query, [req.params.id], (err, result) => {
        if(err){
            res.json(err);
        }else{
            res.json(result[0].NOME + ' ' + result[0].SOBRENOME)
        }
    })
})

app.get('/email/:id', (req, res) => {
    const select_query = "SELECT EMAIL FROM USER WHERE ID = ?";
    connection.query(select_query, [req.params.id], (err, result) => {
        if(err){
            res.json(err);
        }else{
            res.json(result[0].EMAIL)
        }
    })
})

app.put('/UserProfile/Edit/Github/:id', (req, res) => {  
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

app.delete('/UserProfile/Delete/Experience/:id', (req, res) => {
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





module.exports = app;