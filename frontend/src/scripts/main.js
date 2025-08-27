// MAIN.JS - FUNCIONALIDADES BÁSICAS
console.log('main.js cargado');

document.addEventListener('DOMContentLoaded', function() {
    
    // VARIABLES GLOBALES
    let cart = [];
    let isMenuOpen = false;
    
    // ELEMENTOS DOM
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const cartCounter = document.getElementById('cart-counter');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    // FUNCIÓN 1: MENÚ MÓVIL
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            console.log('Menú abierto');
        } else {
            mobileMenu.classList.add('hidden');
            console.log('Menú cerrado');
        }
    }
    
    // FUNCIÓN 2: AGREGAR AL CARRITO
    function addToCart(productId) {
        // Buscar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                quantity: 1
            });
        }
        
        updateCartCounter();
        showNotification('Producto agregado al carrito');
        console.log('Carrito:', cart);
    }
    
    // FUNCIÓN 3: ACTUALIZAR CONTADOR
    function updateCartCounter() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCounter) {
            cartCounter.textContent = totalItems;
            cartCounter.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    }
    
    // FUNCIÓN 4: MOSTRAR NOTIFICACIÓN
    function showNotification(message) {
        // Crear elemento notificación
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #059669;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
        `;
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
    
    // EVENT LISTENERS
    
    // Menú móvil
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
        console.log('Event listener menú móvil agregado');
    } else {
        console.error('Botón menú móvil no encontrado - verifica que index.html esté corregido');
    }
    
    // Botones agregar al carrito
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                addToCart(index + 1); // ID del producto
            });
        });
        console.log(`${addToCartButtons.length} botones de carrito encontrados`);
    } else {
        console.error('Botones de carrito no encontrados - verifica que index.html esté corregido');
    }
    
    console.log('main.js inicializado correctamente');
});
  // NAVEGACIÓN SUAVE (OPCIONAL)
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                if (isMenuOpen) {
                    toggleMobileMenu();
                }
                
                console.log('Navegando a:', targetId);
            }
        });
    });

    console.log('Navegación suave activada');
