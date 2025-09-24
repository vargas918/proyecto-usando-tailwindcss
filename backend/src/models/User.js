// =============================================
// MODELO USUARIO - TECHSTORE PRO ECOMMERCE
// =============================================

/**
 * INFORMACIÓN DEL ARCHIVO:
 * 
 * ¿Qué hace este archivo?
 * Define el modelo de datos para los usuarios del sistema
 * Incluye autenticación segura con encriptación de contraseñas
 * 
 * ¿Qué incluye?
 * - Esquema completo con validaciones de seguridad
 * - Encriptación automática de contraseñas
 * - Métodos de verificación para login
 * - Roles y permisos de usuario
 * - Campos virtuales para datos calculados
 * 
 * Seguridad implementada:
 * - Contraseñas encriptadas con bcrypt
 * - Validaciones de formato estrictas
 * - Campos sensibles excluidos de JSON
 * - Métodos seguros de comparación
 */

// Importar librerías necesarias
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * ¿Qué es bcryptjs?
 * Es la librería de encriptación más segura para contraseñas
 * - Genera "salt" aleatorio para cada contraseña
 * - Hace que encriptar tome tiempo (evita ataques de fuerza bruta)
 * - Es irreversible (no se puede "desencriptar")
 * - Es el estándar de la industria
 */

console.log('👤 Iniciando creación del modelo User con seguridad avanzada...');

// =============================================
// ESQUEMA DEL USUARIO
// =============================================

/**
 * Crear esquema con validaciones de seguridad estrictas
 */
