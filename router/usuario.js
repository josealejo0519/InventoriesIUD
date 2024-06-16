const { Router } = require('express');
const Usuario = require('../models/Usuario');
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = Router();
const { validarJWT }  = require('../middleware/validarJWT');
const { validarRolAdmin } = require('../middleware/validarRolAdmin');

// CRUD -> CREATE - READ - UPDATE - DELETE

// GET method route
router.get('/', [ validarJWT, validarRolAdmin ] ,  async function (req, res) {
    try {
        const usuarios = await Usuario.find();
        res.send(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred');
    }
});

// POST method route
router.post('/', [ validarJWT, validarRolAdmin ] ,[
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
    check('password', 'invalid.password').not().isEmpty(),
    check('rol', 'invalid.rol').isIn(['Administrador', 'Docente']),
], async function (req, res) {
    try {
        // Additional validation for "Docente2
        if (req.body.rol === 'Docente') {
            return res.status(403).send('Access denied for "Docente"');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()
            });
        }
        const existeUsuario = await Usuario.findOne({
            email: req.body.email
        });
        if (existeUsuario) {
            return res.status(400).send('Email already exists');
        }
        let usuario = new Usuario();
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;

        const salt = bcrypt.genSaltSync();
        const password = bcrypt.hashSync(req.body.password, salt);
        usuario.password = password;

        usuario.rol = req.body.rol;
        usuario.fechaCreacion = new Date();
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();
        res.send(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT method route - Update
router.put('/:id', [ validarJWT, validarRolAdmin ] , [
    check('name', 'invalid.name').optional().not().isEmpty(),
    check('email', 'invalid.email').optional().isEmail(),
    check('status', 'invalid.status').optional().isIn(['Active', 'Inactive']),
    check('password', 'invalid.password').optional().not().isEmpty(),
    check('role', 'invalid.role').optional().isIn(['Administrator', 'Teacher']),
], async function (req, res) {
    try {
        // Additional validation for Docente
        if (req.body.role === 'Docente') {
            return res.status(403).send('Access denied for "Docente"');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()
            });
        }
        let usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).send('User not found');
        }
        if (req.body.name) usuario.name = req.body.name;
        if (req.body.email) usuario.email = req.body.email;
        if (req.body.status) usuario.status = req.body.status;
        if (req.body.password) {
            const salt = bcrypt.genSaltSync();
            usuario.password = bcrypt.hashSync(req.body.password, salt);
        }
        if (req.body.role) usuario.role = req.body.role;
        usuario.updateDate = new Date();

        usuario = await usuario.save();
        res.send(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE method route - Delete
router.delete('/:id', [ validarJWT, validarRolAdmin ] , async function (req, res) {
    try {
        // Additional validation for Docente
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).send('User not found');
        }

        if (usuario.rol === 'Docente') {
            return res.status(403).send('Access denied for "Docente"');
        }

        await Usuario.deleteOne({ _id: req.params.id });
        res.send('User deleted');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
