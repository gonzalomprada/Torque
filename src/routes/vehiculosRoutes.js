const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculosController.js');
const { requireVehiculoOwner } = require ('../middleware/ownershipMiddleware.js');
const { requireAuth } = require('../middleware/authMiddleware.js');

// ALL
router.route('/')
  .get(vehiculosController.consultar)
  .post(vehiculosController.ingresar);

// Por ID
router.route('/:id')
  .get(requireAuth, requireVehiculoOwner, vehiculosController.consultarId)
  .put(requireAuth, requireVehiculoOwner, vehiculosController.actualizarId)
  .delete(requireAuth, requireVehiculoOwner, vehiculosController.eliminarId);

module.exports = router;
