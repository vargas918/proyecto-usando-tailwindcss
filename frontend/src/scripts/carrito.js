// ============================================
// CARRITO.JS PARTE 1 - CONFIGURACIÓN Y UTILIDADES
// ============================================

console.log('carrito.js cargando...');

// =============================================
// 1. CONFIGURACIÓN - PERSONALÍZALA
// =============================================

const CART_CONFIG = {
    storage: {
        cartKey: 'cart' // Cambia por tu marca
    },
    shipping: {
        freeThreshold: 100000, // $100.000 envío gratis - PERSONALIZA
        standardCost: 10000 // $10.000 envío - PERSONALIZA
    },
    taxes: {
        rate: 0.19 // 19% IVA - PERSONALIZA según tu país
    },
    currency: {
        symbol: '$',
        locale: 'es-CO' // Cambia: es-MX, es-AR, etc.
    },
    promoCodes: {
        'DESCUENTO10': { type: 'percentage', value: 10, minAmount: 50000 },
        'ENVIOGRATIS': { type: 'freeShipping', value: 0, minAmount: 30000 },
        'BIENVENIDO': { type: 'percentage', value: 15, minAmount: 80000 }
    }
};

// Variables globales
let cartItems = [];
let appliedPromo = null;

// =============================================
// 2. FUNCIONES DE UTILIDAD
// =============================================

function formatPrice(price) {
    const formatted = new Intl.NumberFormat(CART_CONFIG.currency.locale).format(price);
    return `${CART_CONFIG.currency.symbol}${formatted}`;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 ease-in-out ${
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-yellow-500' : 
        'bg-green-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => notification.style.transform = 'translateX(0)', 10);
    
    // Auto-remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// =============================================
// 3. GESTIÓN BÁSICA DEL CARRITO
// =============================================

function loadCart() {
    try {
        const saved = localStorage.getItem(CART_CONFIG.storage.cartKey);
        cartItems = saved ? JSON.parse(saved) : [];
        console.log('Carrito cargado:', cartItems);
        return cartItems;
    } catch (error) {
        console.error('Error cargando carrito:', error);
        cartItems = [];
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem(CART_CONFIG.storage.cartKey, JSON.stringify(cartItems));
        console.log('Carrito guardado:', cartItems);
    } catch (error) {
        console.error('Error guardando carrito:', error);
    }
}

// FUNCIÓN GLOBAL para agregar al carrito (compatible con main.js)
window.addToCart = function(product) {
    console.log('Agregando producto al carrito:', product);
    
    const existing = cartItems.find(item => item.id === product.id);
    
    if (existing) {
        existing.quantity += 1;
        showNotification(`${product.name} agregado al carrito (${existing.quantity})`);
    } else {
        cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.image || 'https://via.placeholder.com/100x100',
            quantity: 1
        });
        showNotification(`${product.name} agregado al carrito`);
    }
    
    saveCart();
    updateCartCounter();
    
    return cartItems.length;
};

function removeFromCart(productId) {
    const index = cartItems.findIndex(item => item.id === productId);
    if (index > -1) {
        const item = cartItems[index];
        cartItems.splice(index, 1);
        saveCart();
        showNotification(`${item.name} eliminado del carrito`, 'warning');
        renderCartPage();
    }
}

function updateQuantity(productId, newQuantity) {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            renderCartPage();
        }
    }
}

function clearCart() {
    cartItems = [];
    appliedPromo = null;
    saveCart();
    showNotification('Carrito vaciado', 'warning');
    renderCartPage();
}

// =============================================
// 4. FUNCIONES DE CÁLCULO
// =============================================

