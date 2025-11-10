const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion');

const ChequeoTipo = dbSequelize.define('ChequeoTipo', {
  id: { type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true },
  codigo: { type: DataTypes.STRING(30), allowNull: false, unique: true }, // ej: FRENOS, LUCES...
  nombre: { type: DataTypes.STRING(120), allowNull: false },
  orden:  { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 1 },
  activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
  tableName: 'chequeos_tipos',
  timestamps: false
});

module.exports = ChequeoTipo;