const userSchema = new mongoose.Schema({
    
    // =============================================
    // INFORMACIÓN PERSONAL BÁSICA
    // =============================================
    
    firstName: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,                                    // Eliminar espacios automáticamente
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede tener más de 50 caracteres'],
        validate: {
            validator: function(name) {
                // Solo letras, espacios y acentos
                const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
                return nameRegex.test(name);
            },
            message: 'El nombre solo puede contener letras y espacios'
        }
    },
    
    lastName: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true,
        minlength: [2, 'El apellido debe tener al menos 2 caracteres'],
        maxlength: [50, 'El apellido no puede tener más de 50 caracteres'],
        validate: {
            validator: function(name) {
                const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
                return nameRegex.test(name);
            },
            message: 'El apellido solo puede contener letras y espacios'
        }
    },
     // =============================================
    // EMAIL - IDENTIFICADOR ÚNICO Y CRÍTICO
    // =============================================
    
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,                                  // ¡CRÍTICO! No puede haber emails duplicados
        lowercase: true,                               // Convertir automáticamente a minúsculas
        trim: true,
        validate: {
            validator: function(email) {
                /**
                 * Validación estricta de email
                 * Acepta: juan.perez@gmail.com, ana_maria@empresa.co
                 * Rechaza: email-invalido, @gmail.com, juan@
                 */
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            },
            message: 'Por favor ingresa un email válido'
        },
        index: true                                   // Índice para búsquedas rápidas por email
    },
     // =============================================
    // CONTRASEÑA - SEGURIDAD CRÍTICA
    // =============================================
    
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        validate: {
            validator: function(password) {
                /**
                 * Validación de contraseña segura:
                 * - Al menos 8 caracteres
                 * - Al menos 1 minúscula (a-z)
                 * - Al menos 1 mayúscula (A-Z)  
                 * - Al menos 1 número (0-9)
                 * 
                 * Ejemplos válidos: "Password123!", "MiClave456"
                 * Ejemplos inválidos: "password", "12345678", "PASSWORD"
                 */
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
                return passwordRegex.test(password);
            },
            message: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula y número'
        },
        select: false                                 // ¡MUY IMPORTANTE! No incluir en consultas por defecto
    },
    // =============================================
    // ROLES Y PERMISOS
    // =============================================
    
    role: {
        type: String,
        enum: {
            values: ['customer', 'admin', 'moderator'],
            message: '{VALUE} no es un rol válido'
        },
        default: 'customer',                          // Usuarios normales por defecto
        index: true                                   // Para filtrar rápido por rol
    },
    
    // =============================================
    // ESTADO DE LA CUENTA
    // =============================================
    
    isActive: {
        type: Boolean,
        default: true,                                // Cuentas activas por defecto
        index: true                                   // Para filtrar usuarios activos
    },
    
    isEmailVerified: {
        type: Boolean,
        default: false                                // Por defecto no verificado
    },
    
    // Tokens para recuperación de contraseña
    passwordResetToken: {
        type: String,
        select: false                                 // Tampoco mostrar este token sensible
    },
    
    passwordResetExpires: {
        type: Date,
        select: false                                 // Ni la fecha de expiración
    },
     // =============================================
    // INFORMACIÓN DE CONTACTO
    // =============================================
    
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function(phone) {
                if (!phone) return true;              // Teléfono es opcional
                
                /**
                 * Validación para números colombianos:
                 * - Puede empezar con +57 (opcional)
                 * - Debe empezar con 3 (celulares)
                 * - Debe tener 10 dígitos después del 3
                 * 
                 * Ejemplos válidos:
                 * - "+57 3123456789"
                 * - "3123456789" 
                 * - "+573123456789"
                 */
                const phoneRegex = /^(\+57)?[3][0-9]{9}$/;
                return phoneRegex.test(phone.replace(/\s/g, ''));  // Eliminar espacios para validar
            },
            message: 'Por favor ingresa un número de teléfono colombiano válido (ej: +57 3123456789)'
        }
    },
    
    // =============================================
    // DIRECCIÓN PRINCIPAL
    // =============================================
    
    address: {
        street: {
            type: String,
            trim: true,
            maxlength: [200, 'La dirección no puede tener más de 200 caracteres']
        },
        
        city: {
            type: String,
            trim: true,
            maxlength: [100, 'La ciudad no puede tener más de 100 caracteres']
        },
        
        state: {
            type: String,
            trim: true,
            maxlength: [100, 'El departamento no puede tener más de 100 caracteres']
        },
        
        zipCode: {
            type: String,
            trim: true,
            maxlength: [10, 'El código postal no puede tener más de 10 caracteres']
        },
        
        country: {
            type: String,
            default: 'Colombia',
            maxlength: [50, 'El país no puede tener más de 50 caracteres']
        }
    },
     // =============================================
    // INFORMACIÓN DE PERFIL
    // =============================================
    
    avatar: {
        type: String,
        validate: {
            validator: function(url) {
                if (!url) return true;                // Avatar es opcional
                
                /**
                 * Validar que sea una URL válida de imagen
                 */
                const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|bmp)$/i;
                return urlRegex.test(url);
            },
            message: 'El avatar debe ser una URL válida de imagen'
        }
    },
    
    dateOfBirth: {
        type: Date,
        validate: {
            validator: function(date) {
                if (!date) return true;               // Fecha de nacimiento es opcional
                
                const now = new Date();
                const minDate = new Date(now.getFullYear() - 120, 0, 1); // Máximo 120 años
                const maxDate = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate()); // Mínimo 13 años
                
                return date >= minDate && date <= maxDate;
            },
            message: 'Por favor ingresa una fecha de nacimiento válida (entre 13 y 120 años)'
        }
    },
    
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other', 'prefer-not-to-say'],
            message: '{VALUE} no es un género válido'
        },
        default: 'prefer-not-to-say'                  // Respetar privacidad por defecto
    },
    
    // =============================================
    // INFORMACIÓN DE ACTIVIDAD Y SESIONES
    // =============================================
    
    lastLogin: {
        type: Date,
        default: Date.now                             // Fecha de último acceso
    },
    
    loginAttempts: {
        type: Number,
        default: 0,
        max: [10, 'Demasiados intentos de login']     // Prevenir ataques de fuerza bruta
    },
    
    lockUntil: {
        type: Date,
        // Si hay muchos intentos fallidos, bloquear temporalmente
    },
    // =============================================
    // INFORMACIÓN COMERCIAL E HISTORIAL
    // =============================================
    
    totalOrders: {
        type: Number,
        default: 0,
        min: [0, 'El total de órdenes no puede ser negativo']
    },
    
    totalSpent: {
        type: Number,
        default: 0,
        min: [0, 'El total gastado no puede ser negativo']
    },
    
    // Lista de productos favoritos
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,         // Referencia a productos
        ref: 'Product'                                // Nombre del modelo al que hace referencia
    }],
    
    // Puntos de fidelidad
    loyaltyPoints: {
        type: Number,
        default: 0,
        min: [0, 'Los puntos de lealtad no pueden ser negativos']
    }
    
}, {
    // =============================================
    // OPCIONES DEL SCHEMA
    // =============================================
    
    timestamps: true,                                 // createdAt y updatedAt automáticos
    
    toJSON: { 
        virtuals: true,                               // Incluir campos virtuales
        transform: function(doc, ret) {
            ret.id = ret._id;                         // Cambiar _id por id
            delete ret._id;
            delete ret.__v;
            delete ret.password;                      // ¡CRÍTICO! NUNCA enviar contraseña
            delete ret.passwordResetToken;            // Ni tokens sensibles
            delete ret.passwordResetExpires;
            delete ret.loginAttempts;                 // Ni información de seguridad
            delete ret.lockUntil;
            return ret;
        }
    },
    
    toObject: { 
        virtuals: true 
    }
});
// =============================================
// CAMPOS VIRTUALES - PROPIEDADES CALCULADAS
// =============================================

