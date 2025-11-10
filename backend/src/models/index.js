const dbSequelize = require('../db/conexion.js');

// Core seguridad
const Usuario = require('./usuariosModels.js');
const Rol = require('./rolesModels.js');
const UsuarioRol = require('./usuariosRolesModels.js');

// Dominio nuevo
const Vehiculo = require('./vehiculosModels.js');
const Turno = require('./turnosModels.js');
const Inspeccion = require('./inspeccionesModels.js');
const ChequeoTipo = require('./chequeoTiposModels.js');          // catálogo P1..P8
const ChequeoResultado = require('./chequeosResultadosModels.js'); // ítems con puntaje 1..10

// -------------------------------
// Usuarios <-> Roles (N a N)
// -------------------------------
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

Vehiculo.hasMany(Turno, {
  foreignKey: 'vehiculo_id',
  as: 'turnos',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Turno.belongsTo(Vehiculo, {
  foreignKey: 'vehiculo_id',
  as: 'vehiculo'
});

Turno.hasOne(Inspeccion, {
  foreignKey: 'turno_id',
  as: 'inspeccion', // único
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Inspeccion.belongsTo(Turno, {
  foreignKey: 'turno_id',
  as: 'turno'
});

Usuario.hasMany(Inspeccion, {
  foreignKey: 'inspector_id',
  as: 'inspeccionesRealizadas'
});
Inspeccion.belongsTo(Usuario, {
  foreignKey: 'inspector_id',
  as: 'inspector'
});

ChequeoTipo.hasMany(ChequeoResultado, {
  foreignKey: 'punto_id',
  as: 'resultados'
});
ChequeoResultado.belongsTo(ChequeoTipo, {
  foreignKey: 'punto_id',
  as: 'punto'
});

Inspeccion.hasMany(ChequeoResultado, {
  foreignKey: 'inspeccion_id',
  as: 'items',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
ChequeoResultado.belongsTo(Inspeccion, {
  foreignKey: 'inspeccion_id',
  as: 'inspeccion'
});

module.exports = {
  dbSequelize,

  Usuario,
  Rol,
  UsuarioRol,

  Vehiculo,
  Turno,
  Inspeccion,

  ChequeoTipo,
  ChequeoResultado
};

