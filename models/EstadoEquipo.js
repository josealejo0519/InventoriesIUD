const { Schema, model, models} = require ('mongoose');

const EstadoEquipoSchema = Schema ({
    nombre: { type: String, required: true},
    estado: { type: String, required: true, enum: ['Activo', 'Inactivo']},
    fechaCreacion: { type: Date, required: true},
    fechaActualizacion: { type: Date, required: true}
});

module.exports = models.EstadoEquipo || model('EstadoEquipo', EstadoEquipoSchema); // Exporta el modelo EstadoEquipo si ya está definido en models