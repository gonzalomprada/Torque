const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuariosModels.js');

class UsuariosController {
  constructor() {}

  // POST /usuarios/registrar
  async registrar(req, res) {
    try {
      const { nombre, email, password, rol } = req.body;

      if (!nombre || !email || !password || !rol) {
        return res.status(400).json({ err: 'nombre, email, password y rol son obligatorios' });
      }
      if (!['duenio', 'inspector', 'admin'].includes(rol)) {
        return res.status(400).json({ err: 'rol inválido' });
      }

      const ya = await Usuario.findOne({ where: { email } });
      if (ya) return res.status(409).json({ err: 'email ya registrado' });

      const hash = await bcrypt.hash(password, 10);
      const u = await Usuario.create({
        nombre,
        email,
        password_hash: hash,
        rol
      });

      return res.status(201).json({
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        rol: u.rol
      });
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  }

  // POST /usuarios/login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ err: 'email y password son obligatorios' });
      }

      const u = await Usuario.findOne({ where: { email } });
      if (!u) return res.status(401).json({ err: 'credenciales inválidas' });

      const ok = await bcrypt.compare(password, u.password_hash);
      if (!ok) return res.status(401).json({ err: 'credenciales inválidas' });

      const secret = process.env.JWT_SECRET || 'torque_dev_secret';
      const token = jwt.sign({ id: u.id, email: u.email, rol: u.rol }, secret, { expiresIn: '8h' });

      return res.status(200).json({
        token,
        usuario: { id: u.id, nombre: u.nombre, email: u.email, rol: u.rol }
      });
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  }

  // GET /usuarios/me  (protegido)
  async perfil(req, res) {
    try {
      const u = await Usuario.findByPk(req.user.id, {
        attributes: ['id', 'nombre', 'email', 'rol']
      });
      if (!u) return res.status(404).json({ err: 'usuario no encontrado' });
      return res.status(200).json(u);
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  }
}

module.exports = new UsuariosController();
