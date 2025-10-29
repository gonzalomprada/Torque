const dbSequelize = require('../db/conexion.js');

const Usuario = require('./usuariosModels.js');
const Rol = require('./rolesModels.js');
const UsuarioRol = require('./usuariosRolesModels.js');
const EstadoTipo = require('./estadosTipoModels.js');
const Vehiculo = require('./vehiculosModels.js');
const Incidencia = require('./incidenciasModels.js');
const EventoEstado = require('./eventosEstadoModels.js');

// Relaciones Usuarios / Roles

Usuario.belongsToMany(Rol, {
  through: UsuarioRol,
  foreignKey: 'usuario_id',
  otherKey: 'rol_id',
  as: 'roles'
});
Rol.belongsToMany(Usuario, {
  through: UsuarioRol,
  foreignKey: 'rol_id',
  otherKey: 'usuario_id',
  as: 'usuarios'
});


// EstadoTipo - Vehiculo

EstadoTipo.hasMany(Vehiculo, {
  foreignKey: 'estado_actual_id',
  as: 'vehiculos'
});
Vehiculo.belongsTo(EstadoTipo, {
  foreignKey: 'estado_actual_id',
  as: 'estadoActual'
});


// Histórico de estados

Vehiculo.hasMany(EventoEstado, {
  foreignKey: 'vehiculo_id',
  as: 'historialEstados',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
EventoEstado.belongsTo(Vehiculo, {
  foreignKey: 'vehiculo_id',
  as: 'vehiculo'
});

EstadoTipo.hasMany(EventoEstado, {
  foreignKey: 'estado_anterior_id',
  as: 'eventosComoAnterior'
});
EstadoTipo.hasMany(EventoEstado, {
  foreignKey: 'estado_nuevo_id',
  as: 'eventosComoNuevo'
});
EventoEstado.belongsTo(EstadoTipo, {
  foreignKey: 'estado_anterior_id',
  as: 'estadoAnterior'
});
EventoEstado.belongsTo(EstadoTipo, {
  foreignKey: 'estado_nuevo_id',
  as: 'estadoNuevo'
});

// Incidencias

Vehiculo.hasMany(Incidencia, {
  foreignKey: 'vehiculo_id',
  as: 'incidencias',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Incidencia.belongsTo(Vehiculo, {
  foreignKey: 'vehiculo_id',
  as: 'vehiculo'
});

Usuario.hasMany(Incidencia, {
  foreignKey: 'creada_por',
  as: 'incidenciasCreadas'
});
Usuario.hasMany(Incidencia, {
  foreignKey: 'cerrada_por',
  as: 'incidenciasCerradas'
});
Incidencia.belongsTo(Usuario, {
  foreignKey: 'creada_por',
  as: 'creador'
});
Incidencia.belongsTo(Usuario, {
  foreignKey: 'cerrada_por',
  as: 'cerrador'
});

module.exports = {
  dbSequelize,
  Usuario, Rol, UsuarioRol,
  EstadoTipo, Vehiculo,
  Incidencia, EventoEstado
};
