-- =======================================
-- Torque - Seed inicial de base de datos
-- =======================================

-- Roles
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(40) UNIQUE NOT NULL
);

INSERT INTO roles (nombre) VALUES
  ('ADMIN'),
  ('INSPECTOR'),
  ('TALLER')
ON CONFLICT (nombre) DO NOTHING;

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  hash_password TEXT NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usuario por defecto (password: admin123)
INSERT INTO usuarios (nombre, email, hash_password)
VALUES ('Admin', 'admin@torque.local', '$2a$10$Qz3t6xdjSnPXt1Ekx2m1eumrcXhz04ZIkf7fKZVbQpDkduIJkPfxm')
ON CONFLICT (email) DO NOTHING;

-- Tabla intermedia usuarios_roles
CREATE TABLE IF NOT EXISTS usuarios_roles (
  usuario_id INT REFERENCES usuarios(id),
  rol_id INT REFERENCES roles(id),
  PRIMARY KEY (usuario_id, rol_id)
);

-- Vincula el admin con el rol ADMIN
INSERT INTO usuarios_roles (usuario_id, rol_id)
SELECT u.id, r.id FROM usuarios u, roles r
WHERE u.email='admin@torque.local' AND r.nombre='ADMIN'
ON CONFLICT DO NOTHING;

-- Estados posibles
CREATE TABLE IF NOT EXISTS estados_tipo (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(30) UNIQUE NOT NULL,
  nombre VARCHAR(60) NOT NULL,
  orden SMALLINT DEFAULT 1
);

INSERT INTO estados_tipo (codigo, nombre, orden) VALUES
  ('ACTIVO','Activo',1),
  ('EN_TALLER','En taller',2),
  ('FUERA_SERVICIO','Fuera de servicio',3),
  ('BAJA','Baja',4)
ON CONFLICT (codigo) DO NOTHING;

-- Vehiculos
CREATE TABLE IF NOT EXISTS vehiculos (
  id SERIAL PRIMARY KEY,
  dominio VARCHAR(20) UNIQUE NOT NULL,
  marca VARCHAR(80) NOT NULL,
  modelo VARCHAR(120) NOT NULL,
  anio SMALLINT,
  estado_actual_id INT REFERENCES estados_tipo(id),
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO vehiculos (dominio, marca, modelo, anio, estado_actual_id)
SELECT 'AA123BB','Ford','Transit',2018, (SELECT id FROM estados_tipo WHERE codigo='ACTIVO')
WHERE NOT EXISTS (SELECT 1 FROM vehiculos WHERE dominio='AA123BB');

-- Incidencias
CREATE TABLE IF NOT EXISTS incidencias (
  id SERIAL PRIMARY KEY,
  vehiculo_id INT REFERENCES vehiculos(id),
  titulo VARCHAR(140) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(15) DEFAULT 'ABIERTA',
  creada_por INT REFERENCES usuarios(id),
  cerrada_por INT REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP
);

-- Historial de estados (no se llena en este seed)
CREATE TABLE IF NOT EXISTS eventos_estado (
  id SERIAL PRIMARY KEY,
  vehiculo_id INT REFERENCES vehiculos(id),
  estado_anterior_id INT REFERENCES estados_tipo(id),
  estado_nuevo_id INT REFERENCES estados_tipo(id),
  motivo TEXT,
  usuario_id INT REFERENCES usuarios(id),
  at TIMESTAMP DEFAULT NOW()
);
