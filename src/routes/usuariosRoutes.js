const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController.js');
const { requireAuth } = require('../middleware/authMiddleware.js');

// publicos
router.post('/registrar', usuariosController.registrar);
router.post('/login', usuariosController.login);

module.exports = router;
