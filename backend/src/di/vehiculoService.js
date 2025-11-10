class VehiculoService {
  constructor({ vehiculoRepository, notificador }) {
    this.vehiculoRepository = vehiculoRepository;
    this.notificador = notificador;
  }

  listar() {
    return this.vehiculoRepository.findAll();
  }

  obtener(id) {
    return this.vehiculoRepository.findById(id);
  }

  async crear(data) {
    const { dominio, marca, modelo } = data;
    if (!dominio || !marca || !modelo) {
      const e = new Error('Faltan campos obligatorios');
      e.status = 400;
      throw e;
    }

    const dup = await this.vehiculoRepository.findByDominio(dominio);
    if (dup) {
      const e = new Error('El dominio ya existe');
      e.status = 409;
      throw e;
    }

    const nuevo = await this.vehiculoRepository.create(data);
    this.notificador.vehiculoCreado(nuevo);
    return nuevo;
  }

  async actualizar(id, data) {
    const actual = await this.vehiculoRepository.findById(id);
    if (!actual) {
      const e = new Error('Vehículo no encontrado');
      e.status = 404;
      throw e;
    }

    if (data.dominio && data.dominio !== actual.dominio) {
      const dup = await this.vehiculoRepository.findByDominio(data.dominio);
      if (dup) {
        const e = new Error('El dominio ya está en uso');
        e.status = 409;
        throw e;
      }
    }

    const actualizado = await this.vehiculoRepository.updateById(actual, data);
    this.notificador.vehiculoActualizado(actualizado);
    return actualizado;
  }

  async eliminar(id) {
    const actual = await this.vehiculoRepository.findById(id);
    if (!actual) {
      const e = new Error('Vehículo no encontrado');
      e.status = 404;
      throw e;
    }

    await this.vehiculoRepository.deleteById(actual);
    this.notificador.vehiculoEliminado(id);
  }
}

module.exports = VehiculoService;

  