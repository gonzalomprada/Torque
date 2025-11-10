const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion');

const Turno = dbSequelize.define('Turno', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  hora: { type: DataTypes.STRING(5), allowNull: false }, // "09:00"
  estado: { // DISPONIBLE | RESERVADO | CONFIRMADO | CANCELADO
    type: DataTypes.ENUM('DISPONIBLE','RESERVADO','CONFIRMADO','CANCELADO'),
    allowNull: false,
    defaultValue: 'DISPONIBLE'
  },
  vehiculo_id: { type: DataTypes.BIGINT, allowNull: true }, // se completa al reservar/confirmar
  dominio_ingresado: { type: DataTypes.STRING(20), allowNull: true } // matrícula digitada por el usuario
}, {
  tableName: 'turnos',
  timestamps: false
});

module.exports = Turno;
