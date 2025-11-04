const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clave-secreta';

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (!token || !/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ msg: 'Token requerido o formato inválido' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, email, roles }
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido o expirado' });
  }
}

function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: 'No autorizado' });

    const roles = req.user.roles || [];
    const tienePermiso = rolesPermitidos.some((r) => roles.includes(r));
    if (!tienePermiso) {
      return res.status(403).json({ msg: 'Permiso denegado' });
    }

    next();
  };
}

module.exports = { auth, requireRole };
