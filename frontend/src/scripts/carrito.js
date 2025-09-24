// ============================================
// CARRITO.JS - VERSIÓN MEJORADA Y OPTIMIZADA
// ============================================

console.log('🛒 carrito.js mejorado cargando...');

// =============================================
// 1. CONFIGURACIÓN MEJORADA
// =============================================

const CART_CONFIG = {
    storage: {
        cartKey: 'ecommerce-cart-data' // Cambiado para coherencia con TechStore Pro
    },
    shipping: {
        freeThreshold: 100000, // $100.000 envío gratis
        standardCost: 10000 // $10.000 envío
    },
    taxes: {
        rate: 0.19 // 19% IVA
    },
    currency: {
        symbol: '$',
        locale: 'es-CO'
    },
    promoCodes: {
        'DESCUENTO10': { type: 'percentage', value: 10, minAmount: 50000 },
        'ENVIOGRATIS': { type: 'freeShipping', value: 0, minAmount: 30000 },
        'BIENVENIDO': { type: 'percentage', value: 15, minAmount: 80000 },
        'TECHPRO20': { type: 'percentage', value: 20, minAmount: 100000 }, // Nuevo código
        'PRIMERACOMPRA': { type: 'percentage', value: 12, minAmount: 40000 } // Nuevo código
    },
    animations: {
        duration: 300,
        enabled: true
    }
};

// Variables globales
let cartItems = [];
let appliedPromo = null;
let isUpdating = false; // Para evitar updates múltiples

// =============================================
// 2. FUNCIONES DE UTILIDAD MEJORADAS
// =============================================

function formatPrice(price) {
    const formatted = new Intl.NumberFormat(CART_CONFIG.currency.locale).format(price);
    return `${CART_CONFIG.currency.symbol}${formatted}`;
}

