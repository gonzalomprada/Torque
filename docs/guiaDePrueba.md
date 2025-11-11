# Guía de prueba funcionalidades TORQUE

En este documento, dejo a modo de comodidad del profesor un flujo completo de prueba para validar las funcionalidades del proyecto. La API utiliza autenticación por JWT, por lo que en algunos casos es necesario utilizar dentro de postman la funcionalidad de Autorization: Bearer (token).

1. Registro de usuario 
```
{
  "nombre": "Dueño Demo",
  "email": "duenio@example.com",
  "password": "123456",
  "rol": "duenio"
}
```

2. Login de usuario 

```
{
  "email": "duenio@example.com",
  "password": "123456"
}
```

3. Registrar un vehículo 
Authorization: Bearer TOKEN_DUENIO
```
{
  "matricula": "AA123BB",
  "marca": "Toyota",
  "modelo": "Corolla",
  "anio": 2019
}
```

4. Consultar disponibilidad de turnos 

GET http://localhost:3000/api/v1/turnos/disponibilidad?fecha=2025-11-15
Authorization: Bearer TOKEN_DUENIO
Debería contestar algo como: 

```
{
    "fecha": "2025-11-15\n",
    "cupoDiario": 10,
    "reservados": 0,
    "disponibles": 10,
    "disponible": true
}
```

5. Solicitar un turno
Authorization: Bearer TOKEN_DUENIO
```
{
  "matricula": "AA123BB",
  "fecha": "2025-11-15T10:00:00.000Z"
}
```

6. Registrar usuario inspector 

```
{
  "nombre": "Inspector Demo",
  "email": "inspector@example.com",
  "password": "123456",
  "rol": "inspector"
}
```

7. Login

```
{
  "email": "inspector@example.com",
  "password": "123456"
}
```

8. Inspector confirma el turno 

POST http://localhost:3000/api/v1/turnos/id-turno/confirmar
Authorization: Bearer TOKEN_INSPECTOR

9. Ingresar puntos (Hasta 8)
Authorization: Bearer TOKEN_INSPECTOR

```
{ "turno_id": 1, "punto": 1, "puntaje": 10 }
```

Cuando se cargan los 8 ítems, el sistema:

✅ calcula el total
✅ determina si es "seguro" o "rechequear"
✅ cierra el turno como "completado"
✅ genera un registro en resultados

10. Dueño confirma el resultado 

GET /resultados/turno/1
Authorization: Bearer TOKEN_DUENIO
Ejemplo: 
``` 
{
  "turno_id": 1,
  "total": 80,
  "estado": "seguro",
  "observacion": null
}
```