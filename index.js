const express = require('express');
const { getConnection } = require('./db/db-connection-mongo');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Establecer conexión a la base de datos
getConnection();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/usuario', require('./router/usuario'));
app.use('/marca', require('./router/marca'));
app.use('/estadoEquipo', require('./router/estadoEquipo'));
app.use('/tipoEquipo', require('./router/tipoEquipo'));
app.use('/inventario', require('./router/inventario'));
app.use('/autenticacion', require('./router/autenticacion'))

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

