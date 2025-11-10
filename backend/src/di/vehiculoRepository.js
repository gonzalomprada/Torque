class VehiculoRepository {
  constructor({ Vehiculo }) {
    this.Vehiculo = Vehiculo;
  }

  findAll() {
    return this.Vehiculo.findAll({ order: [['id', 'ASC']] });
  }

  findById(id) {
    return this.Vehiculo.findByPk(id);
  }

  findByDominio(matricula) {
    return this.Vehiculo.findOne({ where: { dominio } });
  }

  create(data) {
    return this.Vehiculo.create(data);
  }

  updateById(entity, data) {
    return entity.update(data);
  }

  deleteById(entity) {
    return entity.destroy();
  }
}

module.exports = VehiculoRepository;


