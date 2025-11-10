const express = require('express');
const router = express.Router();
const inspeccionesController = require('../controllers/inspeccionesController');

// Inicio de inspección y carga de resultados
router.post('/iniciar', inspeccionesController.iniciar);
router.post('/:id/cargar', inspeccionesController.cargar);

module.exports = router;
