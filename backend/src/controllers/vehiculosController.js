const container = require('../di/container');
const vehiculoService = container.resolve('vehiculoService');

class VehiculosController {
  async listar(req, res) {
    try {
      const data = await vehiculoService.listar();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: 'Error interno al listar vehículos' });
    }
  }

  async obtener(req, res) {
    try {
      const v = await vehiculoService.obtener(req.params.id);
      if (!v) return res.status(404).json({ message: 'Vehículo no encontrado' });
      res.status(200).json(v);
    } catch (err) {
      res.status(500).json({ message: 'Error interno al obtener vehículo' });
    }
  }

  async crear(req, res) {
    try {
      const nuevo = await vehiculoService.crear(req.body);
      res.status(201).json(nuevo);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async actualizar(req, res) {
    try {
      await vehiculoService.actualizar(req.params.id, req.body);
      res.status(200).json({ message: 'Vehículo actualizado correctamente' });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async eliminar(req, res) {
    try {
      await vehiculoService.eliminar(req.params.id);
      res.status(200).json({ message: 'Vehículo eliminado correctamente' });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}

module.exports = new VehiculosController();


