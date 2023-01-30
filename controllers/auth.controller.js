const AuthService = require('../services/auth.service');

function setPermissionsHeader(res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
}

exports.findAll = async (req, res) => {
    setPermissionsHeader(res);

    const response = await AuthService.findAll()
    return res.json(response);
}

exports.login = async (req, res) => {
    setPermissionsHeader(res);
    
    const response = await AuthService.login(req.body.email, req.body.senha)
    return res.json(response);
}