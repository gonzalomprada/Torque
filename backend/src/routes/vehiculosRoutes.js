const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculosController.js');
const { auth, requireRole } = require('../middleware/auth.js');

// /api/v1/vehiculos
router.route('/')
  .get(vehiculosController.listar)
  .post(vehiculosController.crear);

// /api/v1/vehiculos/:id
router.route('/:id')
  .get(vehiculosController.obtener)
  .put(vehiculosController.actualizar)
  .delete(auth, requireRole('ADMIN'), vehiculosController.eliminar);

module.exports = router;
