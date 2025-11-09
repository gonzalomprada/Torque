class VehiculoService {
    constructor({ vehiculoRepository, notificador }) {
      this.vehiculoRepository = vehiculoRepository;
      this.notificador = notificador;
    }
  
    async listar() {
      return this.vehiculoRepository.findAll();
    }
  
    async obtener(id) {
      return this.vehiculoRepository.findById(id);
    }
  
    async crear({ dominio, marca, modelo, anio, estado_actual_id }) {
      if (!dominio || !marca || !modelo) {
        const e = new Error('Faltan campos obligatorios');
        e.status = 400;
        throw e;
      }
  
      const existente = await this.vehiculoRepository.findByDominio(dominio);
      if (existente) {
        const e = new Error('El dominio ya existe');
        e.status = 409;
        throw e;
      }
  
      const nuevo = await this.vehiculoRepository.create({ dominio, marca, modelo, anio, estado_actual_id });
      await this.notificador.vehiculoCreado(nuevo);
      return nuevo;
    }
  
    async actualizar(id, { dominio, marca, modelo, anio, estado_actual_id }) {
      const actual = await this.vehiculoRepository.findById(id);
      if (!actual) {
        const e = new Error('Vehículo no encontrado');
        e.status = 404;
        throw e;
      }
  
      if (dominio && dominio !== actual.dominio) {
        const existe = await this.vehiculoRepository.findByDominio(dominio);
        if (existe) {
          const e = new Error('El dominio ya está en uso');
          e.status = 409;
          throw e;
        }
      }
  
      const actualizado = await this.vehiculoRepository.updateById(id, { dominio, marca, modelo, anio, estado_actual_id });
      await this.notificador.vehiculoActualizado(actualizado);
      return actualizado;
    }
  
    async eliminar(id) {
      const actual = await this.vehiculoRepository.findById(id);
      if (!actual) {
        const e = new Error('Vehículo no encontrado');
        e.status = 404;
        throw e;
      }
      await this.vehiculoRepository.deleteById(id);
      await this.notificador.vehiculoEliminado(id);
      return true;
    }
  }
  
module.exports = VehiculoService;
  