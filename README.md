# Torque - Trabajo Práctico Integrador

Alumno: Gonzalo Manuel Prada
Legajo: 0136007

## UML 

```mermaid

classDiagram
direction LR

class Usuario {
  +id: number
  +nombre: string
  +email: string
  +passwordHash: string
  +rol: string  // "duenio" | "inspector" | "admin"
}

class Vehiculo {
  +id: number
  +matricula: string
  +marca: string
  +modelo: string
  +anio: number
  +duenioId: number
}

class Turno {
  +id: number
  +vehiculoId: number
  +fecha: Date
  +estado: string // "pendiente" | "confirmado" | "completado"
}

class Chequeo {
  +id: number
  +turnoId: number
  +punto: number  // 1..8
  +puntaje: number // 1..10
}

class Resultado {
  +id: number
  +turnoId: number
  +total: number
  +estado: string // "seguro" | "rechequear"
  +observacion: string
}

Usuario "1" --o "many" Vehiculo : duenio
Vehiculo "1" --o "many" Turno : turnos
Turno "1" --o "8" Chequeo : items
Turno "1" --o "1" Resultado : resumen



```


```
Torque/
├─ app.js
├─ server.js
├─ .env
├─ package.json
├─ docker-compose.yml
├─ init.sql
└─ src/
   ├─ db/
   │  └─ conexion.js
   ├─ di/
   │  ├─ container.js
   │  └─ registrations.js
   ├─ middleware/
   │  ├─ authMiddleware.js
   │  └─ roleMiddleware.js
   ├─ models/
   │  ├─ usuarioModel.js
   │  ├─ vehiculoModel.js
   │  ├─ turnoModel.js
   │  ├─ chequeoModel.js
   │  └─ resultadoModel.js
   ├─ repositories/
   │  └─ vehiculoRepository.js
   ├─ services/
   │  └─ vehiculoService.js
   ├─ controllers/
   │  ├─ authController.js
   │  ├─ usuariosController.js
   │  ├─ vehiculosController.js
   │  ├─ turnosController.js
   │  ├─ chequeosController.js
   │  └─ resultadosController.js
   └─ routes/
      ├─ authRoutes.js
      ├─ usuariosRoutes.js
      ├─ vehiculosRoutes.js
      ├─ turnosRoutes.js
      ├─ chequeosRoutes.js
      └─ resultadosRoutes.js

```
