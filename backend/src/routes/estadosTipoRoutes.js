const express = require('express');
const router = express.Router();
const estadosTipoController = require('../controllers/estadosTipoController.js');

// /api/v1/estados
router.route('/')
  .get(estadosTipoController.listar)
  .post(estadosTipoController.crear);

// /api/v1/estados/:id
router.route('/:id')
  .get(estadosTipoController.obtener)
  .put(estadosTipoController.actualizar)
  .delete(estadosTipoController.eliminar);

module.exports = router;
