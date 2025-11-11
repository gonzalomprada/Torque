const Chequeo = require('../models/chequeosModels.js');
const Resultado = require('../models/resultadosModels.js');
const Turno = require('../models/turnosModels.js');

class ChequeosController {
  constructor(){}

  // POST /chequeos
  async crearOActualizar(req, res) {
    try {
      const { turno_id } = req.body;

      if (!turno_id) {
        return res.status(400).json({ err: 'turno_id es obligatorio' });
      }

      const itemsBody = Array.isArray(req.body.items)
        ? req.body.items
        : (req.body.punto && req.body.puntaje
            ? [{ punto: req.body.punto, puntaje: req.body.puntaje }]
            : []);

      if (itemsBody.length === 0) {
        return res.status(400).json({ err: 'Enviá {turno_id, punto, puntaje} o {turno_id, items:[...]}' });
      }

      // Validaciones basicas
      for (const it of itemsBody) {
        if (typeof it.punto !== 'number' || typeof it.puntaje !== 'number') {
          return res.status(400).json({ err: 'punto y puntaje deben ser numéricos' });
        }
        if (it.punto < 1 || it.punto > 8) {
          return res.status(400).json({ err: `punto ${it.punto} fuera de rango (1..8)` });
        }
        if (it.puntaje < 1 || it.puntaje > 10) {
          return res.status(400).json({ err: `puntaje ${it.puntaje} fuera de rango (1..10)` });
        }
      }

      // Upsert por (turno_id, punto)
      for (const it of itemsBody) {
        const existente = await Chequeo.findOne({ where: { turno_id, punto: it.punto } });
        if (existente) {
          await existente.update({ puntaje: it.puntaje });
        } else {
          await Chequeo.create({ turno_id, punto: it.punto, puntaje: it.puntaje });
        }
      }

      // Releo todos los items del turno
      const items = await Chequeo.findAll({ where: { turno_id } });

      // Si hay 8, calculo resultado y cierro turno
      if (items.length === 8) {
        const total = items.reduce((acc, it) => acc + (it.puntaje || 0), 0);
        const hayMenorA5 = items.some(it => it.puntaje < 5);
        const estado = (total >= 80 && !hayMenorA5) ? 'seguro' : 'rechequear';

        const existenteResultado = await Resultado.findOne({ where: { turno_id } });
        if (existenteResultado) {
          await existenteResultado.update({ total, estado });
        } else {
          await Resultado.create({ turno_id, total, estado, observacion: null });
        }

        await Turno.update({ estado: 'completado' }, { where: { id: turno_id } });
      }

      return res.status(201).json({ ok: true, turno_id, itemsCargados: itemsBody.length });
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  }

  // GET /chequeos/:turno_id
  async listarPorTurno(req, res) {
    try {
      const { turno_id } = req.params;
      const lista = await Chequeo.findAll({ where: { turno_id } });
      return res.status(200).json(lista);
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  }

  // DELETE /chequeos/turno/:turno_id/punto/:punto
  async eliminarItem(req, res) {
    try {
      const { turno_id, punto } = req.params;
      const borrados = await Chequeo.destroy({ where: { turno_id, punto } });

      if (borrados > 0) {
        const turno = await Turno.findByPk(turno_id);
        if (turno && turno.estado === 'completado') {
          await Turno.update({ estado: 'confirmado' }, { where: { id: turno_id } });
        }
      }

      return res.status(200).json({ borrados });
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  }
}

module.exports = new ChequeosController();