function showNotification(message, type = 'success', duration = 1000) {
    // Remover notificaciones existentes
    const existingNotifications = document.querySelectorAll('.cart-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `cart-notification fixed top-4 right-4 z-50 max-w-sm p-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 ease-in-out translate-x-full ${
        type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
        type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
        type === 'info' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
        'bg-gradient-to-r from-green-500 to-green-600'
    }`;
    
    // Agregar icono según el tipo
    const icon = type === 'error' ? '❌' : 
                type === 'warning' ? '⚠️' : 
                type === 'info' ? 'ℹ️' : '✅';
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="text-lg mr-2">${icon}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto-remove con animación
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
    
    return notification;
}

function animateElement(element, animation = 'fadeIn') {
    if (!CART_CONFIG.animations.enabled || !element) return;
    
    element.style.opacity = '0';
    element.style.transform = animation === 'slideIn' ? 'translateX(-20px)' : 'scale(0.9)';
    
    requestAnimationFrame(() => {
        element.style.transition = `all ${CART_CONFIG.animations.duration}ms ease-out`;
        element.style.opacity = '1';
        element.style.transform = 'translateX(0) scale(1)';
    });
}

// =============================================
// 3. GESTIÓN MEJORADA DEL CARRITO
// =============================================

function loadCart() {
    try {
        const saved = localStorage.getItem(CART_CONFIG.storage.cartKey);
        cartItems = saved ? JSON.parse(saved) : [];
        console.log('📦 Carrito cargado:', cartItems);
        return cartItems;
    } catch (error) {
        console.error('❌ Error cargando carrito:', error);
        cartItems = [];
        showNotification('Error cargando el carrito', 'error');
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem(CART_CONFIG.storage.cartKey, JSON.stringify(cartItems));
        console.log('💾 Carrito guardado:', cartItems);
        
        // Trigger evento personalizado para otras partes de la app
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { items: cartItems, total: calculateTotal() } 
        }));
        
    } catch (error) {
        console.error('❌ Error guardando carrito:', error);
        showNotification('Error guardando el carrito', 'error');
    }
}

// FUNCIÓN GLOBAL mejorada para agregar al carrito
window.addToCart = function(product) {
    if (isUpdating) return false;
    isUpdating = true;
    
    console.log('➕ Agregando producto al carrito:', product);
    
    try {
        const existing = cartItems.find(item => item.id === product.id);
        
        if (existing) {
            existing.quantity += 1;
            showNotification(`${product.name} agregado (${existing.quantity})`, 'success');
        } else {
            const newItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
                quantity: 1,
                addedAt: new Date().toISOString()
            };
            
            cartItems.push(newItem);
            showNotification(`${product.name} agregado al carrito`, 'success');
            
            // Animar contador si es visible
            const counter = document.getElementById('cart-counter');
            if (counter && counter.style.display !== 'none') {
                counter.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    counter.style.transform = 'scale(1)';
                }, 200);
            }
        }
        
        saveCart();
        updateCartCounter();
        
        return cartItems.length;
        
    } catch (error) {
        console.error('❌ Error agregando al carrito:', error);
        showNotification('Error agregando producto', 'error');
        return false;
    } finally {
        setTimeout(() => { isUpdating = false; }, 300);
    }
};

function removeFromCart(productId) {
    if (isUpdating) return;
    isUpdating = true;
    
    const index = cartItems.findIndex(item => item.id === productId);
    if (index > -1) {
        const item = cartItems[index];
        
        // Animar salida del elemento
        const element = document.querySelector(`[data-id="${productId}"]`);
        if (element) {
            element.style.transform = 'translateX(-100%)';
            element.style.opacity = '0';
            
            setTimeout(() => {
                cartItems.splice(index, 1);
                saveCart();
                showNotification(`${item.name} eliminado del carrito`, 'warning');
                renderCartPage();
                isUpdating = false;
            }, 300);
        } else {
            cartItems.splice(index, 1);
            saveCart();
            showNotification(`${item.name} eliminado del carrito`, 'warning');
            renderCartPage();
            isUpdating = false;
        }
    }
}

function updateQuantity(productId, newQuantity) {
    if (isUpdating) return;
    
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            const oldQuantity = item.quantity;
            item.quantity = newQuantity;
            
            // Mostrar feedback visual
            if (newQuantity > oldQuantity) {
                showNotification(`Cantidad aumentada: ${item.name}`, 'info', 1500);
            } else {
                showNotification(`Cantidad reducida: ${item.name}`, 'info', 1500);
            }
            
            saveCart();
            renderCartPage();
        }
    }
}

function clearCart() {
    if (cartItems.length === 0) {
        showNotification('El carrito ya está vacío', 'info');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cartItems = [];
        appliedPromo = null;
        saveCart();
        showNotification('Carrito vaciado', 'warning');
        renderCartPage();
    }
}

// =============================================
// 4. FUNCIONES DE CÁLCULO (sin cambios)
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
    
    return Math.max(0, subtotal + shipping + taxes - discount);
}

// =============================================
// 5. ACTUALIZAR CONTADOR MEJORADO
// =============================================

function updateCartCounter() {
    const counter = document.getElementById('cart-counter');
    if (counter) {
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        
        if (totalItems > 0) {
            counter.textContent = totalItems > 99 ? '99+' : totalItems;
            counter.style.display = 'flex';
            
            // Agregar clase de pulso si no la tiene
            if (!counter.classList.contains('cart-counter-pulse')) {
                counter.classList.add('cart-counter-pulse');
            }
        } else {
            counter.style.display = 'none';
            counter.classList.remove('cart-counter-pulse');
        }
    }
}

// =============================================
// 6. RENDERIZADO MEJORADO DE LA PÁGINA
// =============================================

function createCartItemHTML(item) {
    return `
        <div class="bg-white rounded-xl shadow-lg p-6 cart-item product-hover" data-id="${item.id}">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <!-- Imagen del producto mejorada -->
                <div class="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative group">
                    <img src="${item.image}" alt="${item.name}" 
                         class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                         onerror="this.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600'">
                    <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
                
                <!-- Información del producto -->
                <div class="flex-grow min-w-0">
                    <h3 class="text-lg font-semibold text-gray-900 truncate mb-1">${item.name}</h3>
                    <p class="text-gray-600 text-sm">${formatPrice(item.price)} cada uno</p>
                    <p class="text-lg font-bold text-blue-600 mt-1">Total: ${formatPrice(item.price * item.quantity)}</p>
                    ${item.addedAt ? `<p class="text-xs text-gray-400 mt-1">Agregado: ${new Date(item.addedAt).toLocaleDateString()}</p>` : ''}
                </div>
                
                <!-- Controles de cantidad mejorados -->
                <div class="flex items-center gap-3">
                    <!-- BOTÓN MENOS -->
                    <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" 
                            class="quantity-button w-10 h-10 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all duration-200 transform hover:scale-110" 
                            title="Disminuir cantidad">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                    </button>
                    
                    <!-- CANTIDAD ACTUAL con mejor diseño -->
                    <div class="bg-gray-100 px-4 py-2 rounded-lg">
                        <span class="text-lg font-bold text-gray-800">${item.quantity}</span>
                    </div>
                    
                    <!-- BOTÓN MÁS -->
                    <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" 
                            class="quantity-button w-10 h-10 rounded-full bg-gray-200 hover:bg-green-100 hover:text-green-600 flex items-center justify-center transition-all duration-200 transform hover:scale-110" 
                            title="Aumentar cantidad">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </button>
                    
                    <!-- BOTÓN ELIMINAR mejorado -->
                    <button onclick="removeFromCart('${item.id}')" 
                            class="ml-4 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 transform hover:scale-110 hover:rotate-3"
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
        if (emptyCart) {
            emptyCart.classList.remove('hidden');
            animateElement(emptyCart);
        }
        if (cartContainer) cartContainer.classList.add('hidden');
        if (cartSummary) cartSummary.classList.add('hidden');
        if (continueShopping) continueShopping.classList.add('hidden');
    } else {
        // Mostrar carrito con productos
        if (emptyCart) emptyCart.classList.add('hidden');
        if (cartContainer) {
            cartContainer.classList.remove('hidden');
            cartContainer.innerHTML = cartItems.map(createCartItemHTML).join('');
            
            // Animar cada elemento
            cartContainer.querySelectorAll('.cart-item').forEach((item, index) => {
                setTimeout(() => animateElement(item, 'slideIn'), index * 100);
            });
        }
        if (cartSummary) {
            cartSummary.classList.remove('hidden');
            animateElement(cartSummary);
        }
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
    
    // Actualizar elementos del DOM con animaciones
    const elements = {
        'summary-items-count': totalItems,
        'summary-subtotal': formatPrice(subtotal),
        'summary-shipping': shipping === 0 ? 'Gratis ✨' : formatPrice(shipping),
        'summary-taxes': formatPrice(taxes),
        'summary-total': formatPrice(total)
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            // Animar cambio de valor
            element.style.transform = 'scale(1.1)';
            element.textContent = value;
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 150);
        }
    });
    
    // Mostrar/ocultar descuento
    const discountRow = document.getElementById('discount-row');
    const discountElement = document.getElementById('summary-discount');
    
    if (appliedPromo && discount > 0) {
        if (discountRow) {
            discountRow.classList.remove('hidden');
            animateElement(discountRow);
        }
        if (discountElement) {
            discountElement.textContent = `-${formatPrice(discount)}`;
        }
    } else {
        if (discountRow) discountRow.classList.add('hidden');
    }
    
    // Mensaje de envío gratis
    updateShippingMessage(subtotal);
}

