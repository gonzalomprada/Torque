const express = require('express');
const router = express.Router();
const turnosController = require('../controllers/turnosController.js');
const { requireAuth } = require('../middleware/authMiddleware.js');
const { requireVehiculoOwner } = require('../middleware/ownershipMiddleware.js');

// Rutas específicas primero
router.get('/disponibilidad', turnosController.disponibilidad);
router.post('/solicitar', requireAuth, requireVehiculoOwner, turnosController.solicitar);
router.post('/:id/confirmar', requireAuth, requireVehiculoOwner ,turnosController.confirmar);

// CRUD básico
router.route('/')
  .get(requireAuth, turnosController.consultar);

router.route('/:id')
  .get(requireAuth, requireVehiculoOwner, turnosController.consultarId)
  .put(requireAuth, turnosController.actualizarId)
  .delete(requireAuth, turnosController.eliminarId);

module.exports = router;

