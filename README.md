# Torque - Trabajo Práctico Integrador

Alumno: Gonzalo Manuel Prada
Legajo: 0136007

## Descripcion y alcance

Torque es un sistema backend para la gestión del estado de vehículos dentro de una flota. Permite administrar usuarios, roles, vehículos, tipos de estado, incidencias y un registro histórico automático de cambios de estado.

El sistema incluye: 
- API RESTfull en Node.js + Express. 
- Persistencia con PostgreSQL y manejado con Sequelize. 
- Autenticación JWT con roles. 
- Inyección de dependencias en Vehiculos. 

El objetivo de este sistema es proveer un backend que permita registrar, consultar, y administrar el estado de los vehiculos en una flota, junto al historial e incidencias asociadas. 

## Justificación de Arquitectura 

- Express: Framework simple y bien documentado. 
- Sequelize: Permite modelos tipados, validaciones y relaciones. 
- PostgreSQL: Motor estable y bien documentado, gran combinación con Sequelize. 
- Awilix: Permite independizar lógica de infraestructura. 

## Estructura del proyecto

```
Torque-backend/
├─ server.js               # Punto de entrada - inicia Express
├─ app.js                  # Middlewares generales y rutas
└─ src/
   ├─ db/
   │  ├─ conexion.js       # Configuración de Sequelize
   │  └─ init.sql          # Seed + schema de DB
   ├─ models/              # Modelos Sequelize
   ├─ controllers/         # Lógica de endpoints
   ├─ routes/              # Routers por recurso
   ├─ middleware/          # JWT + roles
   └─ di/                  # Inyección de Dependencias (Awilix)
       ├─ container.js
       ├─ vehiculoRepository.js
       ├─ vehiculoService.js
       └─ notificador.js

```

## Endpoints

## Autenticación
| Método | Endpoint              | Descripción            |
|--------|------------------------|--------------------------|
| POST   | /api/v1/auth/login     | Inicia sesión y devuelve JWT |

## Usuarios
| Método | Endpoint                | Descripción                  |
|--------|--------------------------|------------------------------|
| GET    | /api/v1/usuarios         | Listar usuarios              |
| POST   | /api/v1/usuarios         | Crear usuario                |
| GET    | /api/v1/usuarios/:id     | Obtener usuario por ID       |
| PUT    | /api/v1/usuarios/:id     | Actualizar usuario           |
| DELETE | /api/v1/usuarios/:id     | Eliminar usuario             |

## Vehículos  
| Método | Endpoint                  | Descripción                         |
|--------|----------------------------|-------------------------------------|
| GET    | /api/v1/vehiculos         | Listar vehículos                    |
| POST   | /api/v1/vehiculos         | Crear vehículo                      |
| GET    | /api/v1/vehiculos/:id     | Obtener vehículo por ID             |
| PUT    | /api/v1/vehiculos/:id     | Actualizar vehículo (registra evento de estado si cambia estado_actual_id) |
| DELETE | /api/v1/vehiculos/:id     | Eliminar vehículo                   |

## Estados de Vehículo (EstadoTipo)
| Método | Endpoint                | Descripción                      |
|--------|--------------------------|----------------------------------|
| GET    | /api/v1/estados         | Listar estados                   |
| POST   | /api/v1/estados         | Crear estado                     |
| GET    | /api/v1/estados/:id     | Obtener estado por ID            |
| PUT    | /api/v1/estados/:id     | Actualizar estado                |
| DELETE | /api/v1/estados/:id     | Eliminar estado                  |

## Incidencias
| Método | Endpoint                  | Descripción                  |
|--------|----------------------------|------------------------------|
| GET    | /api/v1/incidencias       | Listar incidencias           |
| POST   | /api/v1/incidencias       | Crear incidencia             |
| GET    | /api/v1/incidencias/:id   | Obtener incidencia por ID    |
| PUT    | /api/v1/incidencias/:id   | Actualizar incidencia        |
| DELETE | /api/v1/incidencias/:id   | Eliminar incidencia          |

## Guía de Ejecución

La ejecución requiere unicamente de docker + docker compose. 

En la raíz del proyecto, ejecutar el comando: 

```bash 
docker compose up -d
```
Esto levanta un PostreSQL con volumen persistente, inyecta un init.sql con datos a modo de prueba y expone la API de Node.js. 

| Servicio | URL                                                          | Descripción    |
| -------- | ------------------------------------------------------------ | -------------- |
| Backend  | [http://localhost:3000](http://localhost:3000)               | API Express    |
| API base | [http://localhost:3000/api/v1](http://localhost:3000/api/v1) | Endpoints REST |


## UML 

```mermaid
classDiagram
    %% ============================
    %% ENTIDADES DEL DOMINIO
    %% ============================
    class Vehiculo {
        +id : Integer
        +dominio : String
        +marca : String
        +modelo : String
        +anio : Integer
        +estado_actual_id : Integer
        +created_at : Date
    }

    class EstadoTipo {
        +id : Integer
        +codigo : String
        +nombre : String
        +orden : Integer
    }

    class EventoEstado {
        +id : Integer
        +vehiculo_id : Integer
        +estado_anterior_id : Integer?
        +estado_nuevo_id : Integer
        +motivo : String
        +usuario_id : Integer?
        +at : Date
    }

    class Usuario {
        +id : Integer
        +nombre : String
        +email : String
        +hash_password : String
        +activo : Boolean
        +created_at : Date
    }

    class Rol {
        +id : Integer
        +nombre : String
    }

    class Incidencia {
        +id : Integer
        +vehiculo_id : Integer
        +titulo : String
        +descripcion : String?
        +estado : String
        +creada_por : Integer
        +cerrada_por : Integer?
        +created_at : Date
        +closed_at : Date?
    }

    %% ==================================
    %% RELACIONES BASE DE DATOS
    %% ==================================

    EstadoTipo "1" --> "0..*" Vehiculo : estadoActual
    Vehiculo "1" --> "0..*" Incidencia : incidencias
    Usuario "1" --> "0..*" Incidencia : creador
    Usuario "1" --> "0..*" Incidencia : cerrador

    %% Eventos de estado (historial)
    Vehiculo "1" --> "0..*" EventoEstado : historialEstados
    EstadoTipo "1" --> "0..*" EventoEstado : estadoAnterior
    EstadoTipo "1" --> "0..*" EventoEstado : estadoNuevo
    Usuario "1" --> "0..*" EventoEstado : cambioRegistradoPor

    %% Usuarios y Roles
    Usuario "0..*" --> "0..*" Rol : usuarios_roles


    %% ==================================
    %% MODULO DE INYECCIÓN DE DEPENDENCIAS
    %% ==================================

    class VehiculoService {
        +listar()
        +obtener(id)
        +crear(data)
        +actualizar(id, data)
        +eliminar(id)
    }

    class VehiculoRepository {
        +findAll()
        +findById(id)
        +findByDominio(dominio)
        +create(data)
        +updateById(entity,data)
        +deleteById(entity)
        +crearEvento(...)
    }

    class Notificador {
        +vehiculoCreado()
        +vehiculoActualizado()
        +vehiculoEliminado()
        +avisarCambioEstado()
    }

    class Container {
        +vehiculoService
        +vehiculoRepository
        +notificador
    }

    Container --> VehiculoService : provide
    Container --> VehiculoRepository : provide
    Container --> Notificador : provide

    VehiculoService --> VehiculoRepository : usa
    VehiculoService --> Notificador : notifica
    VehiculoService --> EventoEstado : registra

```
