-- =======================================
-- Torque - Init/Seed
-- =======================================

-- =============== ROLES ===============
CREATE TABLE IF NOT EXISTS roles (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(40) UNIQUE NOT NULL
);

INSERT INTO roles (nombre) VALUES
  ('ADMIN'),
  ('INSPECTOR')
ON CONFLICT (nombre) DO NOTHING;

-- ============== USUARIOS =============
CREATE TABLE IF NOT EXISTS usuarios (
  id           SERIAL PRIMARY KEY,
  nombre       VARCHAR(120) NOT NULL,
  email        VARCHAR(160) UNIQUE NOT NULL,
  hash_password TEXT NOT NULL,
  activo       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Usuario admin (pass: admin123)
INSERT INTO usuarios (nombre, email, hash_password)
VALUES ('Admin', 'admin@torque.local', '$2b$10$CRPRSe05iwSE.AuQNxAwS.inY.bboLtipqXYYdUi.ghCVzjZnL456')
ON CONFLICT (email) DO NOTHING;

-- Relación usuarios-roles
CREATE TABLE IF NOT EXISTS usuarios_roles (
  usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
  rol_id     INT REFERENCES roles(id)     ON DELETE CASCADE,
  PRIMARY KEY (usuario_id, rol_id)
);

-- Admin con roles ADMIN e INSPECTOR
INSERT INTO usuarios_roles (usuario_id, rol_id)
SELECT u.id, r.id FROM usuarios u, roles r
WHERE u.email='admin@torque.local' AND r.nombre IN ('ADMIN','INSPECTOR')
ON CONFLICT DO NOTHING;

-- ============== VEHICULOS =============

CREATE TABLE IF NOT EXISTS vehiculos (
  id            SERIAL PRIMARY KEY,
  matricula     VARCHAR(20) UNIQUE NOT NULL,   
  marca         VARCHAR(80) NOT NULL,
  modelo        VARCHAR(120) NOT NULL,
  anio          SMALLINT,
  propietario   VARCHAR(120),                  
  contacto      VARCHAR(160),                  
  created_at    TIMESTAMP DEFAULT NOW()
);

INSERT INTO vehiculos (matricula, marca, modelo, anio, propietario, contacto) VALUES
  ('AB123CD','Toyota','Hilux',2020,'Juan Pérez','juan@example.com'),
  ('AC987EF','Renault','Kangoo',2019,'María López','maria@example.com')
ON CONFLICT (matricula) DO NOTHING;

-- ============== TURNOS =================
-- Estados:
--   LIBRE: slot disponible para que un dueño lo elija
--   RESERVADO: elegido por el dueño (pendiente de confirmación)
--   CONFIRMADO: dueño confirmó
--   CANCELADO: cancelado
--   ATENDIDO: el turno se ejecutó (debe existir inspección)
CREATE TABLE IF NOT EXISTS turnos (
  id           SERIAL PRIMARY KEY,
  vehiculo_id  INT REFERENCES vehiculos(id) ON DELETE SET NULL, -- null si slot libre
  start_at     TIMESTAMP NOT NULL,
  estado       VARCHAR(15) NOT NULL DEFAULT 'LIBRE',
  created_at   TIMESTAMP DEFAULT NOW(),
  UNIQUE (start_at) -- evita doble booking del mismo horario
);

-- Slots iniciales "LIBRE" (ajustá fechas si querés)
INSERT INTO turnos (vehiculo_id, start_at, estado) VALUES
  (NULL, NOW() + INTERVAL '1 day' + INTERVAL '09:00', 'LIBRE'),
  (NULL, NOW() + INTERVAL '1 day' + INTERVAL '10:00', 'LIBRE'),
  (NULL, NOW() + INTERVAL '1 day' + INTERVAL '11:00', 'LIBRE'),
  (NULL, NOW() + INTERVAL '2 day' + INTERVAL '09:00', 'LIBRE'),
  (NULL, NOW() + INTERVAL '2 day' + INTERVAL '10:00', 'LIBRE'),
  (NULL, NOW() + INTERVAL '2 day' + INTERVAL '11:00', 'LIBRE')
ON CONFLICT DO NOTHING;

-- Un turno ya atendido para mostrar un ejemplo completo
-- (asignamos el turno más cercano y lo marcamos ATENDIDO)
DO $$
DECLARE
  v_id INT;
  t_id INT;
BEGIN
  SELECT id INTO v_id FROM vehiculos WHERE matricula='AB123CD';
  IF v_id IS NOT NULL THEN
    INSERT INTO turnos (vehiculo_id, start_at, estado)
    VALUES (v_id, NOW() - INTERVAL '1 day' + INTERVAL '09:00', 'ATENDIDO')
    ON CONFLICT DO NOTHING;

    SELECT id INTO t_id FROM turnos
      WHERE vehiculo_id = v_id AND estado='ATENDIDO'
      ORDER BY start_at DESC LIMIT 1;

    -- Creamos inspección y sus 8 ítems si el turno quedó insertado
    IF t_id IS NOT NULL THEN
      -- ============ INSPECCIONES ============
      -- Resultado:
      --   'SEGURO' si total >= 80
      --   'RECHEQUEO' si total < 40 o si algún ítem < 5
      --   En los demás casos, a definir por lógica de aplicación (normalmente RECHEQUEO)
      CREATE TABLE IF NOT EXISTS inspecciones (
        id            SERIAL PRIMARY KEY,
        turno_id      INT UNIQUE REFERENCES turnos(id) ON DELETE CASCADE,
        inspector_id  INT REFERENCES usuarios(id),
        total         SMALLINT,
        resultado     VARCHAR(12) NOT NULL,      -- 'SEGURO' | 'RECHEQUEO'
        observaciones TEXT,
        created_at    TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS inspeccion_items (
        id             SERIAL PRIMARY KEY,
        inspeccion_id  INT REFERENCES inspecciones(id) ON DELETE CASCADE,
        punto          SMALLINT NOT NULL,        -- 1..8
        nombre         VARCHAR(80) NOT NULL,
        puntaje        SMALLINT NOT NULL,        -- 1..10
        UNIQUE (inspeccion_id, punto),
        CHECK (punto BETWEEN 1 AND 8),
        CHECK (puntaje BETWEEN 1 AND 10)
      );

      -- Inserta inspección ejemplo (total 82 => SEGURO)
      INSERT INTO inspecciones (turno_id, inspector_id, total, resultado, observaciones)
      SELECT t_id,
             (SELECT id FROM usuarios WHERE email='admin@torque.local'),
             82,
             'SEGURO',
             'Chequeo general satisfactorio'
      ON CONFLICT (turno_id) DO NOTHING;

      -- 8 puntos (1..8). Ajustá los nombres si querés.
      INSERT INTO inspeccion_items (inspeccion_id, punto, nombre, puntaje)
      SELECT i.id, x.p, x.n, x.sc
      FROM inspecciones i,
      (VALUES
        (1,'Frenos',10),
        (2,'Suspensión',10),
        (3,'Dirección',9),
        (4,'Neumáticos',9),
        (5,'Luces',10),
        (6,'Chasis',10),
        (7,'Cinturones',12), -- este vendría 10, lo limitamos a 10 con CHECK; dejamos 9
        (8,'Emisiones',14)   -- idem
      ) AS x(p,n,sc)
      WHERE i.turno_id = t_id;

      -- Corrige puntajes fuera de rango si el CHECK bloqueó (por si la DB ya existía sin CHECK)
      UPDATE inspeccion_items SET puntaje = LEAST(GREATEST(puntaje,1),10)
      WHERE inspeccion_id = (SELECT id FROM inspecciones WHERE turno_id = t_id);
    END IF;
  END IF;
END$$;

-- Asegura existencia de tablas si no se ejecutó el bloque anterior (por orden)
CREATE TABLE IF NOT EXISTS inspecciones (
  id            SERIAL PRIMARY KEY,
  turno_id      INT UNIQUE REFERENCES turnos(id) ON DELETE CASCADE,
  inspector_id  INT REFERENCES usuarios(id),
  total         SMALLINT,
  resultado     VARCHAR(12) NOT NULL,
  observaciones TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inspeccion_items (
  id             SERIAL PRIMARY KEY,
  inspeccion_id  INT REFERENCES inspecciones(id) ON DELETE CASCADE,
  punto          SMALLINT NOT NULL,
  nombre         VARCHAR(80) NOT NULL,
  puntaje        SMALLINT NOT NULL,
  UNIQUE (inspeccion_id, punto),
  CHECK (punto BETWEEN 1 AND 8),
  CHECK (puntaje BETWEEN 1 AND 10)
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_turnos_estado       ON turnos (estado);
CREATE INDEX IF NOT EXISTS idx_turnos_start_at     ON turnos (start_at);
CREATE INDEX IF NOT EXISTS idx_items_inspeccion_id ON inspeccion_items (inspeccion_id);

