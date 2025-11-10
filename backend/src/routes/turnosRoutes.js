const express = require('express');
const router = express.Router();
const turnosController = require('../controllers/turnosController.js');
const { auth } = require('../middleware/auth.js');

router.get('/disponibles', auth, turnosController.disponibles);
router.post('/solicitar', turnosController.solicitar);
router.post('/:id/confirmar', auth, turnosController.confirmar);

module.exports = router;
