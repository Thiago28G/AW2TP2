const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usuariosPath = path.join(__dirname, '../usuarios.json');
const ventasPath = path.join(__dirname, '../ventas.json');

function leerUsuarios() {
    return JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
}

function guardarUsuarios(usuarios) {
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
}

router.get('/', (req, res) => {
    const usuarios = leerUsuarios();
    const resultado = usuarios.map(({ contraseña, ...u }) => u);
    res.json(resultado);
});

router.get('/:id', (req, res) => {
    const usuarios = leerUsuarios();
    const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    const { contraseña, ...sinContraseña } = usuario;
    res.json(sinContraseña);
});

router.post('/login', (req, res) => {
    const { email, contraseña } = req.body;
    if (!email || !contraseña) return res.status(400).json({ mensaje: 'Email y contraseña son requeridos' });

    const usuarios = leerUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.contraseña === contraseña);
    if (!usuario) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    if (!usuario.activo) return res.status(403).json({ mensaje: 'La cuenta está inactiva' });

    const { contraseña: _, ...sinContraseña } = usuario;
    res.json({ mensaje: 'Login exitoso', usuario: sinContraseña });
});

router.post('/', (req, res) => {
    const usuarios = leerUsuarios();
    const yaExiste = usuarios.find(u => u.email === req.body.email);
    if (yaExiste) return res.status(409).json({ mensaje: 'Ya existe un usuario con ese email' });

    const nuevoId = Math.max(...usuarios.map(u => u.id)) + 1;
    const nuevo = { id: nuevoId, ...req.body, activo: true, verificado: false };
    usuarios.push(nuevo);
    guardarUsuarios(usuarios);

    const { contraseña, ...sinContraseña } = nuevo;
    res.status(201).json(sinContraseña);
});

router.put('/:id', (req, res) => {
    const usuarios = leerUsuarios();
    const index = usuarios.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    usuarios[index] = { ...usuarios[index], ...req.body, id: usuarios[index].id };
    guardarUsuarios(usuarios);
    const { contraseña, ...sinContraseña } = usuarios[index];
    res.json(sinContraseña);
});

router.delete('/:id', (req, res) => {
    const usuarios = leerUsuarios();
    const ventas = JSON.parse(fs.readFileSync(ventasPath, 'utf-8'));

    const idBuscado = parseInt(req.params.id);
    const tieneVentas = ventas.some(v => v.id_usuario === idBuscado);
    if (tieneVentas) {
        return res.status(409).json({ mensaje: 'No se puede eliminar el usuario porque tiene ventas asociadas. Eliminá primero las ventas correspondientes.' });
    }

    const index = usuarios.findIndex(u => u.id === idBuscado);
    if (index === -1) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const eliminado = usuarios.splice(index, 1)[0];
    guardarUsuarios(usuarios);
    const { contraseña, ...sinContraseña } = eliminado;
    res.json({ mensaje: 'Usuario eliminado', usuario: sinContraseña });
});

module.exports = router;
