class Notificador {
  async vehiculoCreado(vehiculo) {
    console.log(`[NOTIF] Vehículo creado: ${vehiculo.dominio}`);
  }

  async vehiculoActualizado(vehiculo) {
    console.log(`[NOTIF] Vehículo actualizado: ${vehiculo.id}`);
  }

  async vehiculoEliminado(id) {
    console.log(`[NOTIF] Vehículo eliminado: ${id}`);
  }

  async avisarCambioEstado({ vehiculo, estadoAnterior, estadoNuevo, motivo }) {
    console.log(`[NOTIF] Vehículo ${vehiculo.id} (${vehiculo.dominio}): ${estadoAnterior?.codigo || '-'} -> ${estadoNuevo.codigo}. Motivo: ${motivo}`);
  }
}

module.exports = Notificador;
