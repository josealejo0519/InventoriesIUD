const jwt = require('jsonwebtoken');

const validarRolAdmin = (req, res, next) => {
    if (req.payload.rol !== 'Administrador') {
        return res.status(401).json({ mensaje: 'Access denied for User: Docente' });
    }
    next();
}

module.exports = {
    validarRolAdmin
}
