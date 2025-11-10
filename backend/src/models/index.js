const dbSequelize = require('../db/conexion.js');
const Usuario = require('./usuariosModels.js');
const Rol = require('./rolesModels.js');
const UsuarioRol = require('./usuariosRolesModels.js');
const Vehiculo = require('./vehiculosModels.js');
const Turno = require('./turnosModels.js');
const Inspeccion = require('./inspeccionesModels.js');
const ChequeoTipo = require('./chequeoTiposModels.js');
const ChequeoResultado = require('./chequeosResultadosModels.js'); 

// -------------------------------
// Usuarios <-> Roles (N a N)
// -------------------------------
Usuario.belongsToMany(Rol, {
  through: UsuarioRol,
  foreignKey: 'usuario_id',
  otherKey: 'rol_id',
  as: 'roles',
});
Rol.belongsToMany(Usuario, {
  through: UsuarioRol,
  foreignKey: 'rol_id',
  otherKey: 'usuario_id',
  as: 'usuarios',
});

// -------------------------------
// Vehículo 1 - N Turnos
// -------------------------------
Vehiculo.hasMany(Turno, {
  foreignKey: 'vehiculo_id',
  as: 'turnos',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
Turno.belongsTo(Vehiculo, {
  foreignKey: 'vehiculo_id',
  as: 'vehiculo',
});

// -------------------------------
// Turno 1 - 1 Inspeccion
// -------------------------------
Turno.hasOne(Inspeccion, {
  foreignKey: 'turno_id',
  as: 'inspeccion',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Inspeccion.belongsTo(Turno, {
  foreignKey: 'turno_id',
  as: 'turno',
});

// -------------------------------
// Usuario 1 - N Inspecciones (inspector)
// -------------------------------
Usuario.hasMany(Inspeccion, {
  foreignKey: 'inspector_id',
  as: 'inspeccionesRealizadas',
});
Inspeccion.belongsTo(Usuario, {
  foreignKey: 'inspector_id',
  as: 'inspector',
});

// -------------------------------
// Catálogo de puntos 1 - N Items
// Inspección 1 - N Items
// -------------------------------
ChequeoTipo.hasMany(ChequeoResultado, {
  foreignKey: 'punto_id',
  as: 'resultados',
});
ChequeoResultado.belongsTo(ChequeoTipo, {
  foreignKey: 'punto_id',
  as: 'punto',
});

Inspeccion.hasMany(ChequeoResultado, {
  foreignKey: 'inspeccion_id',
  as: 'items',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
ChequeoResultado.belongsTo(Inspeccion, {
  foreignKey: 'inspeccion_id',
  as: 'inspeccion',
});

module.exports = {
  dbSequelize,
  // seguridad
  Usuario, Rol, UsuarioRol,
  // dominio
  Vehiculo, Turno, Inspeccion,
  ChequeoTipo, ChequeoResultado,
};