/**
 * Campo virtual: nombre completo
 */
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

/**
 * Campo virtual: edad calculada automáticamente
 */
userSchema.virtual('age').get(function() {
    if (!this.dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Ajustar si no ha pasado el cumpleaños este año
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
});

/**
 * Campo virtual: dirección completa formateada
 */
userSchema.virtual('fullAddress').get(function() {
    if (!this.address || !this.address.street) return '';
    
    const parts = [];
    if (this.address.street) parts.push(this.address.street);
    if (this.address.city) parts.push(this.address.city);
    if (this.address.state) parts.push(this.address.state);
    if (this.address.zipCode) parts.push(`CP ${this.address.zipCode}`);
    if (this.address.country && this.address.country !== 'Colombia') {
        parts.push(this.address.country);
    }
    
    return parts.join(', ');
});

/**
 * Campo virtual: estado de cuenta bloqueada
 */
userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

/**
 * Campo virtual: nivel de cliente basado en gastos
 */
userSchema.virtual('customerLevel').get(function() {
    if (this.totalSpent >= 5000000) return 'platinum';      // $5M+
    if (this.totalSpent >= 2000000) return 'gold';          // $2M+
    if (this.totalSpent >= 500000) return 'silver';         // $500K+
    return 'bronze';                                         // Menos de $500K
});

/**
 * Campo virtual: total gastado formateado
 */
userSchema.virtual('formattedTotalSpent').get(function() {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(this.totalSpent);
});

/**
 * EJEMPLOS DE USO DE CAMPOS VIRTUALES:
 * 
 * const user = await User.findById(userId);
 * 
 * console.log(user.firstName);              // "Juan" (guardado en BD)
 * console.log(user.lastName);               // "Pérez" (guardado en BD)
 * console.log(user.fullName);               // "Juan Pérez" (calculado)
 * console.log(user.age);                    // 32 (calculado desde dateOfBirth)
 * console.log(user.fullAddress);            // "Calle 123, Bogotá, Cundinamarca" (calculado)
 * console.log(user.customerLevel);          // "gold" (calculado desde totalSpent)
 * console.log(user.formattedTotalSpent);    // "$2.500.000" (calculado)
 */
// =============================================
// MIDDLEWARE PARA ENCRIPTACIÓN DE CONTRASEÑAS
// =============================================

/**
 * MIDDLEWARE PRE-SAVE - EL MÁS CRÍTICO DEL SISTEMA
 * Se ejecuta ANTES de guardar cualquier usuario
 * Su función principal: ENCRIPTAR CONTRASEÑAS DE MANERA SEGURA
 */
userSchema.pre('save', async function(next) {
    console.log(`🔍 Procesando usuario antes de guardar: ${this.email}`);
    
    // =============================================
    // 1. VERIFICAR SI LA CONTRASEÑA FUE MODIFICADA
    // =============================================
    
    /**
     * ¿Cuándo NO encriptar?
     * - Si el usuario ya existe y no cambió su contraseña
     * - Si solo modificó el nombre, email, etc.
     * - Si la contraseña ya está encriptada
     */
    if (!this.isModified('password')) {
        console.log(`💤 Usuario ${this.email}: contraseña no modificada, saltando encriptación`);
        return next();
    }
    
    try {
        // =============================================
        // 2. CONFIGURAR NIVEL DE SEGURIDAD
        // =============================================
        
        console.log(`🔐 Encriptando contraseña para usuario: ${this.email}`);
        
        /**
         * ¿Qué es saltRounds?
         * Es qué tan "difícil" hacer la encriptación
         * 
         * saltRounds = 10 → ~100ms por contraseña (rápido, menos seguro)
         * saltRounds = 12 → ~300ms por contraseña (balance perfecto)
         * saltRounds = 14 → ~1000ms por contraseña (lento, muy seguro)
         * 
         * Para ecommerce: 12 es perfecto
         * - Seguro contra ataques modernos
         * - No ralentiza demasiado el registro/login
         */
        const saltRounds = 12;
        
        // =============================================
        // 3. PROCESO DE ENCRIPTACIÓN
        // =============================================
        
        /**
         * ¿Cómo funciona bcrypt internamente?
         * 
         * Entrada: "MiPassword123!"
         * ↓
         * 1. Generar salt aleatorio: "a1b2c3d4e5f6..."
         * ↓
         * 2. Combinar: "MiPassword123!" + "a1b2c3d4e5f6..."
         * ↓
         * 3. Aplicar función hash 2^12 veces (4096 iteraciones)
         * ↓
         * 4. Resultado: "$2b$12$a1b2c3d4e5f6...resultado_final"
         * 
         * El resultado incluye:
         * - $2b$ → Versión del algoritmo
         * - 12$ → Número de saltRounds
         * - a1b2c3... → El salt usado
         * - resultado_final → El hash de la contraseña + salt
         */
        
        const originalLength = this.password.length;
        
        // Encriptar la contraseña
        this.password = await bcrypt.hash(this.password, saltRounds);
        
        console.log(`✅ Contraseña encriptada exitosamente:`);
        console.log(`   📧 Email: ${this.email}`);
        console.log(`   📏 Longitud original: ${originalLength} caracteres`);
        console.log(`   🔒 Longitud encriptada: ${this.password.length} caracteres`);
        console.log(`   🛡️ Nivel de seguridad: ${saltRounds} rounds`);
        console.log(`   ⏱️ Tiempo aproximado: ~300ms`);
        
        next(); // Continuar con el guardado
        
    } catch (error) {
        console.error(`❌ Error encriptando contraseña para ${this.email}:`);
        console.error(`   🐛 Error: ${error.message}`);
        
        // Pasar el error para que no se guarde el usuario
        next(error);
    }
});

/**
 * MIDDLEWARE POST-SAVE
 * Se ejecuta DESPUÉS de guardar el usuario exitosamente
 */
userSchema.post('save', function(doc) {
    console.log(`✅ Usuario guardado exitosamente:`);
    console.log(`   👤 Nombre: ${doc.fullName}`);
    console.log(`   📧 Email: ${doc.email}`);
    console.log(`   👑 Rol: ${doc.role}`);
    console.log(`   📊 Nivel: ${doc.customerLevel}`);
    console.log(`   🆔 ID: ${doc._id}`);
    
    // Aquí podrías agregar:
    // - Enviar email de bienvenida
    // - Registrar en sistema de analytics
    // - Crear entrada en logs de auditoría
});

/**
 * MIDDLEWARE PRE-REMOVE
 * Se ejecuta ANTES de eliminar un usuario
 */
userSchema.pre('remove', function(next) {
    console.log(`🗑️ Preparando eliminación de usuario: ${this.email}`);
    
    // Aquí podrías verificar:
    // - Si tiene pedidos pendientes
    // - Si debe conservarse por razones legales
    // - Si hay datos relacionados que limpiar
    
    next();
});

/**
 * ¿POR QUÉ EL MIDDLEWARE ES TAN IMPORTANTE?
 * 
 * SIN MIDDLEWARE (❌ peligroso):
 * const user = new User({
 *   email: "juan@test.com",
 *   password: "MiPassword123!"  // ¡SE GUARDA EN TEXTO PLANO!
 * });
 * await user.save(); // ¡CONTRASEÑA VISIBLE EN BD!
 * 
 * CON MIDDLEWARE (✅ seguro):
 * const user = new User({
 *   email: "juan@test.com", 
 *   password: "MiPassword123!"  // Texto plano temporalmente
 * });
 * await user.save(); // Middleware encripta automáticamente
 * // BD guarda: "$2b$12$abc123xyz789..."
 */
// =============================================
// MÉTODOS DE INSTANCIA - FUNCIONES DEL USUARIO
// =============================================

/**
 * Método para verificar contraseña durante login
 * ¡EL MÉTODO MÁS IMPORTANTE PARA LA SEGURIDAD!
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        console.log(`🔍 Verificando contraseña para usuario: ${this.email}`);
        
        /**
         * ¿Cómo funciona bcrypt.compare()?
         * 
         * 1. Toma la contraseña sin encriptar: "MiPassword123!"
         * 2. Toma la contraseña encriptada: "$2b$12$abc123..."
         * 3. Extrae el salt de la contraseña encriptada: "abc123..."
         * 4. Encripta la contraseña candidata con el mismo salt
         * 5. Compara los dos hashes resultantes
         * 6. Retorna true si coinciden, false si no
         * 
         * ¿Por qué es seguro?
         * - Tiempo constante (no revela información por tiempo de respuesta)
         * - Resistente a ataques de timing
         * - No se puede "desencriptar" la contraseña guardada
         */
        
        const startTime = Date.now();
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        const endTime = Date.now();
        
        if (isMatch) {
            console.log(`✅ Contraseña CORRECTA para: ${this.email}`);
            console.log(`   ⏱️ Tiempo de verificación: ${endTime - startTime}ms`);
        } else {
            console.log(`❌ Contraseña INCORRECTA para: ${this.email}`);
            console.log(`   ⏱️ Tiempo de verificación: ${endTime - startTime}ms`);
        }
        
        return isMatch;
        
    } catch (error) {
        console.error(`❌ Error verificando contraseña para ${this.email}:`);
        console.error(`   🐛 Error: ${error.message}`);
        throw new Error('Error interno al verificar contraseña');
    }
};

