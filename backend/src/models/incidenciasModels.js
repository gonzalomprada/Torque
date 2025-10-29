const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion.js');

const Incidencia = dbSequelize.define('Incidencia', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  vehiculo_id: { type: DataTypes.BIGINT, allowNull: false },
  titulo: { type: DataTypes.STRING(140), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  estado: { type: DataTypes.ENUM('ABIERTA','CERRADA'), allowNull: false, defaultValue: 'ABIERTA' },
  creada_por: { type: DataTypes.BIGINT, allowNull: false },
  cerrada_por: { type: DataTypes.BIGINT, allowNull: true },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: dbSequelize.literal('NOW()') },
  closed_at:  { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'incidencias',
  timestamps: false
});

module.exports = Incidencia;
