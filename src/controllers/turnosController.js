const { Op } = require('sequelize');
const Turno = require('../models/turnosModels.js');
const Vehiculo = require('../models/vehiculosModels.js');

class TurnosController {
  constructor() {}

  // GET / - listar turnos
  async consultar(req, res) {
    try {
      const turnos = await Turno.findAll();
      res.status(200).json(turnos);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }

  // GET /:id - traer por id
  async consultarId(req, res) {
    try {
      const { id } = req.params;
      const turno = await Turno.findByPk(id);
      if (!turno) return res.status(404).json({ err: 'turno no encontrado' });
      res.status(200).json(turno);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }

  // PUT /:id - actualizar (fecha/estado)
  async actualizarId(req, res) {
    try {
      const { id } = req.params;
      const { fecha, estado } = req.body; // fecha 'YYYY-MM-DD'
      const [n] = await Turno.update(
        { ...(fecha && { fecha }), ...(estado && { estado }) },
        { where: { id } }
      );
      if (!n) return res.status(404).json({ err: 'turno no encontrado' });
      const actualizado = await Turno.findByPk(id);
      res.status(200).json(actualizado);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }

  // DELETE /:id
  async eliminarId(req, res) {
    try {
      const { id } = req.params;
      const n = await Turno.destroy({ where: { id } });
      if (!n) return res.status(404).json({ err: 'turno no encontrado' });
      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }

  // GET /disponibilidad?fecha=YYYY-MM-DD
  async disponibilidad(req, res) {
    try {
      const { fecha } = req.query; // YYYY-MM-DD
      if (!fecha) return res.status(400).json({ err: 'fecha requerida (YYYY-MM-DD)' });

      const cupoDiario = 10; // simple para TP
      const reservados = await Turno.count({ where: { fecha } });
      const disponibles = Math.max(0, cupoDiario - reservados);

      res.status(200).json({
        fecha,
        cupoDiario,
        reservados,
        disponibles,
        disponible: disponibles > 0
      });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }

  // POST /solicitar  { matricula, fecha: 'YYYY-MM-DD' }
  async solicitar(req, res) {
    try {
      const { matricula, fecha } = req.body;

      if (!matricula || !fecha) {
        return res.status(400).json({ err: 'matricula y fecha son requeridos' });
      }

      const vehiculo = await Vehiculo.findOne({ where: { matricula } });
      if (!vehiculo) return res.status(404).json({ err: 'vehiculo no encontrado' });

      // Evitar duplicados exactos (mismo vehículo mismo día)
      const yaExiste = await Turno.findOne({
        where: { vehiculoId: vehiculo.id, fecha }
      });
      if (yaExiste) {
        return res.status(409).json({ err: 'ya existe un turno para ese vehículo en esa fecha' });
      }

      // Cupo simple por día
      const cupoDiario = 10;
      const reservados = await Turno.count({ where: { fecha } });
      if (reservados >= cupoDiario) {
        return res.status(409).json({ err: 'no hay disponibilidad para esa fecha' });
      }

      const nuevo = await Turno.create({
        vehiculoId: vehiculo.id,
        fecha, // YYYY-MM-DD
        estado: 'pendiente'
      });

      res.status(201).json(nuevo);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }

  // POST /:id/confirmar
  async confirmar(req, res) {
    try {
      const { id } = req.params;
      const turno = await Turno.findByPk(id);
      if (!turno) return res.status(404).json({ err: 'turno no encontrado' });

      if (turno.estado !== 'pendiente') {
        return res.status(409).json({ err: `no se puede confirmar desde estado ${turno.estado}` });
      }

      turno.estado = 'confirmado';
      await turno.save();
      res.status(200).json(turno);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }
}

module.exports = new TurnosController();