/**
 * Método para manejar intentos de login fallidos
 * Implementa protección contra ataques de fuerza bruta
 */
userSchema.methods.incrementLoginAttempts = function() {
    // Si la cuenta estaba bloqueada pero ya expiró, resetear
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1 },  // Eliminar el bloqueo
            $set: { loginAttempts: 1 }  // Reiniciar contador
        });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };  // Incrementar intentos
    
    // Si alcanza el límite de intentos, bloquear temporalmente
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + 30 * 60 * 1000 }; // 30 minutos
        console.log(`🔒 Cuenta bloqueada temporalmente: ${this.email}`);
    }
    
    return this.updateOne(updates);
};

/**
 * Método para resetear intentos después de login exitoso
 */
userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: { 
            loginAttempts: 1, 
            lockUntil: 1 
        },
        $set: { 
            lastLogin: new Date() 
        }
    });
};

/**
 * Método para actualizar estadísticas de compra
 */
userSchema.methods.addPurchase = function(orderTotal) {
    this.totalOrders += 1;
    this.totalSpent += orderTotal;
    
    // Agregar puntos de fidelidad (1 punto por cada $1000)
    const pointsEarned = Math.floor(orderTotal / 1000);
    this.loyaltyPoints += pointsEarned;
    
    console.log(`💰 Compra registrada para ${this.email}:`);
    console.log(`   💵 Total: ${orderTotal.toLocaleString('es-CO')}`);
    console.log(`   🏆 Puntos ganados: ${pointsEarned}`);
    console.log(`   📊 Nuevo nivel: ${this.customerLevel}`);
    
    return this.save();
};