function updateShippingMessage(subtotal) {
    const shippingElement = document.getElementById('summary-shipping');
    if (!shippingElement) return;
    
    const remaining = CART_CONFIG.shipping.freeThreshold - subtotal;
    
    if (remaining > 0 && remaining < 50000) {
        // Mostrar cuánto falta para envío gratis
        const parent = shippingElement.parentElement;
        let messageElement = parent.querySelector('.shipping-message');
        
        if (!messageElement) {
            messageElement = document.createElement('p');
            messageElement.className = 'shipping-message text-xs text-blue-600 mt-1';
            parent.appendChild(messageElement);
        }
        
        messageElement.textContent = `¡Agrega ${formatPrice(remaining)} más para envío gratis!`;
    }
}

// =============================================
// 7. CÓDIGOS DE DESCUENTO MEJORADOS
// =============================================

function applyPromoCode(code) {
    const promoCode = code.toUpperCase().trim();
    const promo = CART_CONFIG.promoCodes[promoCode];
    const messageElement = document.getElementById('promo-message');
    const applyBtn = document.getElementById('apply-promo');
    
    // Loading state
    if (applyBtn) {
        applyBtn.classList.add('loading');
        applyBtn.textContent = '';
    }
    
    setTimeout(() => {
        if (!promo) {
            showMessage(messageElement, `Código "${promoCode}" no válido`, 'error');
            showNotification(`Código "${promoCode}" no es válido`, 'error');
        } else {
            const subtotal = calculateSubtotal();
            if (subtotal < promo.minAmount) {
                showMessage(messageElement, `Monto mínimo requerido: ${formatPrice(promo.minAmount)}`, 'error');
                showNotification(`Necesitas ${formatPrice(promo.minAmount)} mínimo`, 'warning');
            } else {
                appliedPromo = promo;
                showMessage(messageElement, `✨ ${promoCode} aplicado: ${promo.type === 'percentage' ? promo.value + '%' : formatPrice(promo.value)} descuento`, 'success');
                showNotification(`¡Descuento ${promoCode} aplicado!`, 'success');
                updateSummary();
                
                // Limpiar campo
                const promoInput = document.getElementById('promo-code');
                if (promoInput) promoInput.value = '';
            }
        }
        
        // Restore button
        if (applyBtn) {
            applyBtn.classList.remove('loading');
            applyBtn.textContent = 'Aplicar';
        }
    }, 1000); // Simular loading
}

