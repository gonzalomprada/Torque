const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion.js');

const EventoEstado = dbSequelize.define('EventoEstado', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  vehiculo_id: { type: DataTypes.BIGINT, allowNull: false },
  estado_anterior_id: { type: DataTypes.SMALLINT, allowNull: true },
  estado_nuevo_id: { type: DataTypes.SMALLINT, allowNull: false },
  motivo: { type: DataTypes.TEXT, allowNull: false },
  usuario_id: { type: DataTypes.BIGINT, allowNull: false },
  at: { type: DataTypes.DATE, allowNull: false, defaultValue: dbSequelize.literal('NOW()') }
}, {
  tableName: 'eventos_estado',
  timestamps: false
});

module.exports = EventoEstado;
