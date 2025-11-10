const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion.js');

const Vehiculo = dbSequelize.define('Vehiculo', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  matricula: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  marca: { type: DataTypes.STRING(80), allowNull: false },
  modelo: { type: DataTypes.STRING(120), allowNull: false },
  anio: { type: DataTypes.SMALLINT, allowNull: true,
    validate: { min: 1900, max: new Date().getFullYear() + 1 } },
  propietario: { type: DataTypes.STRING(120), allowNull: true },
  contacto: { type: DataTypes.STRING(160), allowNull: true },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: dbSequelize.literal('NOW()') }
}, {
  tableName: 'vehiculos',
  timestamps: false
});

module.exports = Vehiculo;

