// backend/src/app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware de logging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// Middleware básico
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:5500',
        'http://localhost:8080'
    ],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Conexión a MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mi-ecommerce';
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ MongoDB conectado exitosamente');
        console.log(`📊 Base de datos: ${mongoose.connection.name}`);
        
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};

// Eventos de conexión MongoDB
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB desconectado');
});

mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconectado');
});

connectDB();

// Rutas básicas
app.get('/', (req, res) => {
    res.json({
        message: '🛒 API Mi-Ecommerce funcionando',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            productos: '/api/productos',
            carrito: '/api/carrito',
            usuarios: '/api/usuarios',
            pedidos: '/api/pedidos',
            auth: '/api/auth',
            health: '/api/health'
        },
        documentation: '/api/docs'
    });
});

// Ruta de health check
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const dbStatusText = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting'
    };

    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
            status: dbStatusText[dbStatus],
            name: mongoose.connection.name
        },
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// TODO: Aquí irán las rutas de la API
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/productos', require('./routes/productos'));
// app.use('/api/carrito', require('./routes/carrito'));
// app.use('/api/usuarios', require('./routes/usuarios'));
// app.use('/api/pedidos', require('./routes/pedidos'));

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    console.error(err.stack);
    
    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            error: 'Error de validación',
            details: errors
        });
    }
    
    // Error de duplicado de Mongoose
    if (err.code === 11000) {
        return res.status(400).json({
            error: 'Recurso duplicado',
            message: 'Ya existe un recurso con esos datos'
        });
    }
    
    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Token inválido',
            message: 'Token de autorización inválido'
        });
    }
    
    // Error genérico
    res.status(err.status || 500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal',
        timestamp: new Date().toISOString()
    });
});

// Ruta 404
app.all('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        message: `La ruta ${req.method} ${req.originalUrl} no existe`,
        timestamp: new Date().toISOString()
    });
});

module.exports = app;