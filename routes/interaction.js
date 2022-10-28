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

    connection.query("SELECT * FROM MATCHED WHERE VACANCY_ID = ? AND USER_ID = ?", [vacancy_id, user_id], (err, result) => {
        if(err){
            res.json(err);
        }else if(result.length !== 0){
            connection.query("UPDATE MATCHED SET USER_LIKED = ? WHERE VACANCY_ID = ? AND USER_ID = ?", [vacancy_id, user_id, 1], (err, match_result) => {
                if(err){
                    res.json(err);
                }else{
                    return res.json({status: 200, message: 'vacancy liked'})
                }
            })
        }else{
            connection.query("INSERT INTO MATCHED (USER_ID, VACANCY_ID, USER_LIKED) VALUES (?, ?, ?)", [user_id, vacancy_id, 1], (err, match_result) => {
                if(err){
                    res.json(err);
                }else{
                    return res.json({status: 200, message: 'vacancy liked'})
                }
            })
        }
    })
})

router.post('/recruiterLike', (req, res) => {
    setHeadersResponse(res);

    const vacancy_id = req.body.vacancy_id;
    const user_id = req.body.user_id;

    connection.query("SELECT * FROM MATCHED WHERE VACANCY_ID = ? AND USER_ID = ?", [vacancy_id, user_id], (err, result) => {
        if(err){
            res.json(err);
        }else if(result.length !== 0){
            connection.query("UPDATE MATCHED SET RECRUITER_LIKED = ? WHERE VACANCY_ID = ? AND USER_ID = ?", [1, vacancy_id, user_id], (err, match_result) => {
                if(err){
                    res.json(err);
                }else{
                    return res.json({status: 200, message: 'user liked'})
                }
            })
        }else{
            connection.query("INSERT INTO MATCHED (USER_ID, RECRUITER_LIKED, VACANCY_ID) VALUES (?, ?, ?)", [user_id, 1, vacancy_id], (err, match_result) => {
                if(err){
                    res.json(err);
                }else{
                    return res.json({status: 200, message: 'user liked'})
                }
            })
        }
    })
})


router.get('/getRecruiterLike', (req, res) => {
    setHeadersResponse(res);

    const vacancy_id = req.body.vacancy_id;
    const user_id = req.body.user_id;

    connection.query("SELECT RECRUITER_LIKED FROM MATCHED WHERE USER_ID = ? AND VACANCY_ID = ?", [user_id, vacancy_id], (err, result) => {
        if(err){
            res.json(err)
        }else if(result.length > 0 && result[0].RECRUITER_LIKED === 1){
            res.json({like: true})
        }else{
            res.json({like: false})
        }
    })
})

router.post('/save', (req, res) => {
    setHeadersResponse(res);

    const vacancy_id = req.body.vacancy_id;
    const user_id = req.body.user_id;

    const save_query = 'INSERT INTO saved_vacancies (USER_ID, VACANCY_ID) VALUES (?, ?)';
    const select_query = 'SELECT * FROM saved_vacancies WHERE USER_ID = ? AND VACANCY_ID = ?'

    connection.query(select_query, [user_id, vacancy_id], (err, result) => {
        if(err){
            res.json(err)
        }else if(result.length === 0){
            connection.query(save_query, [user_id, vacancy_id], (err, result) => {
                if(err){
                    res.json(err)
                }else{
                    res.json({code: 200, message: 'vacancy was successfully saved'})
                }
            })
        }else{
            res.json({code: 200, message: 'vacancy already saved'})
        }       
    })

})


router.post('/pass', (req, res) => {
    setHeadersResponse(res);

    const vacancy_id = req.body.vacancy_id;
    const user_id = req.body.user_id;

    const save_query = 'INSERT INTO passed_vacancies (USER_ID, VACANCY_ID) VALUES (?, ?)';
    const select_query = 'SELECT * FROM passed_vacancies WHERE USER_ID = ? AND VACANCY_ID = ?'

    connection.query(select_query, [user_id, vacancy_id], (err, result) => {
        if(err){
            res.json(err)
        }else if(result.length === 0){
            connection.query(save_query, [user_id, vacancy_id], (err, result) => {
                if(err){
                    res.json(err)
                }else{
                    res.json({code: 200, message: 'vacancy was successfully passed'})
                }
            })
        }else{
            res.json({code: 200, message: 'vacancy already passed'})
        }       
    })

})

module.exports = router;