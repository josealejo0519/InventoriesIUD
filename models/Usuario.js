const { Schema, model, models } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    estado: { type: String, required: true, enum: ['Activo', 'Inactivo'] },
    password: { type: String, required: true },
    rol: { type: String, required: true, enum: ['Administrador', 'Docente'] },
    fechaCreacion: { type: Date, required: true, default: Date.now },
    fechaActualizacion: { type: Date, required: true, default: Date.now }
});

module.exports = models.Usuario || model('Usuario', UsuarioSchema); // Exporta el modelo Usuario si ya está definido en models,
