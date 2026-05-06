import express from 'express';
import productosRouter from './routes/productos.js';
import usuariosRouter from './routes/usuarios.js';
import ventasRouter from './routes/ventas.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/productos', productosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/ventas', ventasRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
