const container = require('../di/container.js');

class VehiculosControllerBridge {
  constructor() {
    this.ctrl = container.resolve('vehiculosController');
    this.consultar = this.ctrl.consultar;
    this.ingresar = this.ctrl.ingresar;
    this.consultarId = this.ctrl.consultarId;
    this.actualizarId = this.ctrl.actualizarId;
    this.eliminarId = this.ctrl.eliminarId;
  }
}

module.exports = new VehiculosControllerBridge();
