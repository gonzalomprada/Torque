const { EstadoTipo } = require('../models/index.js');

class EstadosTipoController {
  // GET /api/v1/estados
  async listar(req, res) {
    try {
      const estados = await EstadoTipo.findAll({ order: [['orden', 'ASC']] });
      res.status(200).json(estados);
    } catch (error) {
      console.error('Error al listar estados:', error);
      res.status(500).json({ message: 'Error interno al listar estados' });
    }
  }

  // GET /api/v1/estados/:id
  async obtener(req, res) {
    try {
      const { id } = req.params;
      const estado = await EstadoTipo.findByPk(id);
      if (!estado) {
        return res.status(404).json({ message: 'Estado no encontrado' });
      }
      res.status(200).json(estado);
    } catch (error) {
      console.error('Error al obtener estado:', error);
      res.status(500).json({ message: 'Error interno al obtener estado' });
    }
  }

  // POST /api/v1/estados
  async crear(req, res) {
    try {
      const { codigo, nombre, orden } = req.body;

      if (!codigo || !nombre) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
      }

      const existente = await EstadoTipo.findOne({ where: { codigo } });
      if (existente) {
        return res.status(409).json({ message: 'El código ya está en uso' });
      }

      const nuevo = await EstadoTipo.create({ codigo, nombre, orden });
      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al crear estado:', error);
      res.status(500).json({ message: 'Error interno al crear estado' });
    }
  }

  // PUT /api/v1/estados/:id
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { codigo, nombre, orden } = req.body;

      const estado = await EstadoTipo.findByPk(id);
      if (!estado) {
        return res.status(404).json({ message: 'Estado no encontrado' });
      }

      if (codigo && codigo !== estado.codigo) {
        const existe = await EstadoTipo.findOne({ where: { codigo } });
        if (existe) {
          return res.status(409).json({ message: 'El código ya está en uso' });
        }
      }

      await estado.update({ codigo, nombre, orden });
      res.status(200).json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      res.status(500).json({ message: 'Error interno al actualizar estado' });
    }
  }

  // DELETE /api/v1/estados/:id
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const estado = await EstadoTipo.findByPk(id);

      if (!estado) {
        return res.status(404).json({ message: 'Estado no encontrado' });
      }

      await estado.destroy();
      res.status(200).json({ message: 'Estado eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar estado:', error);
      res.status(500).json({ message: 'Error interno al eliminar estado' });
    }
  }
}

module.exports = new EstadosTipoController();
