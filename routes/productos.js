import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const productosPath = path.join(__dirname, '../productos.json');
const ventasPath = path.join(__dirname, '../ventas.json');

function leerProductos() {
    return JSON.parse(fs.readFileSync(productosPath, 'utf-8'));
}

function guardarProductos(productos) {
    fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));
}

router.get('/', (req, res) => {
    const productos = leerProductos();
    res.json(productos);
});

router.get('/:id', (req, res) => {
    const productos = leerProductos();
    const producto = productos.find(p => p.id === parseInt(req.params.id));
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
});

router.post('/filtrar', (req, res) => {
    const { categoria, precioMin, precioMax, disponible } = req.body;
    let productos = leerProductos();

    if (categoria) productos = productos.filter(p => p.categoria === categoria);
    if (precioMin !== undefined) productos = productos.filter(p => p.precio >= precioMin);
    if (precioMax !== undefined) productos = productos.filter(p => p.precio <= precioMax);
    if (disponible !== undefined) productos = productos.filter(p => p.disponible === disponible);

    res.json(productos);
});

router.post('/', (req, res) => {
    const productos = leerProductos();
    const nuevoId = Math.max(...productos.map(p => p.id)) + 1;
    const nuevo = { id: nuevoId, ...req.body };
    productos.push(nuevo);
    guardarProductos(productos);
    res.status(201).json(nuevo);
});

router.put('/:id', (req, res) => {
    const productos = leerProductos();
    const index = productos.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    productos[index] = { ...productos[index], ...req.body, id: productos[index].id };
    guardarProductos(productos);
    res.json(productos[index]);
});

router.delete('/:id', (req, res) => {
    const productos = leerProductos();
    const ventas = JSON.parse(fs.readFileSync(ventasPath, 'utf-8'));

    const idBuscado = parseInt(req.params.id);
    const estaEnVentas = ventas.some(v => v.productos.some(p => p.id_producto === idBuscado));
    if (estaEnVentas) {
        return res.status(409).json({ mensaje: 'No se puede eliminar el producto porque está asociado a una o más ventas' });
    }

    const index = productos.findIndex(p => p.id === idBuscado);
    if (index === -1) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    const eliminado = productos.splice(index, 1)[0];
    guardarProductos(productos);
    res.json({ mensaje: 'Producto eliminado', producto: eliminado });
});

export default router;
