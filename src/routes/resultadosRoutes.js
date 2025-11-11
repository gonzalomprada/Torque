const express = require('express');
const router = express.Router();
const resultadosController = require('../controllers/resultadosController.js');
const { requireAuth } = require('../middleware/authMiddleware.js');
const { requireRole } = require('../middleware/roleMiddleware.js');
const { requireVehiculoOwner } = require('../middleware/ownershipMiddleware.js');

router.get('/turno/:turno_id', requireAuth, requireVehiculoOwner, resultadosController.obtenerPorTurno);
router.put('/turno/:turno_id/observacion', requireAuth, requireRole('inspector','admin'), resultadosController.actualizarObservacion);
router.post('/recalcular/:turno_id', requireAuth, requireRole('inspector','admin'), resultadosController.recalcular);

module.exports = router;
