const { Router } = require('express');
const Inventario = require('../models/Inventario');
const { validationResult, check } = require('express-validator');
const router = Router();
const { validarJWT } = require('../middleware/validarJWT');
const { validarRolAdmin } = require('../middleware/validarRolAdmin');

// GET method route
router.get('/', [validarJWT], async function (req, res) {
    try {
        const inventarios = await Inventario.find().populate([
            { path: 'usuario', select: 'nombre email estado' },
            { path: 'marca', select: 'nombre estado' },
            { path: 'estadoEquipo', select: 'nombre estado' },
            { path: 'tipoEquipo', select: 'nombre estado' }
        ]);
        res.send(inventarios);
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred');
    }
});

// POST method route
router.post('/', [validarJWT, validarRolAdmin], [
    check('serial', 'invalid.serial').not().isEmpty(),
    check('modelo', 'invalid.modelo').not().isEmpty(),
    check('descripcion', 'invalid.descripcion').not().isEmpty(),
    check('fotoEquipo', 'invalid.fotoEquipo').not().isEmpty(),
    check('color', 'invalid.color').not().isEmpty(),
    check('fechaCompra', 'invalid.fechaCompra').not().isEmpty(),
    check('precio', 'invalid.precio').not().isEmpty(),
    check('usuario', 'invalid.usuario').not().isEmpty(),
    check('marca', 'invalid.marca').not().isEmpty(),
    check('estadoEquipo', 'invalid.estadoEquipo').not().isEmpty(),
    check('tipoEquipo', 'invalid.tipoEquipo').not().isEmpty(),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const existeinventario = await Inventario.findOne({ serial: req.body.serial });
        if (existeinventario) {
            return res.status(400).send('Serial already exists for another equipment');
        }

        let inventario = new Inventario();
        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.fotoEquipo = req.body.fotoEquipo;
        inventario.color = req.body.color;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario;
        inventario.marca = req.body.marca;
        inventario.estadoEquipo = req.body.estadoEquipo;
        inventario.tipoEquipo = req.body.tipoEquipo;
        inventario.fechaCreacion = new Date();
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save(); // insert into inventarios() values()
        res.send(inventario);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT method route (UPDATE)
router.put('/:id', [validarJWT, validarRolAdmin], [
    check('serial', 'invalid.serial').not().isEmpty(),
    check('modelo', 'invalid.modelo').not().isEmpty(),
    check('descripcion', 'invalid.descripcion').not().isEmpty(),
    check('fotoEquipo', 'invalid.fotoEquipo').not().isEmpty(),
    check('color', 'invalid.color').not().isEmpty(),
    check('fechaCompra', 'invalid.fechaCompra').not().isEmpty(),
    check('precio', 'invalid.precio').not().isEmpty(),
    check('usuario', 'invalid.usuario').not().isEmpty(),
    check('marca', 'invalid.marca').not().isEmpty(),
    check('estadoEquipo', 'invalid.estadoEquipo').not().isEmpty(),
    check('tipoEquipo', 'invalid.tipoEquipo').not().isEmpty(),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        let inventario = await Inventario.findById(req.params.id);
        if (!inventario) {
            return res.status(404).send('Inventory not found');
        }

        const existeinventario = await Inventario.findOne({ serial: req.body.serial, _id: { $ne: inventario._id } });
        if (existeinventario) {
            return res.status(400).send('Serial already exists for another equipment');
        }

        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.fotoEquipo = req.body.fotoEquipo;
        inventario.color = req.body.color;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario;
        inventario.marca = req.body.marca;
        inventario.estadoEquipo = req.body.estadoEquipo;
        inventario.tipoEquipo = req.body.tipoEquipo;
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save(); // update inventarios set ...
        res.send(inventario);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE method route
router.delete('/:id', [validarJWT, validarRolAdmin], async function (req, res) {
    try {
        const inventarioId = req.params.id;
        console.log(`Attempting to delete inventory with ID: ${inventarioId}`);

        const inventario = await Inventario.findById(inventarioId);
        if (!inventario) {
            console.log('Inventory not found');
            return res.status(404).send('Inventory not found');
        }

        await Inventario.findByIdAndDelete(inventarioId);
        console.log('Inventory deleted successfully');
        res.send('Inventory deleted');
    } catch (error) {
        console.error('Error deleting inventory:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
