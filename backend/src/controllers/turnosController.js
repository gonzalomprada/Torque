// src/controllers/turnosController.js
const { Turno, Vehiculo } = require('../models');

class TurnosController {
  // GET /api/v1/turnos/disponibles?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
  async disponibles(req, res) {
    const { desde, hasta } = req.query;
    const where = { estado: 'LIBRE' };

    // Filtro opcional por rango de fecha/hora
    if (desde || hasta) {
      where.start_at = {};
      if (desde) where.start_at.$gte = new Date(desde);
      if (hasta) where.start_at.$lte = new Date(hasta);
    }

    const items = await Turno.findAll({
      where,
      order: [['start_at', 'ASC']]
    });
    res.json(items);
  }

  // POST /api/v1/turnos/solicitar
  async solicitar(req, res) {
    const { matricula, turno_id } = req.body || {};
    if (!matricula || !turno_id) return res.status(400).json({ msg: 'matricula y turno_id son obligatorios' });

    const turno = await Turno.findByPk(turno_id);
    if (!turno || turno.estado !== 'LIBRE') return res.status(409).json({ msg: 'Turno no disponible' });

    const vehiculo = await Vehiculo.findOne({ where: { matricula } });
    if (!vehiculo) return res.status(404).json({ msg: 'Vehículo no encontrado para la matrícula' });

    await turno.update({ estado: 'RESERVADO', vehiculo_id: vehiculo.id });
    res.json({ msg: 'Turno reservado', turno_id: turno.id });
  }

  // POST /api/v1/turnos/:id/confirmar
  async confirmar(req, res) {
    const { id } = req.params;
    const turno = await Turno.findByPk(id);
    if (!turno || (turno.estado !== 'RESERVADO' && turno.estado !== 'LIBRE')) {
      return res.status(409).json({ msg: 'Turno no reservable/confirmable' });
    }
    await turno.update({ estado: 'CONFIRMADO' });
    res.json({ msg: 'Turno confirmado' });
  }
}

module.exports = new TurnosController();


