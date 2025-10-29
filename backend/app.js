const express = require('express');
const usuariosRoutes = require('./src/routes/usuariosRoutes.js');
const vehiculosRoutes = require('./src/routes/vehiculosRoutes.js');

const cors = require('cors');

app.get('/',(req,res) => {
    res.send('backend');
})

app.use(express.json());
app.use(cors());

// Prefix global
app.use(`${API_PREFIX}/usuarios`, usuariosRoutes);
app.use(`${API_PREFIX}/vehiculos`, vehiculosRoutes);

module.exports = app;
