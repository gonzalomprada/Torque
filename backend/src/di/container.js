const { createContainer, asClass, asValue } = require('awilix');
const dbSequelize = require('../db/conexion.js');
const { Vehiculo } = require('../models');
const Notificador = require('./notificador');
const VehiculoRepository = require('./vehiculoRepository');
const VehiculoService = require('./vehiculoService');

function buildContainer() {
  const container = createContainer();

  container.register({
    dbSequelize: asValue(dbSequelize),
    Vehiculo: asValue(Vehiculo),

    notificador: asClass(Notificador).singleton(),

    vehiculoRepository: asClass(VehiculoRepository).scoped(),
    vehiculoService: asClass(VehiculoService).scoped(),
  });

  return container;
}

module.exports = buildContainer;



