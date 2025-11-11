const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion.js');

const Turno = dbSequelize.define('Turno', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    field: 'id'
  },
  vehiculoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'vehiculo_id'
  },
  fecha: {
    type: DataTypes.DATEONLY, // día sin hora
    allowNull: false,
    field: 'fecha'
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmado', 'completado'),
    allowNull: false,
    defaultValue: 'pendiente',
    field: 'estado'
  }
}, {
  tableName: 'turnos',
  timestamps: false
});

module.exports = Turno;
