require('dotenv').config();
const express = require('express');
const cors = require('cors');
const scopeDi = require('./src/middleware/scopeDi.js');

const vehiculosRoutes = require('./src/routes/vehiculosRoutes.js');
const turnosRoutes = require('./src/routes/turnosRoutes.js');
const chequeosRoutes = require('./src/routes/chequeosRoutes.js');
const resultadosRoutes = require('./src/routes/resultadosRoutes.js');
const usuariosRoutes = require('./src/routes/usuariosRoutes.js');

const app = express();

app.use(express.json());
app.use(cors());
app.use(scopeDi);

const API_PREFIX = process.env.API_PREFIX;

app.get('/', (req, res) => {
  res.send('Torque API');
});

app.use(`${API_PREFIX}/vehiculos`, vehiculosRoutes);
app.use(`${API_PREFIX}/turnos`, turnosRoutes);
app.use(`${API_PREFIX}/chequeos`, chequeosRoutes);
app.use(`${API_PREFIX}/resultados`, resultadosRoutes);
app.use(`${API_PREFIX}/usuarios`, usuariosRoutes);

module.exports = app;
