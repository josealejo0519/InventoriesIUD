const { Router } = require('express');
const TipoEquipo = require('../models/TipoEquipo');
const { validationResult, check } = require('express-validator');
const router = Router();
const { validarJWT } = require('../middleware/validarJWT');
const { validarRolAdmin } = require('../middleware/validarRolAdmin');

// GET method route
router.get('/', [validarJWT, validarRolAdmin], async function (req, res) {
    try {
        const tipoEquipos = await TipoEquipo.find(); // Select all from equipment types;
        res.send(tipoEquipos);
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred');
    }
});

// POST method route
router.post('/', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()
            });
        }

        let tipoEquipo = new TipoEquipo();
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaCreacion = new Date();
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save(); // Insert into equipment types() values()
        res.send(tipoEquipo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT method route (UPDATE)
router.put('/:id', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()
            });
        }

        let tipoEquipo = await TipoEquipo.findById(req.params.id);
        if (!tipoEquipo) {
            return res.status(404).send('Equipment type not found');
        }

        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save(); // Update equipment types set ...
        res.send(tipoEquipo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE method route
router.delete('/:id', [validarJWT, validarRolAdmin], async function (req, res) {
    try {
        const tipoEquipo = await TipoEquipo.findById(req.params.id);
        if (!tipoEquipo) {
            return res.status(404).send('Equipment type not found');
        }

        await TipoEquipo.findByIdAndDelete(req.params.id);
        res.send('Equipment type deleted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

