const { Vehiculo, EstadoTipo } = require('../models/index.js');

class VehiculoRepository {
  async findAll() {
    return Vehiculo.findAll({
      include: [{ model: EstadoTipo, as: 'estadoActual', attributes: ['codigo', 'nombre'] }],
      order: [['id', 'ASC']]
    });
  }

  async findById(id) {
    return Vehiculo.findByPk(id, {
      include: [{ model: EstadoTipo, as: 'estadoActual', attributes: ['codigo', 'nombre'] }]
    });
  }

  async findByDominio(dominio) {
    return Vehiculo.findOne({ where: { dominio } });
  }

  async create(data) {
    return Vehiculo.create(data);
  }

  async updateById(id, data) {
    const v = await Vehiculo.findByPk(id);
    if (!v) return null;
    await v.update(data);
    return v;
  }

  async deleteById(id) {
    const v = await Vehiculo.findByPk(id);
    if (!v) return null;
    await v.destroy();
    return true;
  }
}

module.exports = VehiculoRepository;
