const mysql = require('mysql');

const connection = mysql.createPool({
    connectionLimit : 100,
    host: 'jober.mysql.database.azure.com',
    user: 'globaluser',
    password: 'xgJ3zFFhn5B6wA',
    database: 'APP'
})
connection.connect((err) => {
    if (err){
        console.log('Connection failed: ', err);
        return;
    }

    console.log(`Conected sucessfully to the database on azure`)
})

module.exports = connection;