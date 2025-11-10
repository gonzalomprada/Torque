const { DataTypes } = require('sequelize');
const dbSequelize = require('../db/conexion');

const Inspeccion = dbSequelize.define('Inspeccion', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  turno_id: { type: DataTypes.BIGINT, allowNull: false },
  vehiculo_id: { type: DataTypes.BIGINT, allowNull: false },
  inspector_id: { type: DataTypes.BIGINT, allowNull: true }, // Usuario con rol adecuado
  total_puntos: { type: DataTypes.SMALLINT, allowNull: true }, // 0..80
  estado: { // EN_PROCESO | APROBADO | RECHEQUEO
    type: DataTypes.ENUM('EN_PROCESO','APROBADO','RECHEQUEO'),
    allowNull: false,
    defaultValue: 'EN_PROCESO'
  },
  observacion: { type: DataTypes.TEXT, allowNull: true },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: dbSequelize.literal('NOW()') }
}, {
  tableName: 'inspecciones',
  timestamps: false
});

module.exports = Inspeccion;
