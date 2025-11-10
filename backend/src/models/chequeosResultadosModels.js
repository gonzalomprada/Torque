const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion');

const ChequeoResultado = dbSequelize.define('ChequeoResultado', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  inspeccion_id: { type: DataTypes.BIGINT, allowNull: false },
  chequeo_tipo_id: { type: DataTypes.SMALLINT, allowNull: false },
  puntaje: { type: DataTypes.SMALLINT, allowNull: false }, // 1..10
  observacion: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'chequeos_resultados',
  timestamps: false
});

module.exports = ChequeoResultado;
