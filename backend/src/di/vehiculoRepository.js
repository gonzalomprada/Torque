class VehiculoRepository {
  constructor({ Vehiculo, EstadoTipo, EventoEstado }) {
    this.Vehiculo = Vehiculo;
    this.EstadoTipo = EstadoTipo;
    this.EventoEstado = EventoEstado;
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

  updateById(entity, data) {
    return entity.update(data);
  }

  deleteById(entity) {
    return entity.destroy();
  }

  getEstadoByCodigo(codigo) {
    return this.EstadoTipo.findOne({ where: { codigo } });
  }

  updateEstado(vehiculo, estado_actual_id, t) {
    return vehiculo.update({ estado_actual_id }, { transaction: t });
  }

  crearEvento({ vehiculo_id, estado_anterior_id, estado_nuevo_id, motivo, usuario_id }, t) {
    return this.EventoEstado.create(
      { vehiculo_id, estado_anterior_id, estado_nuevo_id, motivo, usuario_id },
      { transaction: t }
    );
  }
}

module.exports = VehiculoRepository;


