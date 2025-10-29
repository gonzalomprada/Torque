const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion.js');

const EstadoTipo = dbSequelize.define('EstadoTipo', {
  id: { type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true },
  codigo: { type: DataTypes.STRING(30), allowNull: false, unique: true }, // ACTIVO, EN_TALLER...
  nombre: { type: DataTypes.STRING(60), allowNull: false },
  orden:  { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 1 }
}, {
  tableName: 'estados_tipo',
  timestamps: false
});

module.exports = EstadoTipo;
