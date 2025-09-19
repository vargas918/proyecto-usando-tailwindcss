// productos-navegacion.js - Sistema de navegación entre catálogo y detalle

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de navegación de productos cargado');
    
    // Inicializar botones de "Ver Detalles"
    initProductDetailButtons();
    
    // Inicializar botones de "Agregar al Carrito" desde catálogo
    initCatalogCartButtons();
    
    console.log('✅ Sistema de navegación inicializado');
});

/**
 * Inicializar botones "Ver Detalles"
 */
function initProductDetailButtons() {
    const detailButtons = document.querySelectorAll('.ver-detalles-btn');
    
    if (detailButtons.length === 0) {
        console.warn('⚠️ No se encontraron botones "Ver Detalles"');
        return;
    }
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            
            if (!productId) {
                console.error('❌ Producto sin ID definido');
                return;
            }
            
            // Navegar a página de detalle con parámetro
            navigateToProductDetail(productId);
        });
    });
    
    console.log(`✅ ${detailButtons.length} botones "Ver Detalles" inicializados`);
}

/**
 * Inicializar botones "Agregar al Carrito" desde catálogo
 */
function initCatalogCartButtons() {
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    if (cartButtons.length === 0) {
        console.warn('⚠️ No se encontraron botones "Agregar al Carrito"');
        return;
    }
    
    cartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            
            if (!productId) {
                console.error('❌ Producto sin ID definido');
                return;
            }
            
            // Obtener datos del producto desde el DOM
            const productData = getProductDataFromDOM(productId);
            
            // Agregar al carrito
            addToCartFromCatalog(productData);
            
            // Feedback visual
            showCatalogCartFeedback(this);
        });
    });
    
    console.log(`✅ ${cartButtons.length} botones "Agregar al Carrito" inicializados`);
}

/**
 * Navegar a página de detalle del producto
 */
function navigateToProductDetail(productId) {
    console.log(`🔄 Navegando a detalle del producto: ${productId}`);
    
    // Construir URL con parámetro
    const detailUrl = `producto-detalle.html?id=${productId}`;
    
    // Navegar a la página
    window.location.href = detailUrl;
}

/**
 * Obtener datos del producto desde el DOM
 */
function getProductDataFromDOM(productId) {
    // Encontrar la card del producto
    const productCard = document.querySelector(`[data-id="${productId}"]`);
    
    if (!productCard) {
        console.error(`❌ No se encontró producto con ID: ${productId}`);
        return null;
    }
    
    // Extraer información del producto
    const title = productCard.querySelector('h3')?.textContent || 'Producto sin nombre';
    const priceElement = productCard.querySelector('.text-2xl.font-bold.text-blue-600');
    
    // Extraer precio - formato colombiano
    let price = 0;
    if (priceElement) {
        const priceText = priceElement.textContent.replace(/[^0-9]/g, '');
        price = parseInt(priceText) || 0;
    }
    
    const description = productCard.querySelector('p')?.textContent || 'Sin descripción';
    
    const productData = {
        id: productId,
        name: title.trim(),
        price: price,
        description: description.trim(),
        quantity: 1,
        image: getProductEmoji(productId)
    };
    
    console.log('📦 Datos del producto extraídos:', productData);
    return productData;
}

/**
 * Obtener emoji según tipo de producto
 */
function getProductEmoji(productId) {
    const emojiMap = {
        'macbook-pro-16': '💻',
        'iphone-15-pro': '📱',
        'nvidia-rtx-4080': '🎮',
        'samsung-galaxy-s24': '📱',
        'dell-xps-13': '💻',
        'amd-ryzen-7': '⚡',
        'airpods-pro': '🎧',
        'silla-gaming': '🪑'
    };
    
    return emojiMap[productId] || '📦';
}

/**
 * Agregar producto al carrito desde catálogo
 */
function addToCartFromCatalog(productData) {
    if (!productData) {
        console.error('❌ No se pueden agregar datos vacíos al carrito');
        return;
    }
    
    console.log('🛒 Agregando al carrito desde catálogo:', productData);
    
    // Obtener carrito actual del localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Verificar si el producto ya existe en el carrito
    const existingProductIndex = cart.findIndex(item => item.id === productData.id);
    
    if (existingProductIndex !== -1) {
        // Si existe, incrementar cantidad
        cart[existingProductIndex].quantity += 1;
        console.log(`📦 Cantidad actualizada. Total: ${cart[existingProductIndex].quantity}`);
    } else {
        // Si no existe, agregar nuevo producto
        cart.push(productData);
        console.log('✅ Producto agregado al carrito');
    }
    
    // Guardar carrito actualizado
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar contador del carrito
    updateCartCounter();
}

