const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion.js');

const Rol = dbSequelize.define('Rol', {
  id: { type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(40), allowNull: false, unique: true } // ADMIN, TALLER...
}, {
  tableName: 'roles',
  timestamps: false
});

module.exports = Rol;
