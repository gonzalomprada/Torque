// di/vehiculoService.js
class VehiculoService {
  constructor({ vehiculoRepository, notificador }) {
    this.vehiculoRepository = vehiculoRepository;
    this.notificador = notificador;
  }

  listar() { return this.vehiculoRepository.findAll(); }
  obtener(id) { return this.vehiculoRepository.findById(id); }

  async crear(data) {
    const { matricula, marca, modelo } = data;
    if (!matricula || !marca || !modelo) {
      const e = new Error('Faltan campos obligatorios');
      e.status = 400; throw e;
    }

    const dup = await this.vehiculoRepository.findByMatricula(matricula);
    if (dup) {
      const e = new Error('La matrícula ya existe');
      e.status = 409; throw e;
    }

    const nuevo = await this.vehiculoRepository.create(data);
    this.notificador.vehiculoCreado(nuevo);
    return nuevo;
  }

  async actualizar(id, data) {
    const actual = await this.vehiculoRepository.findById(id);
    if (!actual) { const e = new Error('Vehículo no encontrado'); e.status = 404; throw e; }

    if (data.matricula && data.matricula !== actual.matricula) {
      const dup = await this.vehiculoRepository.findByMatricula(data.matricula);
      if (dup) { const e = new Error('La matrícula ya está en uso'); e.status = 409; throw e; }
    }

    const actualizado = await this.vehiculoRepository.updateById(actual, data);
    this.notificador.vehiculoActualizado(actualizado);
    return actualizado;
  }

  async eliminar(id) {
    const actual = await this.vehiculoRepository.findById(id);
    if (!actual) { const e = new Error('Vehículo no encontrado'); e.status = 404; throw e; }
    await this.vehiculoRepository.deleteById(actual);
    this.notificador.vehiculoEliminado(id);
  }
}

module.exports = VehiculoService;




  