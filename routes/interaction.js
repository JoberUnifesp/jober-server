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

router.post('/userLike', (req, res) => {
    setHeadersResponse(res);

    const user_id = req.body.user_id;
    const vacancy_id = req.body.vacancy_id;

    connection.query("SELECT * FROM MATCHED WHERE VACANCY_ID = ?", [vacancy_id], (err, result) => {
        if(err){
            res.json(err);
        }else if(result.length !== 0){
            connection.query("UPDATE MATCHED SET USER_ID = ? WHERE VACANCY_ID = ?", [user_id, vacancy_id], (err, match_result) => {
                if(err){
                    res.json(err);
                }else{
                    return res.json({status: 200, message: 'vacancy liked'})
                }
            })
        }else{
            connection.query("INSERT INTO MATCHED (USER_ID, VACANCY_ID) VALUES (?, ?)", [user_id, vacancy_id], (err, match_result) => {
                if(err){
                    res.json(err);
                }else{
                    return res.json({status: 200, message: 'vacancy liked'})
                }
            })
        }
    })
})


module.exports = router;