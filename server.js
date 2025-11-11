require('dotenv').config();
const app = require('./app.js');
const dbSequelize = require('./src/db/conexion.js');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await dbSequelize.authenticate();
    console.log('DB conectada.');
    app.listen(PORT, () => {
      console.log(`Torque API en puerto ${PORT}`);
    });
  } catch (err) {
    console.error('Error de conexión a DB:', err.message);
    process.exit(1);
  }
})();