function showMessage(element, message, type) {
    if (element) {
        element.textContent = message;
        element.className = `text-sm mt-2 ${type === 'error' ? 'text-red-600' : 'text-green-600'}`;
        element.classList.remove('hidden');
        
        // Animar mensaje
        element.style.opacity = '0';
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 300ms ease-in-out';
            element.style.opacity = '1';
        });
        
        // Auto-hide después de 5 segundos
        if (type === 'error') {
            setTimeout(() => {
                if (element && !message.includes('aplicado')) {
                    element.style.opacity = '0';
                    setTimeout(() => element.classList.add('hidden'), 300);
                }
            }, 5000);
        }
    }
}

// =============================================
// 8. EVENT LISTENERS MEJORADOS
// =============================================

function setupEventListeners() {
    console.log('🔧 Configurando event listeners mejorados...');
    
    // Botón aplicar promoción
    const applyPromoBtn = document.getElementById('apply-promo');
    const promoCodeInput = document.getElementById('promo-code');
    
    if (applyPromoBtn && promoCodeInput) {
        applyPromoBtn.addEventListener('click', () => {
            const code = promoCodeInput.value.trim();
            if (code) {
                applyPromoCode(code);
            } else {
                showNotification('Ingresa un código de descuento', 'warning');
                promoCodeInput.focus();
            }
        });
        
        // Enter en campo de promoción
        promoCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const code = promoCodeInput.value.trim();
                if (code) {
                    applyPromoCode(code);
                }
            }
        });
        
        // Autocompletar códigos disponibles
        promoCodeInput.addEventListener('input', (e) => {
            const value = e.target.value.toUpperCase();
            const codes = Object.keys(CART_CONFIG.promoCodes);
            const matches = codes.filter(code => code.startsWith(value));
            
            // Aquí podrías mostrar sugerencias (feature future)
        });
    }
    
    // Botón checkout mejorado
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartItems.length === 0) {
                showNotification('Tu carrito está vacío', 'warning');
                return;
            }
            
            // Loading state
            checkoutBtn.classList.add('loading');
            checkoutBtn.innerHTML = '<span>Procesando...</span>';
            
            const orderData = {
                items: cartItems,
                subtotal: calculateSubtotal(),
                shipping: calculateShipping(calculateSubtotal()),
                taxes: calculateTaxes(calculateSubtotal()),
                discount: calculateDiscount(calculateSubtotal()),
                total: calculateTotal(),
                appliedPromo: appliedPromo,
                timestamp: new Date().toISOString(),
                customerData: {
                    // Aquí irían los datos del cliente en una implementación real
                }
            };
            
            console.log('📋 Datos del pedido:', orderData);
            showNotification('Redirigiendo a checkout...', 'info');
            
            // Simular procesamiento
            setTimeout(() => {
                checkoutBtn.classList.remove('loading');
                checkoutBtn.innerHTML = `
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                    Proceder al Checkout
                `;
                
                // Simulación mejorada
                alert(`🛒 CHECKOUT SIMULADO\n\n💰 Total: ${formatPrice(orderData.total)}\n📦 Productos: ${cartItems.length}\n${appliedPromo ? `🏷️ Descuento: ${appliedPromo.value}${appliedPromo.type === 'percentage' ? '%' : ''}\n` : ''}🚚 Envío: ${orderData.shipping === 0 ? 'Gratis' : formatPrice(orderData.shipping)}\n\n✨ En las siguientes sesiones implementaremos Stripe para pagos reales.`);
            }, 2000);
        });
    }
    
    // Agregar botón para vaciar carrito
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Vaciar Carrito';
    clearBtn.className = 'mt-2 text-sm text-gray-500 hover:text-red-600 transition-colors duration-200';
    clearBtn.addEventListener('click', clearCart);
    
    if (checkoutBtn && checkoutBtn.parentElement) {
        checkoutBtn.parentElement.insertBefore(clearBtn, checkoutBtn.nextSibling);
    }
    
    console.log('✅ Event listeners configurados correctamente');
}

