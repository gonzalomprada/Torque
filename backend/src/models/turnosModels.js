const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion.js');

const Turno = dbSequelize.define('Turno', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  vehiculo_id: { type: DataTypes.INTEGER, allowNull: true },
  start_at: { type: DataTypes.DATE, allowNull: false },
  estado: {
    type: DataTypes.STRING(15),
    allowNull: false,
    defaultValue: 'LIBRE' // LIBRE | RESERVADO | CONFIRMADO | CANCELADO | ATENDIDO
  },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: dbSequelize.literal('NOW()') }
}, {
  tableName: 'turnos',
  timestamps: false
});

module.exports = Turno;

