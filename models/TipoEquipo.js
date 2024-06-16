const { Schema, model, models} = require ('mongoose');

const TipoEquipoSchema = Schema ({
    nombre: { type: String, required: true},
    estado: { type: String, required: true, enum: ['Activo', 'Inactivo']},
    fechaCreacion: { type: Date, required: true},
    fechaActualizacion: { type: Date, required: true}
});

module.exports = models.TipoEquipo || model('TipoEquipo', TipoEquipoSchema); // Exporta el modelo TipoEquipo si ya está definido en models,
