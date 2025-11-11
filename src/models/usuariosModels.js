const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion.js');

const Usuario = dbSequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(200), allowNull: false },
  rol: { type: DataTypes.STRING(20), allowNull: false } // 'duenio' | 'inspector' | 'admin'
}, {
  tableName: 'usuarios',
  timestamps: false
});

module.exports = Usuario;
