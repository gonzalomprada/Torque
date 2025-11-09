const { vehiculoService } = require('../di/container.js');

class VehiculosController {
  async listar(req, res) {
    try {
      const data = await vehiculoService.listar();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error al listar vehículos:', error);
      res.status(500).json({ message: 'Error interno al listar vehículos' });
    }
  }

  async obtener(req, res) {
    try {
      const { id } = req.params;
      const v = await vehiculoService.obtener(id);
      if (!v) return res.status(404).json({ message: 'Vehículo no encontrado' });
      res.status(200).json(v);
    } catch (error) {
      console.error('Error al obtener vehículo:', error);
      res.status(500).json({ message: 'Error interno al obtener vehículo' });
    }
  }

  async crear(req, res) {
    try {
      const nuevo = await vehiculoService.crear(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno al crear vehículo' });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      await vehiculoService.actualizar(id, req.body);
      res.status(200).json({ message: 'Vehículo actualizado correctamente' });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno al actualizar vehículo' });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await vehiculoService.eliminar(id);
      res.status(200).json({ message: 'Vehículo eliminado correctamente' });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Error interno al eliminar vehículo' });
    }
  }
}

module.exports = new VehiculosController();

