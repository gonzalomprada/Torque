const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion.js');

const UsuarioRol = dbSequelize.define('UsuarioRol', {
  usuario_id: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
  rol_id: { type: DataTypes.SMALLINT, allowNull: false, primaryKey: true }
}, {
  tableName: 'usuarios_roles',
  timestamps: false
});

module.exports = UsuarioRol;
