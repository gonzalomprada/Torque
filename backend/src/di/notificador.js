class Notificador {
    async vehiculoCreado(vehiculo) {
      console.log(`[NOTIFICADOR] Vehículo creado: ${vehiculo.dominio}`);
    }
  
    async vehiculoActualizado(vehiculo) {
      console.log(`[NOTIFICADOR] Vehículo actualizado: ${vehiculo.id}`);
    }
  
    async vehiculoEliminado(id) {
      console.log(`[NOTIFICADOR] Vehículo eliminado: ${id}`);
    }
  }
  
module.exports = Notificador;
  