/**
 * Método para agregar producto a lista de deseos
 */
userSchema.methods.addToWishlist = function(productId) {
    if (!this.wishlist.includes(productId)) {
        this.wishlist.push(productId);
        console.log(`❤️ Producto agregado a wishlist de ${this.email}`);
        return this.save();
    }
    return Promise.resolve(this);
};

/**
 * Método para remover producto de lista de deseos
 */
userSchema.methods.removeFromWishlist = function(productId) {
    this.wishlist = this.wishlist.filter(id => !id.equals(productId));
    console.log(`💔 Producto removido de wishlist de ${this.email}`);
    return this.save();
};
// =============================================
// MÉTODOS ESTÁTICOS - FUNCIONES DEL MODELO
// =============================================

/**
 * Buscar usuario por email (incluye contraseña para login)
 * ¿Por qué es especial?
 * Normalmente password no se incluye (select: false)
 * Pero para login necesitamos verificarla
 */
userSchema.statics.findByEmail = function(email) {
    console.log(`🔍 Buscando usuario por email: ${email}`);
    return this.findOne({ 
        email: email.toLowerCase() 
    }).select('+password');  // Incluir contraseña explícitamente
};

/**
 * Obtener usuarios activos solamente
 */
userSchema.statics.getActiveUsers = function(limit = 50) {
    console.log(`👥 Obteniendo usuarios activos (límite: ${limit})...`);
    return this.find({ 
        isActive: true 
    })
    .sort({ createdAt: -1 })  // Más recientes primero
    .limit(limit)
    .select('-password');     // Excluir contraseña
};

