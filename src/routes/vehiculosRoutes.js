const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculosController.js');
const { requireVehiculoOwner } = require ('../middleware/ownershipMiddleware.js');

// ALL
router.route('/')
  .get(requireVehiculoOwner, vehiculosController.consultar)
  .post(vehiculosController.ingresar);

// Por ID
router.route('/:id')
  .get(requireVehiculoOwner, vehiculosController.consultarId)
  .put(requireVehiculoOwner, vehiculosController.actualizarId)
  .delete(requireVehiculoOwner, vehiculosController.eliminarId);

module.exports = router;
