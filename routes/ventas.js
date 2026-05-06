import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const ventasPath = path.join(__dirname, '../ventas.json');

function leerVentas() {
    return JSON.parse(fs.readFileSync(ventasPath, 'utf-8'));
}

function guardarVentas(ventas) {
    fs.writeFileSync(ventasPath, JSON.stringify(ventas, null, 2));
}

router.get('/', (req, res) => {
    const ventas = leerVentas();
    res.json(ventas);
});

router.get('/:id', (req, res) => {
    const ventas = leerVentas();
    const venta = ventas.find(v => v.id === parseInt(req.params.id));
    if (!venta) return res.status(404).json({ mensaje: 'Venta no encontrada' });
    res.json(venta);
});

router.post('/usuario', (req, res) => {
    const { id_usuario } = req.body;
    if (!id_usuario) return res.status(400).json({ mensaje: 'El campo id_usuario es requerido' });

    const ventas = leerVentas();
    const ventasDelUsuario = ventas.filter(v => v.id_usuario === id_usuario);
    if (ventasDelUsuario.length === 0) return res.status(404).json({ mensaje: 'No se encontraron ventas para ese usuario' });

    res.json(ventasDelUsuario);
});

router.post('/', (req, res) => {
    const ventas = leerVentas();
    const nuevoId = Math.max(...ventas.map(v => v.id)) + 1;
    const nueva = { id: nuevoId, fecha: new Date().toISOString(), ...req.body };
    ventas.push(nueva);
    guardarVentas(ventas);
    res.status(201).json(nueva);
});

router.put('/:id', (req, res) => {
    const ventas = leerVentas();
    const index = ventas.findIndex(v => v.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ mensaje: 'Venta no encontrada' });
    ventas[index] = { ...ventas[index], ...req.body, id: ventas[index].id };
    guardarVentas(ventas);
    res.json(ventas[index]);
});

export default router;
