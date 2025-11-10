const { createContainer, asClass, asValue } = require('awilix');
const { Vehiculo, EstadoTipo } = require('../models/index.js');

const VehiculoRepository = require('./vehiculoRepository.js');
const VehiculoService = require('./vehiculoService.js');
const Notificador = require('./notificador.js');

const container = createContainer();

container.register({
  // Models
  Vehiculo: asValue(Vehiculo),
  EstadoTipo: asValue(EstadoTipo),

  // Infra
  notificador: asClass(Notificador).singleton(),

  // Repository
  vehiculoRepository: asClass(VehiculoRepository)
    .singleton()
    .inject(() => ({ Vehiculo, EstadoTipo })),

  // Service
  vehiculoService: asClass(VehiculoService).singleton(),
});

module.exports = container;
