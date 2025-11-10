const { Inspeccion, ChequeoResultado, ChequeoTipo, Turno, Vehiculo } = require('../models');

// Regla de negocio: >=80 => APROBADO; <40 o algún puntaje<5 => RECHEQUEO
function evaluar(total, puntajes) {
  const anyBelow5 = puntajes.some(p => p < 5);
  if (total >= 80 && !anyBelow5) return 'APROBADO';
  if (total < 40 || anyBelow5) return 'RECHEQUEO';
  return 'EN_PROCESO';
}

class InspeccionesController {
  // POST /api/v1/inspecciones/iniciar
  async iniciar(req, res) {
    const { turno_id, inspector_id } = req.body || {};
    if (!turno_id) return res.status(400).json({ msg:'turno_id es obligatorio' });

    const turno = await Turno.findByPk(turno_id);
    if (!turno || turno.estado !== 'CONFIRMADO') return res.status(409).json({ msg:'Turno no confirmado' });

    const vehiculo = await Vehiculo.findByPk(turno.vehiculo_id);
    if (!vehiculo) return res.status(404).json({ msg:'Vehículo no encontrado' });

    const insp = await Inspeccion.create({
      turno_id, vehiculo_id: vehiculo.id, inspector_id: inspector_id || null, estado:'EN_PROCESO'
    });
    res.status(201).json(insp);
  }

  // POST /api/v1/inspecciones/:id/cargar
  async cargar(req, res) {
    const { id } = req.params;
    const { resultados, observacion } = req.body || {};
    if (!Array.isArray(resultados) || resultados.length === 0) {
      return res.status(400).json({ msg:'Se requieren resultados' });
    }

    const insp = await Inspeccion.findByPk(id);
    if (!insp) return res.status(404).json({ msg:'Inspección no encontrada' });

    // Validar tipos activos
    const tipos = await ChequeoTipo.findAll({ where: { activo: true } });
    const tiposIds = new Set(tipos.map(t => t.id));

    const puntajes = [];
    for (const r of resultados) {
      if (!tiposIds.has(r.chequeo_tipo_id)) return res.status(400).json({ msg:`Tipo inválido: ${r.chequeo_tipo_id}` });
      if (typeof r.puntaje !== 'number' || r.puntaje < 1 || r.puntaje > 10) {
        return res.status(400).json({ msg:'puntaje debe ser 1..10' });
      }
      await ChequeoResultado.create({
        inspeccion_id: insp.id,
        chequeo_tipo_id: r.chequeo_tipo_id,
        puntaje: r.puntaje,
        observacion: r.observacion || null
      });
      puntajes.push(r.puntaje);
    }

    // Si se cargaron los 8, consolidar total
    const total = puntajes.reduce((a,b)=>a+b, 0);
    const estado = evaluar(total, puntajes);
    await insp.update({
      total_puntos: total,
      estado,
      observacion: observacion || insp.observacion || null
    });

    res.json({ msg:'Resultados cargados', total, estado });
  }
}

module.exports = new InspeccionesController();
