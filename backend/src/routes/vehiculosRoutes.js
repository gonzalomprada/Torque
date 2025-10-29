const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculosController.js');

// /api/v1/vehiculos
router.route('/')
  .get(vehiculosController.listar)
  .post(vehiculosController.crear);

// /api/v1/vehiculos/:id
router.route('/:id')
  .get(vehiculosController.obtener)
  .put(vehiculosController.actualizar)
  .delete(vehiculosController.eliminar);

module.exports = router;
