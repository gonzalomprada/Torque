const { createContainer, asClass, asValue } = require('awilix');
const dbSequelize = require('../db/conexion.js');
const { Vehiculo } = require('../models');

// Repositorio
class VehiculoRepository {
  constructor({ VehiculoModel }) {
    this.Vehiculo = VehiculoModel;
  }
  findAll() { return this.Vehiculo.findAll(); }
  findById(id) { return this.Vehiculo.findByPk(id); }
  create(data) { return this.Vehiculo.create(data); }
  update(id, data) { return this.Vehiculo.update(data, { where: { id } }); }
  delete(id) { return this.Vehiculo.destroy({ where: { id } }); }
  findByMatricula(matricula) { return this.Vehiculo.findOne({ where: { matricula } }); }
}

// Servicio
class VehiculoService {
  constructor({ vehiculoRepository }) {
    this.repo = vehiculoRepository;
  }

  async listar() {
    return this.repo.findAll();
  }

  async crear(payload) {
    const { matricula, marca, modelo, anio, duenioId } = payload;
    if (!matricula || !marca || !modelo || !anio) {
      throw new Error('Campos requeridos: matricula, marca, modelo, anio');
    }
    const existente = await this.repo.findByMatricula(matricula);
    if (existente) throw new Error('La matrícula ya existe');
    return this.repo.create({ matricula, marca, modelo, anio, duenioId: duenioId || null });
  }

  async obtener(id) {
    const v = await this.repo.findById(id);
    if (!v) throw new Error('Vehículo no encontrado');
    return v;
  }

  async actualizar(id, data) {
    await this.obtener(id); // valida existencia
    if (data.matricula) {
      const clash = await this.repo.findByMatricula(data.matricula);
      if (clash && clash.id !== Number(id)) throw new Error('La matrícula ya existe en otro vehículo');
    }
    await this.repo.update(id, data);
    return this.repo.findById(id);
  }

  async eliminar(id) {
    await this.obtener(id); // valida existencia
    await this.repo.delete(id);
    return { ok: true };
  }
}

// Controller
class VehiculosController {
  constructor({ vehiculoService }) {
    this.service = vehiculoService;

    this.consultar = this.consultar.bind(this);
    this.ingresar = this.ingresar.bind(this);
    this.consultarId = this.consultarId.bind(this);
    this.actualizarId = this.actualizarId.bind(this);
    this.eliminarId = this.eliminarId.bind(this);
  }

  async consultar(req, res) {
    try {
      const data = await this.service.listar();
      res.status(200).json(data);
    } catch (err) { res.status(500).json({ err: err.message }); }
  }

  async ingresar(req, res) {
    try {
      const creado = await this.service.crear(req.body);
      res.status(201).json(creado);
    } catch (err) { res.status(400).json({ err: err.message }); }
  }

  async consultarId(req, res) {
    try {
      const { id } = req.params;
      const data = await this.service.obtener(id);
      res.status(200).json(data);
    } catch (err) { res.status(404).json({ err: err.message }); }
  }

  async actualizarId(req, res) {
    try {
      const { id } = req.params;
      const actualizado = await this.service.actualizar(id, req.body);
      res.status(200).json(actualizado);
    } catch (err) { res.status(400).json({ err: err.message }); }
  }

  async eliminarId(req, res) {
    try {
      const { id } = req.params;
      const r = await this.service.eliminar(id);
      res.status(200).json(r);
    } catch (err) { res.status(404).json({ err: err.message }); }
  }
}

const container = createContainer();

// Registro valores y clases
container.register({
  SequelizeInstance: asValue(dbSequelize),
  VehiculoModel: asValue(Vehiculo),
  vehiculoRepository: asClass(VehiculoRepository).singleton(),
  vehiculoService: asClass(VehiculoService).singleton(),
  vehiculosController: asClass(VehiculosController).singleton()
});

module.exports = container;