/**
 * Actualizar contador del carrito en header
 */
function updateCartCounter() {
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCounter.textContent = totalItems;
        
        // Mostrar/ocultar contador
        if (totalItems > 0) {
            cartCounter.style.display = 'flex';
        } else {
            cartCounter.style.display = 'none';
        }
        
        console.log(`🔢 Contador actualizado: ${totalItems} items`);
    }
}

/**
 * Mostrar feedback al agregar al carrito desde catálogo
 */
function showCatalogCartFeedback(button) {
    const originalText = button.textContent;
    const originalClasses = button.className;
    
    // Cambiar aspecto del botón
    button.textContent = '✅ ¡Agregado!';
    button.className = button.className.replace('bg-blue-600', 'bg-green-600').replace('hover:bg-blue-700', 'hover:bg-green-700');
    button.disabled = true;
    
    // Restaurar después de 2 segundos
    setTimeout(() => {
        button.textContent = originalText;
        button.className = originalClasses;
        button.disabled = false;
    }, 2000);
    
    console.log('✅ Feedback de catálogo mostrado');
}

/**
 * Función para debug - mostrar productos en consola
 */
function debugProducts() {
    const products = document.querySelectorAll('[data-product-id]');
    console.log('🛍️ Productos encontrados:', products.length);
    
    products.forEach((product, index) => {
        const id = product.getAttribute('data-id');
        const name = product.querySelector('h3')?.textContent || 'Sin nombre';
        console.log(`${index + 1}. ID: ${id} - Nombre: ${name}`);
    });
    
    return products.length;
}

// Hacer la función debug accesible globalmente
window.debugProducts = debugProducts;

console.log('📜 Archivo productos-navegacion.js cargado completamente');
/**
 * Inicializar filtros, búsqueda y ordenamiento
 */
function initProductFilters() {
    const searchInput = document.querySelector('input[placeholder="Buscar productos..."]');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    const productsGrid = document.getElementById('products-grid');
    const products = Array.from(productsGrid.querySelectorAll('.product-card'));

    if (!productsGrid || products.length === 0) return;
    const originalOrder = products.slice(); // Guarda el orden inicial del grid
    console.log(`✅ ${products.length} productos encontrados para filtrar`);

    function filterAndSortProducts() {
        const query = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;
        const selectedPrice = priceFilter.value;
        const sortOption = sortFilter.value;

        let filtered = products.filter(product => {
            const title = product.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = product.querySelector('p')?.textContent.toLowerCase() || '';
            const category = product.dataset.category;
            const price = parseInt(product.dataset.price);

            // Filtrado por búsqueda
            const matchesSearch = title.includes(query) || description.includes(query);
            
            // Filtrado por categoría
            const matchesCategory = !selectedCategory || category === selectedCategory;

            // Filtrado por precio
            let matchesPrice = true;
            if (selectedPrice) {
                if (selectedPrice.includes('+')) {
                    matchesPrice = price >= parseInt(selectedPrice);
                } else {
                    const [min, max] = selectedPrice.split('-').map(Number);
                    matchesPrice = price >= min && price <= max;
                }
            }

            return matchesSearch && matchesCategory && matchesPrice;
        });

        // Ordenamiento
        if (sortOption === 'relevance') {
            filtered = originalOrder.filter(p => filtered.includes(p));
        }else if (sortOption === 'price-asc') {
            filtered.sort((a, b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
        } else if (sortOption === 'price-desc') {
            filtered.sort((a, b) => parseInt(b.dataset.price) - parseInt(a.dataset.price));
        } else if (sortOption === 'name') {
            filtered.sort((a, b) => a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent));
        } else if (sortOption === 'newest') {
            // Asumiendo que los productos más nuevos están al final del grid
            filtered.sort((a, b) => parseInt(b.dataset.id.split('-').pop()) - parseInt(a.dataset.id.split('-').pop()));
        }

        // Mostrar/Ocultar productos
        products.forEach(p => (p.style.display = 'none'));
        filtered.forEach(p => {
            p.style.display = 'block';
            productsGrid.appendChild(p);
            });
    }

    // Eventos de filtros
    searchInput.addEventListener('input', filterAndSortProducts);
    categoryFilter.addEventListener('change', filterAndSortProducts);
    priceFilter.addEventListener('change', filterAndSortProducts);
    sortFilter.addEventListener('change', filterAndSortProducts);
}

// Inicializar filtros al cargar DOM
document.addEventListener('DOMContentLoaded', function() {
    initProductFilters();
});