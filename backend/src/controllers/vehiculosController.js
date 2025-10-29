const { Vehiculo, EstadoTipo } = require('../models/index.js');

class VehiculosController {
  // GET /api/v1/vehiculos
  async listar(req, res) {
    try {
      const vehiculos = await Vehiculo.findAll({
        include: [{ model: EstadoTipo, as: 'estadoActual', attributes: ['codigo', 'nombre'] }],
        order: [['id', 'ASC']]
      });
      res.status(200).json(vehiculos);
    } catch (error) {
      console.error('Error al listar vehículos:', error);
      res.status(500).json({ message: 'Error interno al listar vehículos' });
    }
  }

  // GET /api/v1/vehiculos/:id
  async obtener(req, res) {
    try {
      const { id } = req.params;
      const vehiculo = await Vehiculo.findByPk(id, {
        include: [{ model: EstadoTipo, as: 'estadoActual', attributes: ['codigo', 'nombre'] }]
      });

      if (!vehiculo) {
        return res.status(404).json({ message: 'Vehículo no encontrado' });
      }
      res.status(200).json(vehiculo);
    } catch (error) {
      console.error('Error al obtener vehículo:', error);
      res.status(500).json({ message: 'Error interno al obtener vehículo' });
    }
  }

  // POST /api/v1/vehiculos
  async crear(req, res) {
    try {
      const { dominio, marca, modelo, anio, estado_actual_id } = req.body;

      if (!dominio || !marca || !modelo) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
      }

      const existente = await Vehiculo.findOne({ where: { dominio } });
      if (existente) {
        return res.status(409).json({ message: 'El dominio ya existe' });
      }

      const vehiculo = await Vehiculo.create({ dominio, marca, modelo, anio, estado_actual_id });
      res.status(201).json(vehiculo);
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      res.status(500).json({ message: 'Error interno al crear vehículo' });
    }
  }

  // PUT /api/v1/vehiculos/:id
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { dominio, marca, modelo, anio, estado_actual_id } = req.body;

      const vehiculo = await Vehiculo.findByPk(id);
      if (!vehiculo) {
        return res.status(404).json({ message: 'Vehículo no encontrado' });
      }

      if (dominio && dominio !== vehiculo.dominio) {
        const existe = await Vehiculo.findOne({ where: { dominio } });
        if (existe) {
          return res.status(409).json({ message: 'El dominio ya está en uso' });
        }
      }

      await vehiculo.update({ dominio, marca, modelo, anio, estado_actual_id });

      res.status(200).json({ message: 'Vehículo actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      res.status(500).json({ message: 'Error interno al actualizar vehículo' });
    }
  }

  // DELETE /api/v1/vehiculos/:id
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const vehiculo = await Vehiculo.findByPk(id);

      if (!vehiculo) {
        return res.status(404).json({ message: 'Vehículo no encontrado' });
      }

      // Baja lógica (si querés mantener el registro)
      await vehiculo.destroy();

      res.status(200).json({ message: 'Vehículo eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      res.status(500).json({ message: 'Error interno al eliminar vehículo' });
    }
  }
}

module.exports = new VehiculosController();
