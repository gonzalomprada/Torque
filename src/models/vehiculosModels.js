const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion.js');

const Vehiculo = dbSequelize.define('Vehiculo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  matricula: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  marca: { type: DataTypes.STRING(50), allowNull: false },
  modelo: { type: DataTypes.STRING(50), allowNull: false },
  anio: { type: DataTypes.INTEGER, allowNull: false },
  duenioId: { type: DataTypes.INTEGER, allowNull: true, field: 'duenio_id' }
}, {
  tableName: 'vehiculos',
  timestamps: false
});

module.exports = Vehiculo;
