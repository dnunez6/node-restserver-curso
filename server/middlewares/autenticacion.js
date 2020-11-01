const jwt = require('jsonwebtoken');
//**********************************************/
// Verificar token
//**********************************************/
let verificaToken = (req, res, next) => {
    let token = req.get('token'); //autorization

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no valido"
                }
            });
        }
        req.usuario = decoded.usuario;
        next();

    });

    // res.json({
    //     token: token
    // });

};

//**********************************************/
// Verificar token imagen
//**********************************************/
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no valido"
                }
            });
        }
        req.usuario = decoded.usuario;
        next();

    });

}

//**************************************************/
// Valida rol administrador
/***************************************************/
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    //console.log(req.usuario.role != 'ADMIN_ROLE');
    if (req.usuario.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: "Rol no valido"
            }
        });
    }
    next();

};


module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
};