// =============================================
// 9. FUNCIONES DE TESTING MEJORADAS
// =============================================

function addTestProducts() {
    console.log('🧪 Agregando productos de prueba mejorados...');
    
    const testProducts = [
        {
            id: 'test-smartphone-pro',
            name: 'iPhone 15 Pro Max',
            price: 1299000,
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'
        },
        {
            id: 'test-laptop-gaming',
            name: 'MacBook Pro M3 16"',
            price: 2499000,
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600'
        },
        {
            id: 'test-headphones-premium',
            name: 'Sony WH-1000XM5',
            price: 459000,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'
        }
    ];
    
    testProducts.forEach((product, index) => {
        setTimeout(() => {
            window.addToCart(product);
        }, index * 500); // Agregar con delay para ver las animaciones
    });
    
    setTimeout(() => {
        renderCartPage();
        showNotification('🎉 Productos de prueba agregados con éxito', 'success');
        console.log('✅ Productos de prueba agregados:', testProducts.length);
    }, 2000);
}

// Funciones globales para debugging mejoradas
window.cartDebug = {
    addTestProducts,
    addSingleTestProduct: () => {
        const product = {
            id: `test-${Date.now()}`,
            name: `Producto Test ${new Date().toLocaleTimeString()}`,
            price: Math.floor(Math.random() * 500000) + 50000,
            image: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=600'
        };
        window.addToCart(product);
    },
    simulateUserInteraction: () => {
        console.log('Simulando interacción completa del usuario...');
        
        setTimeout(() => {
            window.cartDebug.addSingleTestProduct();
        }, 1000);
        
        setTimeout(() => {
            const promoInput = document.getElementById('promo-code');
            if (promoInput) {
                promoInput.value = 'DESCUENTO10';
                applyPromoCode('DESCUENTO10');
            }
        }, 2500);
        
        setTimeout(() => {
            showNotification('Simulación completada exitosamente', 'success');
        }, 4000);
    },
    clearCart,
    getCartItems: () => cartItems,
    getConfig: () => CART_CONFIG,
    getCurrentTotal: () => formatPrice(calculateTotal()),
    getAppliedPromo: () => appliedPromo,
    forceRender: () => renderCartPage(),
    testAnimations: () => {
        console.log('Probando animaciones...');
        const testElement = document.createElement('div');
        testElement.textContent = 'Test Animation';
        testElement.className = 'fixed top-20 left-4 bg-blue-500 text-white p-4 rounded-lg z-50';
        document.body.appendChild(testElement);
        animateElement(testElement);
        setTimeout(() => testElement.remove(), 2000);
    },
    toggleAnimations: () => {
        CART_CONFIG.animations.enabled = !CART_CONFIG.animations.enabled;
        showNotification(`Animaciones ${CART_CONFIG.animations.enabled ? 'activadas' : 'desactivadas'}`, 'info');
    }
};

