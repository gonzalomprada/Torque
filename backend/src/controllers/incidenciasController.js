const { Incidencia, Usuario, Vehiculo } = require('../models/index.js');

class IncidenciasController {
  // GET /api/v1/incidencias
  async listar(req, res) {
    try {
      const { estado } = req.query;
      const where = estado ? { estado } : {};

      const incidencias = await Incidencia.findAll({
        where,
        include: [
          { model: Vehiculo, as: 'vehiculo', attributes: ['id', 'dominio', 'marca', 'modelo'] },
          { model: Usuario, as: 'creador', attributes: ['id', 'nombre', 'email'] },
          { model: Usuario, as: 'cerrador', attributes: ['id', 'nombre', 'email'] }
        ],
        order: [['id', 'ASC']]
      });

      res.status(200).json(incidencias);
    } catch (error) {
      console.error('Error al listar incidencias:', error);
      res.status(500).json({ message: 'Error interno al listar incidencias' });
    }
  }

  // GET /api/v1/incidencias/:id
  async obtener(req, res) {
    try {
      const { id } = req.params;
      const inc = await Incidencia.findByPk(id, {
        include: [
          { model: Vehiculo, as: 'vehiculo', attributes: ['id', 'dominio', 'marca', 'modelo'] },
          { model: Usuario, as: 'creador', attributes: ['id', 'nombre', 'email'] },
          { model: Usuario, as: 'cerrador', attributes: ['id', 'nombre', 'email'] }
        ]
      });
      if (!inc) return res.status(404).json({ message: 'Incidencia no encontrada' });
      res.status(200).json(inc);
    } catch (error) {
      console.error('Error al obtener incidencia:', error);
      res.status(500).json({ message: 'Error interno al obtener incidencia' });
    }
  }

  // POST /api/v1/incidencias
  async crear(req, res) {
    try {
      const { vehiculo_id, titulo, descripcion, creada_por } = req.body;

      if (!vehiculo_id || !titulo || !creada_por) {
        return res.status(400).json({ message: 'vehiculo_id, titulo y creada_por son obligatorios' });
      }

      const nueva = await Incidencia.create({
        vehiculo_id,
        titulo,
        descripcion: descripcion || null,
        estado: 'ABIERTA',
        creada_por
      });

      res.status(201).json(nueva);
    } catch (error) {
      console.error('Error al crear incidencia:', error);
      res.status(500).json({ message: 'Error interno al crear incidencia' });
    }
  }

  // PUT /api/v1/incidencias/:id
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { titulo, descripcion, estado, cerrada_por, closed_at } = req.body;

      const inc = await Incidencia.findByPk(id);
      if (!inc) return res.status(404).json({ message: 'Incidencia no encontrada' });

      await inc.update({
        titulo,
        descripcion,
        estado,
        cerrada_por,
        closed_at
      });

      res.status(200).json({ message: 'Incidencia actualizada correctamente' });
    } catch (error) {
      console.error('Error al actualizar incidencia:', error);
      res.status(500).json({ message: 'Error interno al actualizar incidencia' });
    }
  }

  // DELETE /api/v1/incidencias/:id
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const inc = await Incidencia.findByPk(id);
      if (!inc) return res.status(404).json({ message: 'Incidencia no encontrada' });

      await inc.destroy();
      res.status(200).json({ message: 'Incidencia eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar incidencia:', error);
      res.status(500).json({ message: 'Error interno al eliminar incidencia' });
    }
  }
}

module.exports = new IncidenciasController();
