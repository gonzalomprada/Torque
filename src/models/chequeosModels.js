const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion.js');

const Chequeo = dbSequelize.define('Chequeo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  turno_id: { type: DataTypes.INTEGER, allowNull: false },
  punto: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 8 } },
  puntaje: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 10 } }
}, {
  tableName: 'chequeos',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['turno_id', 'punto'] }
  ]
});

module.exports = Chequeo;