// =============================================
// 10. INICIALIZACIÓN COMPLETA MEJORADA
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando sistema de carrito mejorado...');
    
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
        
        // Event listener para cambios de storage (sincronización entre pestañas)
        window.addEventListener('storage', (e) => {
            if (e.key === CART_CONFIG.storage.cartKey) {
                loadCart();
                updateCartCounter();
                if (window.location.pathname.includes('carrito.html')) {
                    renderCartPage();
                }
                showNotification('Carrito sincronizado', 'info', 2000);
            }
        });
        
        // Custom event listener para integración con otras partes de la app
        window.addEventListener('cartUpdated', (e) => {
            console.log('🔄 Carrito actualizado:', e.detail);
            updateCartCounter();
        });
        
        console.log('✅ Sistema de carrito inicializado correctamente');
        console.log(`📊 Estado: ${cartItems.length} productos, total: ${formatPrice(calculateTotal())}`);
        
        // Mensaje de ayuda para testing mejorado
        if (window.location.pathname.includes('carrito.html') && cartItems.length === 0) {
            console.log('%c💡 FUNCIONES DE TESTING DISPONIBLES:', 'color: #10B981; font-weight: bold; font-size: 16px;');
            console.log('%c   cartDebug.addTestProducts() - Agregar 3 productos premium', 'color: #6B7280; font-size: 14px;');
            console.log('%c   cartDebug.addSingleTestProduct() - Agregar 1 producto aleatorio', 'color: #6B7280; font-size: 14px;');
            console.log('%c   cartDebug.simulateUserInteraction() - Simulación completa de usuario', 'color: #6B7280; font-size: 14px;');
            console.log('%c   cartDebug.clearCart() - Vaciar carrito', 'color: #6B7280; font-size: 14px;');
            console.log('%c   cartDebug.testAnimations() - Probar animaciones', 'color: #6B7280; font-size: 14px;');
            console.log('%c   cartDebug.toggleAnimations() - Activar/desactivar animaciones', 'color: #6B7280; font-size: 14px;');
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

// Función para integración con main.js mejorada
window.refreshCart = () => {
    loadCart();
    updateCartCounter();
    if (window.location.pathname.includes('carrito.html')) {
        renderCartPage();
    }
};

console.log('🎉 carrito.js MEJORADO cargado exitosamente ✅');

// =============================================
// 11. PERSONALIZACIÓN Y CONFIGURACIÓN FINAL
// =============================================

/*
MEJORAS IMPLEMENTADAS EN ESTA VERSIÓN:

✅ FUNCIONALIDADES NUEVAS:
- Animaciones suaves y micro-interacciones
- Notificaciones mejoradas con iconos y gradientes
- Loading states en botones
- Sincronización entre pestañas del navegador
- Contador de carrito con límite 99+
- Mensajes de envío gratis dinámicos
- Botón para vaciar carrito con confirmación
- Fechas de productos agregados
- Mejores validaciones y manejo de errores

✅ UX/UI MEJORADAS:
- Efectos hover en botones de cantidad
- Imágenes con zoom al hover
- Mejor feedback visual en todas las acciones
- Diseño más profesional y coherente
- Transiciones suaves en todos los elementos
- Estados de loading realistas

✅ CÓDIGO MEJORADO:
- Mejor manejo de estados (isUpdating)
- Funciones más robustas con try/catch
- Eventos personalizados para integración
- Debugging más completo
- Configuración más flexible
- Mejor estructura y comentarios

CONFIGURACIÓN PERSONALIZABLE:

1. CART_CONFIG.storage.cartKey - 'techstore-cart-data' (coherente con TechStore Pro)
2. CART_CONFIG.shipping - Configuración de envío
3. CART_CONFIG.taxes.rate - Tasa de impuestos (19%)
4. CART_CONFIG.currency - Formato de moneda (Colombia)
5. CART_CONFIG.promoCodes - 5 códigos de descuento disponibles
6. CART_CONFIG.animations - Control de animaciones

CÓDIGOS DE DESCUENTO DISPONIBLES:
- DESCUENTO10 - 10% descuento, mín. $50,000
- ENVIOGRATIS - Envío gratis, mín. $30,000  
- BIENVENIDO - 15% descuento, mín. $80,000
- TECHPRO20 - 20% descuento, mín. $100,000 (NUEVO)
- PRIMERACOMPRA - 12% descuento, mín. $40,000 (NUEVO)

FUNCIONES DE TESTING MEJORADAS:
- cartDebug.addTestProducts() - Productos premium con delays
- cartDebug.testAnimations() - Probar sistema de animaciones
- cartDebug.toggleAnimations() - Activar/desactivar animaciones
- cartDebug.simulateUserInteraction() - Flujo completo de usuario

PRÓXIMOS PASOS SUGERIDOS:
1. Crear carrito.html usando el diseño mejorado
2. Actualizar index.html con el icono de carrito mejorado  
3. Continuar con SESIÓN 3: Página de productos
4. Implementar backend con MongoDB (SESIÓN 4)
5. Integrar pagos con Stripe (SESIÓN 6)
*/