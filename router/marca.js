const { Router } = require('express');
const Marca = require('../models/Marca');
const { validationResult, check } = require('express-validator');
const router = Router();
const { validarJWT } = require('../middleware/validarJWT');
const { validarRolAdmin } = require('../middleware/validarRolAdmin');

// GET method route
router.get('/', [validarJWT, validarRolAdmin], async function (req, res) {
    try {
        const marcas = await Marca.find(); // Select all from brands;
        res.send(marcas);
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

        let marca = new Marca();
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();

        marca = await marca.save(); // Insert into brands() values()
        res.send(marca);
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

        let marca = await Marca.findById(req.params.id);
        if (!marca) {
            return res.status(404).send('Brand not found');
        }

        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaActualizacion = new Date();

        marca = await marca.save(); // Update brands set ...
        res.send(marca);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE method route
router.delete('/:id', [validarJWT, validarRolAdmin], async function (req, res) {
    try {
        let marca = await Marca.findById(req.params.id);
        if (!marca) {
            return res.status(404).send('Brand not found');
        }

        await Marca.findByIdAndDelete(req.params.id);
        res.send('Brand deleted');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

