// =============================================
// APLICACIÓN PRINCIPAL - TECHSTORE PRO BACKEND
// =============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter'); // ✨ NUEVO


console.log('🚀 Iniciando TechStore Pro Backend...');

// Crear aplicación Express
const app = express();

// =============================================
// MIDDLEWARE DE LOGGING PERSONALIZADO TECHSTORE
// =============================================
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress;
    
    // Identificar tipo de petición con iconos específicos
    let requestType = '📡';
    if (url.includes('/products')) requestType = '📱';
    if (url.includes('/users')) requestType = '👤';
    if (url.includes('/orders')) requestType = '🛒';
    if (url.includes('/auth')) requestType = '🔐';
    if (url.includes('/health')) requestType = '💚';
    
    console.log(`${requestType} ${timestamp} - ${method} ${url} - IP: ${ip}`);
    next();
});
// =============================================
// RATE LIMITING - PROTECCIÓN CONTRA ABUSO
// =============================================
// Aplicar rate limiting a todas las rutas de la API
app.use('/api/', generalLimiter);
console.log('🛡️  Rate Limiting activado: 100 peticiones/15min por IP');
// =============================================
// CONFIGURACIÓN CORS MEJORADA PARA TECHSTORE
// =============================================
app.use(cors({
    origin: [
        'http://localhost:3000',      // React desarrollo
        'http://127.0.0.1:5500',      // Live Server
        'http://localhost:8080',      // Webpack
        'http://localhost:5173',      // Vite
        'https://techstore-pro.vercel.app', // Producción (ejemplo)
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'] // Para paginación
}));

// =============================================
// MIDDLEWARE DE PARSEO OPTIMIZADO
// =============================================
// Aumentar límite para imágenes de productos
app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
        // Log para requests grandes (posibles uploads de imágenes)
        if (buf.length > 1000000) { // > 1MB
            console.log(`📁 Request grande detectado: ${(buf.length / 1024 / 1024).toFixed(2)}MB`);
        }
    }
}));

app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb' 
}));

// =============================================
// CONECTAR A MONGODB ATLAS
// =============================================
connectDB();

// =============================================
// RUTAS PRINCIPALES DE TECHSTORE PRO
// =============================================

// Ruta principal - Información mejorada de la API
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🏪 TechStore Pro API funcionando correctamente',
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        endpoints: {
            products: {
                description: 'Catálogo de productos tecnológicos',
                routes: {
                    list: 'GET /api/products',
                    details: 'GET /api/products/:id',
                    create: 'POST /api/products (Admin)',
                    update: 'PUT /api/products/:id (Admin)',
                    delete: 'DELETE /api/products/:id (Admin)',
                    categories: 'GET /api/products/categories',
                    featured: 'GET /api/products/featured',
                    search: 'GET /api/products/search?q=macbook'
                }
            },
            users: {
                description: 'Gestión de usuarios y perfiles',
                routes: {
                    register: 'POST /api/auth/register',
                    login: 'POST /api/auth/login',
                    profile: 'GET /api/users/profile',
                    list: 'GET /api/users (Admin)'
                }
            },
            orders: {
                description: 'Gestión de pedidos y compras',
                routes: {
                    create: 'POST /api/orders',
                    list: 'GET /api/orders',
                    details: 'GET /api/orders/:id',
                    userOrders: 'GET /api/orders/user/:userId'
                }
            },
            health: 'GET /api/health'
        },
        features: [
            'Catálogo completo de productos Apple y tecnología',
            'Sistema de autenticación seguro con JWT',
            'Gestión de pedidos en tiempo real',
            'Filtros avanzados por categoría y precio',
            'Búsqueda inteligente de productos',
            'Manejo profesional de errores',
            'Validaciones automáticas de datos',
            'Rate Limiting contra ataques de fuerza bruta'
        ]
    });
});

// Ruta de health check mejorada
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
            name: mongoose.connection.name || 'No conectado',
            host: mongoose.connection.host || 'N/A'
        },
        memory: {
            used: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            total: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`
        },
        uptime: {
            seconds: Math.floor(process.uptime()),
            formatted: `${Math.floor(process.uptime() / 60)}m ${Math.floor(process.uptime() % 60)}s`
        },
        middleware: {
            errorHandler: 'Activo',
            validation: 'Activo',
            cors: 'Configurado',
            logging: 'Personalizado',
            rateLimiting: 'Activo'
        }
    });
});

// =============================================
// RUTAS DE LA API - TECHSTORE PRO
// =============================================

// Rutas de productos
app.use('/api/products', require('./Routes/products'));
// Rutas de autenticación
app.use('/api/auth', require('./routes/auth'));

console.log('✅ Rutas API configuradas:');
console.log('   📱 /api/products - Gestión de productos');
console.log('   🔐 /api/auth - Autenticación y usuarios');
console.log('   🏥 /api/health - Estado del servidor');

// TODO: Futuras rutas
// app.use('/api/users', require('./routes/users'));
// app.use('/api/orders', require('./routes/orders'));
// app.use('/api/auth', require('./routes/auth'));
app.use(notFound);

// Middleware de manejo global de errores (siempre al final)
app.use(errorHandler);

module.exports = app;

/**
 * CONFIGURACIÓN COMPLETADA PARA TECHSTORE PRO ✅
 * 
 * Middleware implementado:
 * ✅ Logging personalizado con iconos por tipo de petición
 * ✅ CORS configurado para desarrollo y producción
 * ✅ Parseo de JSON con límites para imágenes
 * ✅ Rutas de información y health check mejoradas
 * ✅ Manejo global de errores profesional
 * ✅ Respuestas 404 personalizadas con sugerencias
 * 
 * Próximos pasos (Parte 3B):
 * 🎯 Crear controladores de productos
 * 🎯 Implementar rutas REST para productos
 * 🎯 Probar con Postman
 */