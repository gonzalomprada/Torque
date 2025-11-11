const Resultado = require('../models/resultadosModels.js');
const Chequeo = require('../models/chequeosModels.js');
const Turno = require('../models/turnosModels.js');

class ResultadosController {
  constructor(){}

  // GET /resultados/turno/:turno_id
  async obtenerPorTurno(req, res) {
    try {
      const { turno_id } = req.params;
      const r = await Resultado.findOne({ where: { turno_id } });
      return res.status(200).json(r);
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  }

  // PUT /resultados/turno/:turno_id/observacion
  async actualizarObservacion(req, res) {
    try {
      const { turno_id } = req.params;
      const { observacion } = req.body;
      const r = await Resultado.findOne({ where: { turno_id } });
      if (!r) return res.status(404).json({ err: 'Resultado no encontrado' });
      await r.update({ observacion: observacion || null });
      return res.status(200).json(r);
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  }

  // POST /resultados/recalcular/:turno_id
  async recalcular(req, res) {
    try {
      const { turno_id } = req.params;
      const items = await Chequeo.findAll({ where: { turno_id } });

      if (items.length === 0) {
        return res.status(400).json({ err: 'No hay chequeos para recalcular' });
      }

      const total = items.reduce((acc, it) => acc + (it.puntaje || 0), 0);
      const hayMenorA5 = items.some(it => it.puntaje < 5);
      const estado = (items.length === 8 && total >= 80 && !hayMenorA5) ? 'seguro' : 'rechequear';

      const existente = await Resultado.findOne({ where: { turno_id } });
      if (existente) {
        await existente.update({ total, estado });
      } else {
        await Resultado.create({ turno_id, total, estado, observacion: null });
      }

      // si llegamos a 8, dejamos el turno completado
      if (items.length === 8) {
        await Turno.update({ estado: 'completado' }, { where: { id: turno_id } });
      }

      const actualizado = await Resultado.findOne({ where: { turno_id } });
      return res.status(200).json(actualizado);
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  }
}

module.exports = new ResultadosController();
