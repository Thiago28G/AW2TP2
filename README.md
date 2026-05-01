# AW2 - Trabajo Práctico 2

Servidor Express.js con rutas para gestionar productos, usuarios y ventas de un e-commerce.

## Cómo ejecutar

```
npm install
node server.js
```

El servidor corre en `http://localhost:3000`

---

## Rutas disponibles

### Productos — `/api/productos`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/productos` | Devuelve todos los productos |
| GET | `/api/productos/:id` | Devuelve un producto por su ID |
| POST | `/api/productos` | Crea un nuevo producto |
| POST | `/api/productos/filtrar` | Filtra productos por categoría, precio y/o disponibilidad |
| PUT | `/api/productos/:id` | Actualiza un producto existente |
| DELETE | `/api/productos/:id` | Elimina un producto (solo si no tiene ventas asociadas) |

#### Ejemplo body para POST `/api/productos/filtrar`
```json
{
  "categoria": "Periféricos",
  "precioMin": 5000,
  "precioMax": 50000,
  "disponible": true
}
```

---

### Usuarios — `/api/usuarios`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/usuarios` | Devuelve todos los usuarios (sin contraseña) |
| GET | `/api/usuarios/:id` | Devuelve un usuario por su ID (sin contraseña) |
| POST | `/api/usuarios/login` | Autentica un usuario con email y contraseña |
| POST | `/api/usuarios` | Crea un nuevo usuario |
| PUT | `/api/usuarios/:id` | Actualiza un usuario existente |
| DELETE | `/api/usuarios/:id` | Elimina un usuario (solo si no tiene ventas asociadas) |

#### Ejemplo body para POST `/api/usuarios/login`
```json
{
  "email": "lucas.fernandez@email.com",
  "contraseña": "lucas1234"
}
```

---

### Ventas — `/api/ventas`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/ventas` | Devuelve todas las ventas |
| GET | `/api/ventas/:id` | Devuelve una venta por su ID |
| POST | `/api/ventas/usuario` | Devuelve todas las ventas de un usuario por su ID |
| POST | `/api/ventas` | Crea una nueva venta |
| PUT | `/api/ventas/:id` | Actualiza una venta existente (ej: marcar como pagada o enviada) |

#### Ejemplo body para POST `/api/ventas/usuario`
```json
{
  "id_usuario": 1
}
```
