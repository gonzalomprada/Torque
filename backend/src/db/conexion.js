const { Sequelize } = require('sequelize');

const dbSequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

// Test de conexión
(async () => {
  try {
    await dbSequelize.authenticate();
    console.log('Conexión con Sequelize exitosa');
  } catch (err) {
    console.error('Error de conexión Sequelize:', err?.message || err);
  }
})();

module.exports = dbSequelize;
