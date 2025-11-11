const container = require('../di/container.js');

function scopeDi(req, res, next) {
  req.container = container;
  next();
}

module.exports = scopeDi;