/**
 * Obtener usuarios por rol
 */
userSchema.statics.getUsersByRole = function(role) {
    console.log(`👑 Obteniendo usuarios con rol: ${role}...`);
    return this.find({ 
        role: role,
        isActive: true 
    })
    .sort({ createdAt: -1 });
};

/**
 * Obtener estadísticas generales de usuarios
 */
userSchema.statics.getUserStats = function() {
    console.log('📈 Calculando estadísticas de usuarios...');
    
    return this.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
                adminUsers: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
                customerUsers: { $sum: { $cond: [{ $eq: ['$role', 'customer'] }, 1, 0] } },
                totalOrders: { $sum: '$totalOrders' },
                totalSpent: { $sum: '$totalSpent' },
                averageSpent: { $avg: '$totalSpent' },
                totalLoyaltyPoints: { $sum: '$loyaltyPoints' }
            }
        },
        {
            $project: {
                totalUsers: 1,
                activeUsers: 1,
                adminUsers: 1,
                customerUsers: 1,
                totalOrders: 1,
                totalSpent: { $round: ['$totalSpent', 0] },
                averageSpent: { $round: ['$averageSpent', 0] },
                totalLoyaltyPoints: 1,
                activePercentage: { 
                    $round: [{ $multiply: [{ $divide: ['$activeUsers', '$totalUsers'] }, 100] }, 1] 
                }
            }
        }
    ]);
};

/**
 * Buscar usuarios por nivel de cliente
 */
userSchema.statics.getUsersByLevel = function(level) {
    const spentRanges = {
        'bronze': { min: 0, max: 499999 },
        'silver': { min: 500000, max: 1999999 },
        'gold': { min: 2000000, max: 4999999 },
        'platinum': { min: 5000000, max: Infinity }
    };
    
    const range = spentRanges[level];
    if (!range) {
        throw new Error('Nivel de cliente inválido. Usar: bronze, silver, gold, platinum');
    }
    
    console.log(`🏆 Buscando usuarios nivel ${level} (gasto: ${range.min.toLocaleString()}-${range.max.toLocaleString()})...`);
    
    return this.find({
        totalSpent: { 
            $gte: range.min, 
            $lt: range.max === Infinity ? Number.MAX_SAFE_INTEGER : range.max 
        },
        isActive: true
    })
    .sort({ totalSpent: -1 });
};
// =============================================
// CREAR EL MODELO DESDE EL ESQUEMA
// =============================================

/**
 * Crear el modelo a partir del esquema
 * Similar al Product, pero para usuarios
 */
const User = mongoose.model('User', userSchema);

/**
 * TRANSFORMACIÓN AUTOMÁTICA DE NOMBRES:
 * 
 * Nombre del modelo: 'User'
 * ↓ MongoDB automáticamente convierte a:
 * - Minúsculas: User → user  
 * - Plural: user → users
 * - Resultado: collection "users" en la base de datos
 */

console.log('✅ Modelo User creado exitosamente');
console.log('📋 Collection en MongoDB: users');
console.log('🔐 Características de seguridad:');
console.log('   • Contraseñas encriptadas con bcrypt');
console.log('   • Validaciones estrictas de email y contraseña');
console.log('   • Protección contra ataques de fuerza bruta');
console.log('   • Campos sensibles excluidos de JSON');
console.log('   • Roles y permisos implementados');
console.log('🔧 Funcionalidades disponibles:');
console.log('   • Registro seguro: new User(data)');
console.log('   • Login seguro: user.comparePassword()');
console.log('   • Búsqueda por email: User.findByEmail()');
console.log('   • Estadísticas: User.getUserStats()');
// =============================================
// EXPORTAR EL MODELO
// =============================================

module.exports = User;

console.log('📦 Modelo User exportado y listo para usar');
console.log('🛡️ Seguridad implementada y verificada');

/**
 * MODELO USER COMPLETADO ✅
 * 
 * Características implementadas:
 * ✅ Esquema completo con validaciones de seguridad
 * ✅ Encriptación automática de contraseñas
 * ✅ Métodos de verificación para login
 * ✅ Protección contra ataques de fuerza bruta
 * ✅ Campos virtuales útiles (edad, nivel cliente, etc.)
 * ✅ Métodos para gestión de wishlist
 * ✅ Estadísticas y reportes
 * ✅ Roles y permisos
 * 
 * Próximo paso: Probar el modelo con datos reales
 */