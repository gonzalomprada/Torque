const buildContainer = require('../di/container');
const container = buildContainer();
const vehiculoService = container.resolve('vehiculoService');

class VehiculosController {

  async listar(req, res) { 
    const data = await vehiculoService.listar(); 
    res.json(data); 
  }
  async obtener(req, res) {
     const v = await vehiculoService.obtener(req.params.id); 
     if(!v) return res.status(404).json({message:'Vehículo no encontrado'}); 
     res.json(v); 
  }
  async crear(req, res) { 
    const nuevo = await vehiculoService.crear(req.body);
    res.status(201).json(nuevo); 
  }
  async actualizar(req, res) { 
    const upd = await vehiculoService.actualizar(req.params.id, req.body); 
    res.json(upd); 
  }
  async eliminar(req, res) { 
    await vehiculoService.eliminar(req.params.id); 
    res.json({message:'Vehículo eliminado correctamente'}); 
  }
}
module.exports = new VehiculosController();




