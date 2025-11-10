class Notificador {
  async vehiculoCreado(vehiculo) {
    console.log(`[NOTIF] Vehículo creado: ${vehiculo.matricula}`);
  }
  async vehiculoActualizado(vehiculo) {
    console.log(`[NOTIF] Vehículo actualizado: ${vehiculo.id}`);
  }
  async vehiculoEliminado(id) {
    console.log(`[NOTIF] Vehículo eliminado: ${id}`);
  }
}
module.exports = Notificador;

