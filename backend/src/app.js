// =============================================
// APLICACIÓN PRINCIPAL - TECHSTORE PRO BACKEND
// =============================================

require('dotenv').config(); // Cargar variables de entorno PRIMERO
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./Config/database');

console.log('🚀 Iniciando TechStore Pro Backend...');

// Crear aplicación Express
const app = express();

// =============================================
// MIDDLEWARE DE LOGGING
// =============================================
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress;
    
    console.log(`📡 ${timestamp} - ${method} ${url} - IP: ${ip}`);
    next();
});

// =============================================
// CONFIGURACIÓN CORS
// =============================================
app.use(cors({
    origin: [
        'http://localhost:3000',      // React
        'http://127.0.0.1:5500',      // Live Server
        'http://localhost:8080',      // Webpack
        'http://localhost:5173',      // Vite
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// =============================================
// MIDDLEWARE DE PARSEO
// =============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =============================================
// CONECTAR A MONGODB ATLAS
// =============================================
connectDB();

// =============================================
// RUTAS BÁSICAS
// =============================================

// Ruta principal - Información de la API
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🛍️ TechStore Pro API funcionando correctamente',
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api/health',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            auth: '/api/auth'
        }
    });
});

// Ruta de health check
app.get('/api/health', (req, res) => {
    const mongoose = require('mongoose');
    
    const dbStates = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting'
    };
    
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        service: 'TechStore Pro API',
        version: process.env.APP_VERSION || '1.0.0',
        database: {
            status: dbStates[mongoose.connection.readyState],
            name: mongoose.connection.name || 'No conectado'
        },
        uptime: `${Math.floor(process.uptime())} segundos`
    });
});

// =============================================
// MIDDLEWARE DE ERRORES
// =============================================
app.use((err, req, res, next) => {
    console.error('❌ Error capturado:', err.message);
    
    res.status(err.status || 500).json({
        success: false,
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal',
        timestamp: new Date().toISOString()
    });
});

// Ruta 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        message: `La ruta ${req.method} ${req.originalUrl} no existe`,
        timestamp: new Date().toISOString()
    });
});

module.exports = app;