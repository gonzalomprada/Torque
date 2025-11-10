const { createContainer, asClass, asValue } = require('awilix');
const dbSequelize = require('../db/conexion.js');
const { Vehiculo, EstadoTipo, EventoEstado } = require('../models');
const Notificador = require('./notificador');
const VehiculoRepository = require('./vehiculoRepository');
const VehiculoService = require('./vehiculoService');

function buildContainer() {
  const container = createContainer();

  container.register({
    // infra
    dbSequelize: asValue(dbSequelize),
    // modelos
    Vehiculo: asValue(Vehiculo),
    EstadoTipo: asValue(EstadoTipo),
    EventoEstado: asValue(EventoEstado),

    // servicios de infraestructura
    notificador: asClass(Notificador).singleton(),

    // repos
    vehiculoRepository: asClass(VehiculoRepository).scoped(),

    // services
    vehiculoService: asClass(VehiculoService).scoped(),
  });

  return container;
}

module.exports = buildContainer;


