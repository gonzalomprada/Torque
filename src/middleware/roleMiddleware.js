function requireRole(...rolesPermitidos) {
    return (req, res, next) => {
      try {
        if (!req.user) return res.status(401).json({ err: 'no autenticado' });
        if (!rolesPermitidos.includes(req.user.rol)) {
          return res.status(403).json({ err: 'no autorizado' });
        }
        next();
      } catch (err) {
        return res.status(500).json({ err: err.message });
      }
    };
  }
  
  module.exports = { requireRole };
  