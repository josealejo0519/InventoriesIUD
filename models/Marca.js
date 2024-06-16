const { Schema, model, models } = require('mongoose');

const MarcaSchema = Schema({
    nombre: { type: String, required: true },
    estado: { type: String, required: true, enum: ['Activo', 'Inactivo'] },
    fechaCreacion: { type: Date, required: true, default: Date.now },
    fechaActualizacion: { type: Date, required: true, default: Date.now }
});

module.exports = models.Marca || model('Marca', MarcaSchema); // Exporta el modelo Marca si ya está definido en models,

