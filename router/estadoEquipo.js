const { Router } = require('express');
const EstadoEquipo = require('../models/EstadoEquipo');
const { validationResult, check } = require('express-validator');
const router = Router();
const { validarJWT } = require('../middleware/validarJWT');
const { validarRolAdmin } = require('../middleware/validarRolAdmin');

// GET method route
router.get('/', [validarJWT, validarRolAdmin], async function (req, res) {
    try {
        // Role validation to restrict access
        const estadoEquipos = await EstadoEquipo.find(); // select * from estadoEquipos;
        res.send(estadoEquipos);
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred');
    }
});

// POST method route
router.post('/', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.name').not().isEmpty(),
    check('estado', 'invalid.status').isIn(['Activo', 'Inactivo']),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()
            });
        }

        let estadoEquipo = new EstadoEquipo();
        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaCreacion = new Date();
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save(); // insert into estadoEquipos() values()
        res.send(estadoEquipo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT method route (UPDATE)
router.put('/:id', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.name').not().isEmpty(),
    check('estado', 'invalid.status').isIn(['Activo', 'Inactivo']),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()
            });
        }

        let estadoEquipo = await EstadoEquipo.findById(req.params.id);
        if (!estadoEquipo) {
            return res.status(404).send('Equipment state not found');
        }

        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save(); // update estadoEquipos set ...
        res.send(estadoEquipo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE method route
router.delete('/:id', [validarJWT, validarRolAdmin], async function (req, res) {
    try {
        let estadoEquipo = await EstadoEquipo.findById(req.params.id);
        if (!estadoEquipo) {
            return res.status(404).send('Equipment state not found');
        }

        await estadoEquipo.remove(); // delete from estadoEquipos where id = ...
        res.send('Equipment state deleted');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
