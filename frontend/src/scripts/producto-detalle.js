// producto-detalle.js - Funcionalidad para página de detalle del producto

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página de detalle cargada correctamente');
    
    // Inicializar todas las funcionalidades
    initQuantitySelector();
    initImageGallery();
    initAddToCartButton();
    initBuyNowButton();
    
    console.log('✅ Todas las funcionalidades iniciadas');
});

/**
 * Inicializar selector de cantidad
 */
function initQuantitySelector() {
    const decreaseBtn = document.getElementById('quantity-decrease');
    const increaseBtn = document.getElementById('quantity-increase');
    const quantityInput = document.getElementById('quantity-input');
    
    if (!decreaseBtn || !increaseBtn || !quantityInput) {
        console.warn('⚠️ No se encontraron los elementos del selector de cantidad');
        return;
    }
    
    // Botón disminuir cantidad
    decreaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
            currentValue--;
            quantityInput.value = currentValue;
            updateQuantityButtons(currentValue);
            console.log(`📦 Cantidad actualizada: ${currentValue}`);
        }
    });
    
    // Botón aumentar cantidad
    increaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue < 10) { // Máximo 10 unidades
            currentValue++;
            quantityInput.value = currentValue;
            updateQuantityButtons(currentValue);
            console.log(`📦 Cantidad actualizada: ${currentValue}`);
        }
    });
    
    // Input directo de cantidad
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value) || 1;
        
        // Validar rango
        if (value < 1) value = 1;
        if (value > 10) value = 10;
        
        this.value = value;
        updateQuantityButtons(value);
        console.log(`📦 Cantidad ingresada: ${value}`);
    });
    
    console.log('✅ Selector de cantidad inicializado');
}

/**
 * Actualizar estado de botones de cantidad
 */
function updateQuantityButtons(quantity) {
    const decreaseBtn = document.getElementById('quantity-decrease');
    const increaseBtn = document.getElementById('quantity-increase');
    
    // Deshabilitar botón de disminuir si es 1
    if (quantity <= 1) {
        decreaseBtn.classList.add('opacity-50', 'cursor-not-allowed');
        decreaseBtn.disabled = true;
    } else {
        decreaseBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        decreaseBtn.disabled = false;
    }
    
    // Deshabilitar botón de aumentar si es 10
    if (quantity >= 10) {
        increaseBtn.classList.add('opacity-50', 'cursor-not-allowed');
        increaseBtn.disabled = true;
    } else {
        increaseBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        increaseBtn.disabled = false;
    }
}

/**
 * Inicializar galería de imágenes
 */
function initImageGallery() {
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail-image');
    
    if (!mainImage || thumbnails.length === 0) {
        console.warn('⚠️ No se encontraron elementos de la galería');
        return;
    }
    
    // Agregar event listener a cada miniatura
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            // Remover clase active de todas las miniaturas
            thumbnails.forEach(thumb => {
                thumb.classList.remove('ring-2', 'ring-blue-500');
                thumb.classList.add('opacity-70');
            });
            
            // Agregar clase active a la miniatura clickeada
            this.classList.add('ring-2', 'ring-blue-500');
            this.classList.remove('opacity-70');
            
            // Actualizar imagen principal (simulado)
            console.log(`🖼️ Cambiando a imagen ${index + 1}`);
            
            // Aquí normalmente cambiarías la src de la imagen principal
            // mainImage.src = this.src;
            
            // Efecto visual en la imagen principal
            mainImage.style.opacity = '0.7';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 150);
        });
    });
    
    console.log('✅ Galería de imágenes inicializada');
}

/**
 * Inicializar botón "Agregar al Carrito"
 */
function initAddToCartButton() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    if (!addToCartBtn) {
        console.warn('⚠️ No se encontró el botón Agregar al Carrito');
        return;
    }
    
    addToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(document.getElementById('quantity-input').value) || 1;
        
        // Obtener datos del producto
        const productData = {
            id: 'macbok-pro-16-m3',
            name: 'MacBook Pro 16" M3',
            price: 2499,
            quantity: quantity,
            image: '💻' // En una app real sería una URL
        };
        
        // Agregar al carrito (simulado)
        addToCart(productData);
        
        // Feedback visual
        showAddToCartFeedback(this);
    });
    
    console.log('✅ Botón Agregar al Carrito inicializado');
}

/**
 * Inicializar botón "Comprar Ahora"
 */
function initBuyNowButton() {
    const buyNowBtn = document.getElementById('buy-now-btn');
    
    if (!buyNowBtn) {
        console.warn('⚠️ No se encontró el botón Comprar Ahora');
        return;
    }
    
    buyNowBtn.addEventListener('click', function() {
        const quantity = parseInt(document.getElementById('quantity-input').value) || 1;
        
        console.log(`💳 Comprando ${quantity} unidad(es) del MacBook Pro`);
        
        // Feedback visual
        showBuyNowFeedback(this);
        
        // Aquí redirigiríamos al checkout
        setTimeout(() => {
            alert(`¡Redirigiendo al checkout con ${quantity} MacBook Pro!`);
        }, 1000);
    });
    
    console.log('✅ Botón Comprar Ahora inicializado');
}

/**
 * Agregar producto al carrito (simulado)
 */
function addToCart(product) {
    console.log('🛒 Agregando al carrito:', product);
    
    // Obtener carrito actual del localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Verificar si el producto ya existe en el carrito
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // Si existe, incrementar cantidad
        cart[existingProductIndex].quantity += product.quantity;
        console.log(`📦 Cantidad actualizada. Total: ${cart[existingProductIndex].quantity}`);
    } else {
        // Si no existe, agregar nuevo producto
        cart.push(product);
        console.log('✅ Producto agregado al carrito');
    }
    
    // Guardar carrito actualizado
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar contador del carrito (simulado)
    updateCartCounter();
}

/**
 * Actualizar contador del carrito
 */
function updateCartCounter() {
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCounter.textContent = totalItems;
        console.log(`🔢 Contador actualizado: ${totalItems} items`);
    }
}

/**
 * Mostrar feedback al agregar al carrito
 */
function showAddToCartFeedback(button) {
    const originalText = button.textContent;
    const originalClasses = button.className;
    
    // Cambiar aspecto del botón
    button.textContent = '✅ ¡Agregado!';
    button.className = 'w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-300';
    button.disabled = true;
    
    // Restaurar después de 2 segundos
    setTimeout(() => {
        button.textContent = originalText;
        button.className = originalClasses;
        button.disabled = false;
    }, 2000);
    
    console.log('✅ Feedback de "Agregar al Carrito" mostrado');
}

/**
 * Mostrar feedback al comprar ahora
 */
function showBuyNowFeedback(button) {
    const originalText = button.textContent;
    
    // Cambiar texto del botón
    button.textContent = '⏳ Procesando...';
    button.disabled = true;
    
    // Restaurar después de 1 segundo
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 1000);
    
    console.log('✅ Feedback de "Comprar Ahora" mostrado');
}

/**
 * Función para debug - mostrar estado del carrito
 */
function debugCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('🛒 Estado actual del carrito:', cart);
    return cart;
}

// Hacer la función debug accesible globalmente
window.debugCart = debugCart;

console.log('📜 Archivo producto-detalle.js cargado completamente');