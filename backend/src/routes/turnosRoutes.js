const express = require('express');
const router = express.Router();
const turnosController = require('../controllers/turnosController');

// Disponibilidad pública (según requerimientos)
router.get('/disponibles', turnosController.disponibles);

// Flujo de solicitud y confirmación
router.post('/solicitar', turnosController.solicitar);
router.post('/:id/confirmar', turnosController.confirmar);

module.exports = router;
