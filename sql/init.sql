-- DROP SCHEMA IF EXISTS public CASCADE;
-- CREATE SCHEMA public;

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('duenio','inspector','admin'))
);

CREATE TABLE IF NOT EXISTS vehiculos (
  id SERIAL PRIMARY KEY,
  matricula VARCHAR(20) UNIQUE NOT NULL,
  marca VARCHAR(50) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  anio INT NOT NULL CHECK (anio >= 1950),
  duenio_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS turnos (
  id SERIAL PRIMARY KEY,
  vehiculo_id INT NOT NULL REFERENCES vehiculos(id) ON DELETE CASCADE,
  fecha TIMESTAMPTZ NOT NULL,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente','confirmado','completado'))
);

CREATE INDEX IF NOT EXISTS idx_turnos_fecha ON turnos(fecha);
CREATE INDEX IF NOT EXISTS idx_vehiculos_matricula ON vehiculos(matricula);

CREATE TABLE IF NOT EXISTS chequeos (
  id SERIAL PRIMARY KEY,
  turno_id INT NOT NULL REFERENCES turnos(id) ON DELETE CASCADE,
  punto INT NOT NULL CHECK (punto BETWEEN 1 AND 8),
  puntaje INT NOT NULL CHECK (puntaje BETWEEN 1 AND 10),
  UNIQUE (turno_id, punto)
);

CREATE TABLE IF NOT EXISTS resultados (
  id SERIAL PRIMARY KEY,
  turno_id INT NOT NULL UNIQUE REFERENCES turnos(id) ON DELETE CASCADE,
  total INT NOT NULL DEFAULT 0,
  estado VARCHAR(20) NOT NULL,
  observacion TEXT
);

-- Seed mínimo (passwords se setean luego vía app con bcrypt)
INSERT INTO usuarios (nombre, email, password_hash, rol)
VALUES
  ('Admin', 'admin@torque.test',  '$2a$10$K3oQK3oQK3oQK3oQK3oQkeTz9Yo5r0e2b8yQpQJx3Q9JZ9i7t2o6K', 'admin'),     -- hash dummy
  ('Inspector', 'inspector@torque.test', '$2a$10$K3oQK3oQK3oQK3oQK3oQkeTz9Yo5r0e2b8yQpQJx3Q9JZ9i7t2o6K', 'inspector'),
  ('Duenio Demo', 'duenio@torque.test',  '$2a$10$K3oQK3oQK3oQK3oQK3oQkeTz9Yo5r0e2b8yQpQJx3Q9JZ9i7t2o6K', 'duenio');

-- Vehículo del dueño
INSERT INTO vehiculos (matricula, marca, modelo, anio, duenio_id)
VALUES ('AA123BB', 'Toyota', 'Corolla', 2015, (SELECT id FROM usuarios WHERE email='duenio@torque.test'));

-- Turnos pendientes próximos (disponibilidad inicial)
INSERT INTO turnos (vehiculo_id, fecha, estado)
VALUES
  ((SELECT id FROM vehiculos WHERE matricula='AA123BB'), NOW() + INTERVAL '2 day', 'pendiente'),
  ((SELECT id FROM vehiculos WHERE matricula='AA123BB'), NOW() + INTERVAL '3 day', 'pendiente'),
  ((SELECT id FROM vehiculos WHERE matricula='AA123BB'), NOW() + INTERVAL '4 day', 'pendiente');


