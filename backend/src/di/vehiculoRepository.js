class VehiculoRepository {
  constructor({ Vehiculo, EstadoTipo }) {
    this.Vehiculo = Vehiculo;
    this.EstadoTipo = EstadoTipo;
  }

  findAll() {
    return this.Vehiculo.findAll({
      include: [{ model: this.EstadoTipo, as: 'estadoActual', attributes: ['codigo', 'nombre'] }],
      order: [['id', 'ASC']]
    });
  }

  findById(id) {
    return this.Vehiculo.findByPk(id, {
      include: [{ model: this.EstadoTipo, as: 'estadoActual', attributes: ['codigo', 'nombre'] }]
    });
  }

  findByDominio(dominio) {
    return this.Vehiculo.findOne({ where: { dominio } });
  }

  create(data) {
    return this.Vehiculo.create(data);
  }

  async updateById(entity, data) {
    return entity.update(data);
  }

  async deleteById(entity) {
    return entity.destroy();
  }
}

module.exports = VehiculoRepository;

