const express = require('express');
const router = express.Router();
const chequeosController = require('../controllers/chequeosController.js');
const { requireAuth } = require('../middleware/authMiddleware.js');
const { requireRole } = require('../middleware/roleMiddleware.js');

// crear/actualizar (upsert lógico)
router.post('/', requireAuth, requireRole('inspector','admin'), chequeosController.crearOActualizar);

// listar por turno
router.get('/:turno_id', requireAuth, chequeosController.listarPorTurno);

// eliminar un item de un turno
router.delete('/turno/:turno_id/punto/:punto', requireAuth, requireRole('inspector','admin'), chequeosController.eliminarItem);

module.exports = router;
