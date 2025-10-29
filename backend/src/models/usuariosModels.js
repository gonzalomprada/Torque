const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion.js');

const Usuario = dbSequelize.define('Usuario', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(160), allowNull: false, unique: true },
  hash_password: { type: DataTypes.TEXT, allowNull: false },
  activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: dbSequelize.literal('NOW()') }
}, {
  tableName: 'usuarios',
  timestamps: false
});

module.exports = Usuario;
