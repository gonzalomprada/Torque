const express = require('express');
const usuariosRoutes = require('./src/routes/usuariosRoutes.js');
const vehiculosRoutes = require('./src/routes/vehiculosRoutes.js');
const estadosTipoRoutes = require('./src/routes/estadosTipoRoutes.js');
const incidenciasRoutes = require('./src/routes/incidenciasRoutes.js');

const app = express();
const cors = require('cors');

app.get('/',(req,res) => {
    res.send('backend');
})

app.use(express.json());
app.use(cors());

const API_PREFIX = process.env.API_PREFIX;
// Prefix global
app.use(`${API_PREFIX}/usuarios`, usuariosRoutes);
app.use(`${API_PREFIX}/vehiculos`, vehiculosRoutes);
app.use(`${API_PREFIX}/estados`, estadosTipoRoutes);
app.use(`${API_PREFIX}/incidencias`, incidenciasRoutes);

module.exports = app;
