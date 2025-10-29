const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController.js');

// /api/v1/usuarios
router.route('/')
  .get(usuariosController.listar)
  .post(usuariosController.crear);

// /api/v1/usuarios/:id
router.route('/:id')
  .get(usuariosController.obtener)
  .put(usuariosController.actualizar)
  .delete(usuariosController.eliminar);

module.exports = router;

