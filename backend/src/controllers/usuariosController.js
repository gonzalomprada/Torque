const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuariosModels.js');

class UsuariosController {

    constructor(){};

    // GET /api/v1/usuarios
    async listar(req, res) {
    try {
        const usuarios = await Usuario.findAll({
        order: [['id', 'ASC']]
        });
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al listar usuarios:', error);
        res.status(500).json({ message: 'Error interno al listar usuarios' });
    }
    }

    // GET /api/v1/usuarios/:id
    async obtener(req, res) {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error interno al obtener usuario' });
    }
    }

    // POST /api/v1/usuarios
    async crear(req, res) {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        const existente = await Usuario.findOne({ where: { email } });
        if (existente) {
        return res.status(409).json({ message: 'El email ya está registrado' });
        }

        const hash_password = await bcrypt.hash(password, 10);
        const nuevoUsuario = await Usuario.create({ nombre, email, hash_password });

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ message: 'Error interno al crear usuario' });
    }
    }

    // PUT /api/v1/usuarios/:id
    async actualizar(req, res) {
    try {
        const { id } = req.params;
        const { nombre, email, password, activo } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (email && email !== usuario.email) {
        const existe = await Usuario.findOne({ where: { email } });
        if (existe) {
            return res.status(409).json({ message: 'El email ya está en uso' });
        }
        }

        let hash_password = usuario.hash_password;
        if (password) {
        hash_password = await bcrypt.hash(password, 10);
        }

        await usuario.update({ nombre, email, hash_password, activo });

        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error interno al actualizar usuario' });
    }
    }

    // DELETE /api/v1/usuarios/:id
    async eliminar(req, res) {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await usuario.update({ activo: false });

        res.status(200).json({ message: 'Usuario dado de baja correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error interno al eliminar usuario' });
    }
    }
}

module.exports = new UsuariosController();

