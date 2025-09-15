// productos-navegacion.js - Sistema de navegación catálogo ↔ detalle
console.log('🚀 Cargando sistema de navegación...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM cargado, inicializando navegación');
    
    // Solo ejecutar en productos.html
    if (window.location.pathname.includes('productos.html')) {
        initCatalogCartButtons();
        console.log('✅ Navegación de catálogo inicializada');
    }
});

/**
 * Inicializar botones "Al Carrito" desde catálogo
 */
function initCatalogCartButtons() {
    const cartButtons = document.querySelectorAll('.agregar-carrito-btn');
    console.log(`🔍 Encontrados ${cartButtons.length} botones de carrito`);
    
    cartButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            
            if (!productId) {
                console.error('❌ No se encontró ID del producto');
                return;
            }
            
            console.log(`🛒 Agregando producto: ${productId}`);
            
            // Obtener datos del producto desde el DOM
            const productData = extractProductFromDOM(productId);
            
            // Agregar al carrito
            addToCartFromCatalog(productData);
            
            // Mostrar feedback
            showAddToCartFeedback(this);
        });
    });
    
    console.log(`✅ ${cartButtons.length} botones de carrito configurados`);
}

/**
 * Extraer datos del producto desde el DOM
 */
function extractProductFromDOM(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    
    if (!productCard) {
        console.error(`❌ No se encontró producto: ${productId}`);
        return null;
    }
    
    const title = productCard.querySelector('h3')?.textContent?.trim() || 'Producto';
    const priceText = productCard.querySelector('.text-2xl')?.textContent || '$0';
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
    const description = productCard.querySelector('p')?.textContent?.trim() || 'Sin descripción';
    
    const productData = {
        id: productId,
        name: title,
        price: price,
        description: description,
        quantity: 1,
        image: getProductEmoji(productId)
    };
    
    console.log('📦 Producto extraído:', productData);
    return productData;
}

/**
 * Obtener emoji según el producto
 */
function getProductEmoji(productId) {
    const emojis = {
        'macbook-pro-16': '💻',
        'iphone-15-pro': '📱',
        'nvidia-rtx-4080': '🎮',
        'samsung-galaxy-s24': '📱',
        'dell-xps-13': '💻',
        'amd-ryzen-7': '⚡',
        'airpods-pro': '🎧',
        'silla-gaming': '🪑'
    };
    return emojis[productId] || '📦';
}

/**
 * Agregar producto al carrito
 */
function addToCartFromCatalog(productData) {
    if (!productData) {
        console.error('❌ No se pueden agregar datos vacíos');
        return;
    }
    
    // Obtener carrito del localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Buscar si el producto ya existe
    const existingIndex = cart.findIndex(item => item.id === productData.id);
    
    if (existingIndex !== -1) {
        // Incrementar cantidad
        cart[existingIndex].quantity += 1;
        console.log(`🔄 Cantidad actualizada: ${cart[existingIndex].quantity}`);
    } else {
        // Agregar nuevo producto
        cart.push(productData);
        console.log('✅ Nuevo producto agregado');
    }
    
    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar contador
    updateCartCounter();
}

/**
 * Actualizar contador del carrito
 */
function updateCartCounter() {
    const counter = document.getElementById('cart-counter');
    if (counter) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (total > 0) {
            counter.textContent = total;
            counter.style.display = 'flex';
        } else {
            counter.style.display = 'none';
        }
        
        console.log(`🔢 Contador actualizado: ${total} items`);
    }
}

/**
 * Mostrar feedback visual
 */
function showAddToCartFeedback(button) {
    const originalText = button.textContent;
    const originalClasses = button.className;
    
    // Cambiar a estado "agregado"
    button.textContent = '✅ ¡Agregado!';
    button.className = button.className
        .replace('bg-blue-600', 'bg-green-600')
        .replace('hover:bg-blue-700', 'hover:bg-green-700');
    button.disabled = true;
    
    // Restaurar después de 2 segundos
    setTimeout(() => {
        button.textContent = originalText;
        button.className = originalClasses;
        button.disabled = false;
    }, 2000);
    
    console.log('✨ Feedback mostrado');
}

// Función debug
function debugCatalog() {
    const products = document.querySelectorAll('[data-product-id]');
    console.log('🛍️ Productos en catálogo:', products.length);
    
    products.forEach((product, index) => {
        const id = product.getAttribute('data-product-id');
        const name = product.querySelector('h3')?.textContent || 'Sin nombre';
        console.log(`${index + 1}. ${id}: ${name}`);
    });
}

window.debugCatalog = debugCatalog;
console.log('📜 productos-navegacion.js cargado completamente');