const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion.js');

const Resultado = dbSequelize.define('Resultado', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  turno_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  total: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  estado: { type: DataTypes.STRING(20), allowNull: false }, // "seguro" | "rechequear"
  observacion: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'resultados',
  timestamps: false
});

module.exports = Resultado;
