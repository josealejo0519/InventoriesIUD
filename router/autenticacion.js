const { Router } = require('express');
const Usuario = require('../models/Usuario');
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = Router();
const { generarJWT } = require('../helpers/jwt');
const { validarJWT } = require('../middleware/validarJWT');
const { validarRolAdmin } = require('../middleware/validarRolAdmin');

// GET method route
router.get('/', [validarJWT], async function (req, res) {
    try {
        // Role validation to restrict access
        if (req.usuario.rol === 'Docente') {
            return res.status(403).send('Access denied. Only administrators can access.');
        }

        const usuarios = await Usuario.find();
        res.send(usuarios);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('An error occurred');
    }
});

// POST method route
router.post('/', async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()
            });
        }

        const usuario = await Usuario.findOne({
            email: req.body.email
        });
        if (!usuario) {
            return res.status(400).json({ message: 'User not found' });
        }

        const esIgual = bcrypt.compareSync(req.body.password, usuario.password);
        if (!esIgual) {
            return res.status(400).json({ message: 'User not found' });
        }

        const token = generarJWT(usuario);

        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            rol: usuario.rol,
            email: usuario.email,
            access_token: token
        });

    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT method route (UPDATE)
router.put('/:id', [validarJWT], async function (req, res) {
    try {
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

        // Role validation to restrict access
        if (req.usuario.rol === 'Docente') {
            return res.status(403).send('Access denied. Only administrators can update users.');
        }

        if (req.body.nombre) usuario.nombre = req.body.nombre;
        if (req.body.email) usuario.email = req.body.email;
        if (req.body.password) {
            usuario.password = bcrypt.hashSync(req.body.password, 10);
        }
        if (req.body.rol) usuario.rol = req.body.rol;
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save(); // update usuarios set ...
        res.send(usuario);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE method route
router.delete('/:id', [validarJWT], async function (req, res) {
    try {
        let usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).send('User not found');
        }

        // Role validation to restrict access
        if (req.usuario.rol === 'Docente') {
            return res.status(403).send('Access denied. Only administrators can delete users.');
        }

        await usuario.remove(); // delete from usuarios where id = ...
        res.send('User deleted');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;


