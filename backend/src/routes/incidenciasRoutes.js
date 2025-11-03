const express = require('express');
const router = express.Router();
const incidenciasController = require('../controllers/incidenciasController.js');

// /api/v1/incidencias
router.route('/')
  .get(incidenciasController.listar)
  .post(incidenciasController.crear);

// /api/v1/incidencias/:id
router.route('/:id')
  .get(incidenciasController.obtener)
  .put(incidenciasController.actualizar)
  .delete(incidenciasController.eliminar);

module.exports = router;
