// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static('frontend'));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Manejar errores después de la conexión inicial
mongoose.connection.on('error', (err) => {
    console.error('Error después de la conexión inicial a MongoDB:', err);
});

// Rutas
app.use('/api/users', userRoutes);
app.use('/api', taskRoutes);
app.use('/api', weatherRoutes);

// Ruta de ejemplo
app.get('/', (req, res) => {
    res.send('¡Servidor de API funcionando correctamente!');
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});