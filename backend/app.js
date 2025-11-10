const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes.js');
const usuariosRoutes = require('./src/routes/usuariosRoutes.js');
const vehiculosRoutes = require('./src/routes/vehiculosRoutes.js');
const turnosRoutes = require('./src/routes/turnosRoutes.js');
const inspeccionesRoutes = require('./src/routes/inspeccionesRoutes.js');

// const chequeoTiposRoutes = require('./src/routes/chequeoTiposRoutes.js');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (_req, res) => res.send('Torque API — OK'));

const API_PREFIX = process.env.API_PREFIX || '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/usuarios`, usuariosRoutes);
app.use(`${API_PREFIX}/vehiculos`, vehiculosRoutes);
app.use(`${API_PREFIX}/turnos`, turnosRoutes);
app.use(`${API_PREFIX}/inspecciones`, inspeccionesRoutes);
// app.use(`${API_PREFIX}/puntos`, chequeoTiposRoutes); // opcional si lo agregás

module.exports = app;
