const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Usuario, Rol } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'clave-secreta';
const JWT_EXP = process.env.JWT_EXP || '4h';

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ msg: 'Faltan credenciales' });
    }

    const usuario = await Usuario.findOne({
      where: { email },
      include: [{ model: Rol, as: 'roles', through: { attributes: [] } }],
    });

    if (!usuario) return res.status(401).json({ msg: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, usuario.hash_password);
    if (!ok) return res.status(401).json({ msg: 'Credenciales inválidas' });

    const roles = (usuario.roles || []).map((r) => r.nombre);

    const payload = { id: usuario.id, email: usuario.email, roles };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXP });

    return res.json({ token });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
