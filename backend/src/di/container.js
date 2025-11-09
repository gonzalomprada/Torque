const VehiculoRepository = require('./vehiculoRepository.js');
const VehiculoService = require('./vehiculoService.js');
const Notificador = require('./notificador.js');

const vehiculoRepository = new VehiculoRepository();
const notificador = new Notificador();
const vehiculoService = new VehiculoService({ vehiculoRepository, notificador });

module.exports = {
  vehiculoRepository,
  notificador,
  vehiculoService,
};