function calculateSubtotal() {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function calculateShipping(subtotal) {
    if (appliedPromo && appliedPromo.type === 'freeShipping') {
        return 0;
    }
    return subtotal >= CART_CONFIG.shipping.freeThreshold ? 0 : CART_CONFIG.shipping.standardCost;
}

function calculateTaxes(subtotal) {
    return Math.round(subtotal * CART_CONFIG.taxes.rate);
}

function calculateDiscount(subtotal) {
    if (!appliedPromo) return 0;
    
    if (appliedPromo.type === 'percentage') {
        return Math.round(subtotal * (appliedPromo.value / 100));
    }
    if (appliedPromo.type === 'fixed') {
        return Math.min(appliedPromo.value, subtotal);
    }
    return 0;
}

function calculateTotal() {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping(subtotal);
    const taxes = calculateTaxes(subtotal);
    const discount = calculateDiscount(subtotal);
    
    return subtotal + shipping + taxes - discount;
}

// =============================================
// 5. ACTUALIZAR CONTADOR (Compatible con main.js)
// =============================================

function updateCartCounter() {
    const counter = document.getElementById('cart-counter');
    if (counter) {
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

console.log('carrito.js PARTE 1 cargado ✅');

// =============================================
// 6. RENDERIZADO DE LA PÁGINA DEL CARRITO
// =============================================

function createCartItemHTML(item) {
    return `
        <div class="bg-white rounded-xl shadow-lg p-6 cart-item" data-id="${item.id}">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <!-- Imagen del producto -->
                <div class="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/100x100/E5E7EB/6B7280?text=IMG'">
                </div>
                
                <!-- Información del producto -->
                <div class="flex-grow min-w-0">
                    <h3 class="text-lg font-semibold text-gray-900 truncate">${item.name}</h3>
                    <p class="text-gray-600">${formatPrice(item.price)} cada uno</p>
                    <p class="text-sm text-gray-500 mt-1">Total: ${formatPrice(item.price * item.quantity)}</p>
                </div>
                
                <!-- Controles de cantidad -->
                <div class="flex items-center gap-3">
                    <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" 
                            class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200" 
                            title="Disminuir cantidad">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                    </button>
                    
                    <button onclick="removeFromCart('${item.id}')" 
                            class="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Eliminar producto">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderCartPage() {
    const emptyCart = document.getElementById('empty-cart');
    const cartContainer = document.getElementById('cart-items-container');
    const cartSummary = document.getElementById('cart-summary');
    const continueShopping = document.getElementById('continue-shopping');
    
    if (cartItems.length === 0) {
        // Mostrar carrito vacío
        if (emptyCart) emptyCart.classList.remove('hidden');
        if (cartContainer) cartContainer.classList.add('hidden');
        if (cartSummary) cartSummary.classList.add('hidden');
        if (continueShopping) continueShopping.classList.add('hidden');
    } else {
        // Mostrar carrito con productos
        if (emptyCart) emptyCart.classList.add('hidden');
        if (cartContainer) {
            cartContainer.classList.remove('hidden');
            cartContainer.innerHTML = cartItems.map(createCartItemHTML).join('');
        }
        if (cartSummary) cartSummary.classList.remove('hidden');
        if (continueShopping) continueShopping.classList.remove('hidden');
        
        // Actualizar resumen
        updateSummary();
    }
    
    updateCartCounter();
}

function updateSummary() {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping(subtotal);
    const taxes = calculateTaxes(subtotal);
    const discount = calculateDiscount(subtotal);
    const total = calculateTotal();
    
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Actualizar elementos del DOM
    const elements = {
        'summary-items-count': totalItems,
        'summary-subtotal': formatPrice(subtotal),
        'summary-shipping': shipping === 0 ? 'Gratis' : formatPrice(shipping),
        'summary-taxes': formatPrice(taxes),
        'summary-total': formatPrice(total)
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
    
    // Mostrar descuento aplicado
    if (appliedPromo) {
        const discountAmount = calculateDiscount(subtotal);
        if (discountAmount > 0) {
            const promoElement = document.getElementById('promo-message');
            if (promoElement) {
                promoElement.textContent = `Descuento aplicado: -${formatPrice(discountAmount)}`;
                promoElement.className = 'text-sm mt-2 text-green-600';
                promoElement.classList.remove('hidden');
            }
        }
    }
}

// =============================================
// 7. CÓDIGOS DE DESCUENTO
// =============================================

function applyPromoCode(code) {
    const promoCode = code.toUpperCase().trim();
    const promo = CART_CONFIG.promoCodes[promoCode];
    const messageElement = document.getElementById('promo-message');
    
    if (!promo) {
        showMessage(messageElement, 'Código de descuento no válido', 'error');
        return;
    }
    
    const subtotal = calculateSubtotal();
    if (subtotal < promo.minAmount) {
        showMessage(messageElement, `Monto mínimo requerido: ${formatPrice(promo.minAmount)}`, 'error');
        return;
    }
    
    appliedPromo = promo;
    showMessage(messageElement, 'Código aplicado correctamente', 'success');
    updateSummary();
    showNotification('Descuento aplicado');
    
    // Limpiar campo
    const promoInput = document.getElementById('promo-code');
    if (promoInput) promoInput.value = '';
}

function showMessage(element, message, type) {
    if (element) {
        element.textContent = message;
        element.className = `text-sm mt-2 ${type === 'error' ? 'text-red-600' : 'text-green-600'}`;
        element.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (element && !message.includes('Descuento aplicado')) {
                element.classList.add('hidden');
            }
        }, 5000);
    }
}

// =============================================
// 8. EVENT LISTENERS Y FUNCIONALIDADES
// =============================================

function setupEventListeners() {
    console.log('Configurando event listeners...');
    
    // Botón aplicar promoción
    const applyPromoBtn = document.getElementById('apply-promo');
    const promoCodeInput = document.getElementById('promo-code');
    
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', () => {
            const code = promoCodeInput ? promoCodeInput.value : '';
            if (code.trim()) {
                applyPromoCode(code);
            } else {
                showNotification('Ingresa un código de descuento', 'warning');
            }
        });
    }
    
    // Enter en campo de promoción
    if (promoCodeInput) {
        promoCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const code = promoCodeInput.value;
                if (code.trim()) {
                    applyPromoCode(code);
                }
            }
        });
    }
    
    // Botón checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartItems.length === 0) {
                showNotification('Tu carrito está vacío', 'warning');
                return;
            }
            
            const orderData = {
                items: cartItems,
                subtotal: calculateSubtotal(),
                shipping: calculateShipping(calculateSubtotal()),
                taxes: calculateTaxes(calculateSubtotal()),
                discount: calculateDiscount(calculateSubtotal()),
                total: calculateTotal(),
                appliedPromo: appliedPromo,
                timestamp: new Date().toISOString()
            };
            
            console.log('Datos del pedido:', orderData);
            showNotification('Redirigiendo a checkout...', 'success');
            
            // Simular redirección (en sesiones futuras será real)
            setTimeout(() => {
                alert(`CHECKOUT SIMULADO:\n\nTotal: ${formatPrice(orderData.total)}\nProductos: ${cartItems.length}\n\n(En sesiones futuras será real)`);
            }, 1000);
        });
    }
    
    console.log('Event listeners configurados ✅');
}

// =============================================
// 9. FUNCIONES DE TESTING Y DEBUG
// =============================================

function addTestProducts() {
    console.log('Agregando productos de prueba...');
    
    const testProducts = [
        {
            id: 'test-smartphone-1',
            name: 'Smartphone Premium X1',
            price: 850000,
            image: 'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=📱'
        },
        {
            id: 'test-laptop-2',
            name: 'Laptop Gamer Pro',
            price: 1200000,
            image: 'https://via.placeholder.com/100x100/EF4444/FFFFFF?text=💻'
        },
        {
            id: 'test-headphones-3',
            name: 'Auriculares Bluetooth',
            price: 180000,
            image: 'https://via.placeholder.com/100x100/10B981/FFFFFF?text=🎧'
        }
    ];
    
    testProducts.forEach(product => {
        window.addToCart(product);
    });
    
    renderCartPage();
    showNotification('Productos de prueba agregados');
    console.log('Productos de prueba agregados:', testProducts.length);
}

function addSingleTestProduct() {
    const product = {
        id: `test-${Date.now()}`,
        name: `Producto Test ${Date.now()}`,
        price: Math.floor(Math.random() * 500000) + 50000,
        image: 'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=TEST'
    };
    
    window.addToCart(product);
    showNotification('Producto de prueba agregado');
}

function simulateUserInteraction() {
    console.log('Simulando interacción del usuario...');
    
    setTimeout(() => {
        addSingleTestProduct();
    }, 1000);
    
    setTimeout(() => {
        const promoInput = document.getElementById('promo-code');
        if (promoInput) {
            promoInput.value = 'DESCUENTO10';
            applyPromoCode('DESCUENTO10');
        }
    }, 2000);
    
    setTimeout(() => {
        showNotification('Simulación completada', 'success');
    }, 3000);
}

// Funciones globales para debugging
window.cartDebug = {
    addTestProducts,
    addSingleTestProduct,
    simulateUserInteraction,
    clearCart,
    getCartItems: () => cartItems,
    getConfig: () => CART_CONFIG,
    getCurrentTotal: () => formatPrice(calculateTotal()),
    getAppliedPromo: () => appliedPromo,
    forceRender: () => renderCartPage()
};

// =============================================
// 10. INICIALIZACIÓN COMPLETA
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando sistema de carrito completo...');
    
    try {
        // Cargar datos del carrito
        loadCart();
        console.log(`📦 Carrito cargado con ${cartItems.length} productos`);
        
        // Configurar event listeners
        setupEventListeners();
        
        // Renderizar página si estamos en carrito.html
        if (window.location.pathname.includes('carrito.html')) {
            console.log('📄 Renderizando página del carrito...');
            renderCartPage();
        }
        
        // Actualizar contador en todas las páginas
        updateCartCounter();
        
        console.log('✅ Sistema de carrito inicializado correctamente');
        console.log(`📊 Estado: ${cartItems.length} productos, total: ${formatPrice(calculateTotal())}`);
        
        // Mensaje de ayuda para testing
        if (window.location.pathname.includes('carrito.html') && cartItems.length === 0) {
            console.log('%c💡 TESTING: Funciones disponibles:', 'color: #10B981; font-weight: bold; font-size: 14px;');
            console.log('%c   cartDebug.addTestProducts() - Agregar 3 productos de prueba', 'color: #6B7280;');
            console.log('%c   cartDebug.addSingleTestProduct() - Agregar 1 producto aleatorio', 'color: #6B7280;');
            console.log('%c   cartDebug.simulateUserInteraction() - Simular usuario completo', 'color: #6B7280;');
            console.log('%c   cartDebug.clearCart() - Vaciar carrito', 'color: #6B7280;');
        }
        
    } catch (error) {
        console.error('❌ Error inicializando carrito:', error);
        showNotification('Error inicializando carrito', 'error');
    }
});

// Funciones globales adicionales para compatibilidad
window.updateCartDisplay = updateCartCounter;
window.getCartItemCount = () => cartItems.reduce((total, item) => total + item.quantity, 0);
window.getCartTotal = () => calculateTotal();

console.log('🎉 carrito.js COMPLETO cargado ✅');

// =============================================
// 11. PERSONALIZACIÓN FINAL
// =============================================

// PERSONALIZA ESTOS VALORES SEGÚN TU NEGOCIO:

/*
CONFIGURACIÓN PERSONALIZABLE:

1. CART_CONFIG.storage.cartKey - Cambia 'ecommerce-cart-data' por 'tu-marca-cart'
2. CART_CONFIG.shipping.freeThreshold - Monto para envío gratis
3. CART_CONFIG.shipping.standardCost - Costo del envío estándar
4. CART_CONFIG.taxes.rate - Tu tasa de impuestos (0.19 = 19%)
5. CART_CONFIG.currency.locale - Tu localización (es-MX, es-AR, es-ES)
6. CART_CONFIG.promoCodes - Tus códigos de descuento

CÓDIGOS DE DESCUENTO DISPONIBLES POR DEFECTO:
- DESCUENTO10 - 10% de descuento, mínimo $50,000
- ENVIOGRATIS - Envío gratis, mínimo $30,000
- BIENVENIDO - 15% de descuento, mínimo $80,000

FUNCIONES DE TESTING:
- cartDebug.addTestProducts() - Agregar productos de prueba
- cartDebug.clearCart() - Limpiar carrito
- cartDebug.getCurrentTotal() - Ver total actual
*/
