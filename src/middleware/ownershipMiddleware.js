// src/middleware/requireVehiculoOwner.js
const Vehiculo = require('../models/vehiculosModels.js');
const Turno = require('../models/turnosModels.js');

async function requireVehiculoOwner(req, res, next) {
  try {
    const usuario = req.user;

    // Acceso total
    if (usuario.rol === 'admin' || usuario.rol === 'inspector') {
      return next();
    }

    if (usuario.rol !== 'duenio') {
      return res.status(403).json({ err: 'rol no autorizado' });
    }

    // --- Resolver el vehículo involucrado ---
    let vehiculoId = null;

    // alias comunes en rutas: :vehiculo_id | :id
    if (req.params.vehiculo_id) vehiculoId = parseInt(req.params.vehiculo_id, 10);
    if (!vehiculoId && req.params.id) vehiculoId = parseInt(req.params.id, 10);

    // si vino turno_id, lo traducimos a vehiculoId
    if (!vehiculoId && req.params.turno_id) {
      const turno = await Turno.findByPk(req.params.turno_id);
      if (!turno) return res.status(404).json({ err: 'turno no encontrado' });
      vehiculoId = turno.vehiculoId || turno.vehiculo_id; // por si tu tabla está con snake_case
    }

    // si vino matricula en body (p.ej. solicitar turno por matrícula)
    if (!vehiculoId && req.body.matricula) {
      const v = await Vehiculo.findOne({ where: { matricula: req.body.matricula } });
      if (!v) return res.status(404).json({ err: 'vehículo no encontrado' });
      vehiculoId = v.id;

      // chequeo directo y corto camino
      if (v.duenioId !== usuario.id) {
        return res.status(403).json({ err: 'no autorizado: no es dueño del vehículo' });
      }
      return next();
    }

    if (!vehiculoId) {
      return res.status(400).json({ err: 'no se pudo determinar el vehículo a validar' });
    }

    const vehiculo = await Vehiculo.findByPk(vehiculoId);
    if (!vehiculo) return res.status(404).json({ err: 'vehículo no encontrado' });

    // 👇 ¡OJO ACÁ! Usar la propiedad JS (duenioId), no el nombre de columna
    if (vehiculo.duenioId !== usuario.id) {
      return res.status(403).json({ err: 'no autorizado: no es dueño del vehículo' });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
}

module.exports = { requireVehiculoOwner };

