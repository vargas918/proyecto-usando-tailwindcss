// product-url-handler.js - Manejo de parámetros URL y carga dinámica con imágenes Unsplash

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔗 Sistema de URL cargado');
    
    const productId = getProductIdFromURL();
    
    if (productId) {
        console.log(`📱 Producto solicitado: ${productId}`);
        loadProductData(productId);
    } else {
        console.log('📱 Producto por defecto');
        loadProductData('macbook-pro-16');
    }
});

function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    console.log(`🔍 URL detectada: ${productId || 'ninguno'}`);
    return productId;
}

function loadProductData(productId) {
    console.log(`📄 Cargando: ${productId}`);
    
    const products = {
        'zapatos_deportivos': {
            name: 'zapatos negros',
            shortDesc: 'Chip M3, 16GB RAM, 512GB SSD',
            price: '$6.200.000',
            originalPrice: '$12.500.000',
            images: {
                main: 'https://www.athleticpropulsionlabs.com/cdn/shop/files/h23-techloomzipline-black-black-black-2.jpg?format=webp&v=1698869881&width=1200',
                gallery: [
                    'https://www.athleticpropulsionlabs.com/cdn/shop/files/h23-techloomzipline-black-black-black-3.jpg?format=webp&v=1698869881&width=1200',
                    'https://www.athleticpropulsionlabs.com/cdn/shop/files/h23-techloomzipline-black-black-black-2.jpg?format=webp&v=1698869881&width=1200',
                    'https://www.athleticpropulsionlabs.com/cdn/shop/files/h23-techloomzipline-black-black-black-4.jpg?format=webp&v=1698869881&width=1200',
                    'https://www.athleticpropulsionlabs.com/cdn/shop/files/h23-techloomzipline-black-black-black-5.jpg?format=webp&v=1698869882&width=1200'
                ]
            },
            category: 'laptops'
        },
        'guantes_deportivos': {
            name: 'iPhone 15 Pro',
            shortDesc: '128GB, Titanio Natural',
            price: '$4.800.000',
            originalPrice: '$5.200.000',
            images: {
                main: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&w=800&q=90',
                gallery: [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&w=800&q=90',
                    'https://web-mobile-first.s3.eu-west-3.amazonaws.com/production/apple_iphone_15_pro_max_2023_min_e05c74d8b2.jpg',
                    'https://m.media-amazon.com/images/I/51KLILQ67nL._UF894,1000_QL80_.jpg',
                    'https://cdn.mos.cms.futurecdn.net/TjZcMkMuNukMPxVxwEq5nA.jpg'
                ]
            },
            category: 'celulares'
        },
        'voleibol': {
            name: 'NVIDIA RTX 4080',
            shortDesc: '16GB GDDR6X, Gaming OC',
            price: '$3.200.000',
            originalPrice: '$3.500.000',
            images: {
                main: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&w=800&q=90',
                gallery: [
                    'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&w=800&q=90',
                    'https://images.unsplash.com/photo-1555617981-dac3880eac6e?ixlib=rb-4.0.3&w=800&q=90',
                    'https://d1q3zw97enxzq2.cloudfront.net/images/best_psu_for_rtx_4080_super_2.width-1500.format-webp.webp',
                    'https://tigercomputadores.com/wp-content/uploads/x1-925.jpg'
                ]
            },
            category: 'componentes'
        },
        'guayos': {
            name: 'Samsung Galaxy S24',
            shortDesc: '256GB, Phantom Black',
            price: '$2.400.000',
            originalPrice: '$2.700.000',
            images: {
                main: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&w=800&q=90',
                gallery: [
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&w=800&q=90',
                    'https://images.unsplash.com/photo-1580910051074-3eb694886505?ixlib=rb-4.0.3&w=800&q=90',
                    'https://media.falabella.com/falabellaCO/127936661_01/w=1500,h=1500,fit=pad',
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&w=800&q=90'
                ]
            },
            category: 'celulares'
        },
        'ropa_deportivo': {
            name: 'Dell XPS 13',
            shortDesc: 'Intel i7, 16GB RAM, 512GB SSD',
            price: '$3.500.000',
            originalPrice: '$3.900.000',
            images: {
                main: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&w=800&q=90',
                gallery: [
                    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&w=800&q=90',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&w=800&q=90',
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&w=800&q=90',
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&w=800&q=90'
                ]
            },
            category: 'laptops'
        },
        'balon': {
            name: 'AMD Ryzen 7 7800X3D',
            shortDesc: '8-Core, 4.2GHz, AM5',
            price: '$1.100.000',
            originalPrice: '$1.250.000',
            images: {
                main: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?ixlib=rb-4.0.3&w=800&q=90',
                gallery: [
                    'https://images.unsplash.com/photo-1555617981-dac3880eac6e?ixlib=rb-4.0.3&w=800&q=90',
                    'https://images.unsplash.com/photo-1518826778770-a729fb53327c?ixlib=rb-4.0.3&w=800&q=90',
                    'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?ixlib=rb-4.0.3&w=800&q=90',
                    'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&w=800&q=90'
                ]
            },
            category: 'componentes'
        },
        'guantes': {
            name: 'AirPods Pro (2ª Gen)',
            shortDesc: 'Cancelación activa de ruido',
            price: '$750.000',
            originalPrice: '$850.000',
            images: {
                main: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&w=800&q=90',
                gallery: [
                    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&w=800&q=90',
                    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&w=800&q=90',
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&w=800&q=90',
                    'https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&w=800&q=90'
                ]
            },
            category: 'accesorios'
        },
        'ropa3': {
            name: 'Silla Gaming Pro',
            shortDesc: 'Ergonómica, LED RGB',
            price: '$890.000',
            originalPrice: '$990.000',
            images: {
                main: 'https://i5.walmartimages.com/asr/489afe9f-e6f4-4650-97b5-641c62863da2.525eeb468b4ee05f9f83a39eca61e17d.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF',
                gallery: [
                    'https://i5.walmartimages.com/asr/489afe9f-e6f4-4650-97b5-641c62863da2.525eeb468b4ee05f9f83a39eca61e17d.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF',
                    'https://www.pchouse.com.py/wp-content/uploads/2025/07/Silla-Gamer-Quanta-Krab-Emperor-KBGC20-RojoNegro-1.webp',
                    'https://i5.walmartimages.com/asr/58b90c12-9494-4318-81f4-b247da2419c7.e969d27dff35cf21b0422b027207e9de.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF',
                    'https://www.perozzi.com.ar/41454-thickbox_default/ludadel-sillon-gamer-classic-sg-14328rdbk-capoya-pies-red-y-black.jpg'
                ]
            },
            category: 'accesorios'
        }
    };
    
    const product = products[productId];
    if (!product) {
        console.log('❌ Producto no encontrado, usando default');
        return;
    }
    
    // Actualizar título principal (dentro de main)
    const titleElement = document.querySelector('main h1');
    if (titleElement) {
        titleElement.textContent = product.name;
        console.log(`✅ Título actualizado: ${product.name}`);
    } else {
        console.error('❌ No se encontró el título principal');
    }
    
    // Actualizar descripción
    const descElement = document.querySelector('main h1 + p');
    if (descElement) {
        descElement.textContent = product.shortDesc;
        console.log(`✅ Descripción actualizada`);
    }
    
    // Actualizar precio principal
    const priceElement = document.querySelector('.text-4xl.font-bold.text-blue-600');
    if (priceElement) {
        priceElement.textContent = product.price;
        console.log(`✅ Precio actualizado: ${product.price}`);
    }
    
    // Actualizar precio original
    const originalPriceElement = document.querySelector('.text-xl.text-gray-500.line-through');
    if (originalPriceElement) {
        originalPriceElement.textContent = product.originalPrice;
        console.log(`✅ Precio original actualizado: ${product.originalPrice}`);
    }
    
    // Actualizar breadcrumb
    const breadcrumbElement = document.querySelector('nav.text-sm span.text-gray-900');
    if (breadcrumbElement) {
        breadcrumbElement.textContent = product.name;
        console.log(`✅ Breadcrumb actualizado: ${product.name}`);
    }
    
    // NUEVO: Actualizar imagen principal
    updateMainImage(product.images.main, product.name);
    
    // NUEVO: Actualizar galería de imágenes
    updateImageGallery(product.images.gallery, product.name);
    
    // Actualizar título de página
    document.title = `${product.name} - TechStore Pro`;
    
    console.log(`🎉 COMPLETADO: ${product.name}`);
}

// NUEVA FUNCIÓN: Actualizar imagen principal
function updateMainImage(imageSrc, productName) {
    const mainImageContainer = document.getElementById('main-image');
    if (mainImageContainer) {
        // Limpiar contenido actual
        mainImageContainer.innerHTML = '';
        
        // Crear nueva imagen
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = productName;
        img.className = 'w-full h-full object-cover rounded-xl';
        img.loading = 'lazy';
        
        img.onerror = function() {
            // Fallback si la imagen no carga
            this.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'w-full h-full flex items-center justify-center bg-gray-200 rounded-xl';
            fallback.innerHTML = '<span class="text-6xl">💻</span>';
            mainImageContainer.appendChild(fallback);
        };
        
        mainImageContainer.appendChild(img);
        
        // Mantener el badge de descuento
        const discountBadge = document.createElement('div');
        discountBadge.className = 'absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold';
        discountBadge.textContent = '-15%';
        mainImageContainer.appendChild(discountBadge);
        
        console.log(`✅ Imagen principal actualizada: ${imageSrc}`);
    }
}

// NUEVA FUNCIÓN: Actualizar galería de imágenes
function updateImageGallery(images, productName) {
    const thumbnails = document.querySelectorAll('.thumbnail-image');
    
    thumbnails.forEach((thumbnail, index) => {
        if (images[index]) {
            // Limpiar contenido actual
            thumbnail.innerHTML = '';
            
            // Crear nueva imagen miniatura
            const img = document.createElement('img');
            img.src = images[index];
            img.alt = `${productName} vista ${index + 1}`;
            img.className = 'w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity';
            img.loading = 'lazy';
            
            img.onerror = function() {
                // Fallback si la imagen no carga
                this.style.display = 'none';
                const fallback = document.createElement('span');
                fallback.className = 'text-2xl';
                fallback.textContent = '💻';
                thumbnail.appendChild(fallback);
            };
            
            thumbnail.appendChild(img);
            
            // Agregar evento click para cambiar imagen principal
            thumbnail.addEventListener('click', function() {
                updateMainImage(images[index], productName);
                
                // Actualizar estado activo de thumbnails
                thumbnails.forEach(thumb => {
                    thumb.classList.remove('ring-2', 'ring-blue-500');
                    thumb.classList.add('opacity-70');
                });
                
                this.classList.add('ring-2', 'ring-blue-500');
                this.classList.remove('opacity-70');
            });
            
            // Marcar la primera imagen como activa
            if (index === 0) {
                thumbnail.classList.add('ring-2', 'ring-blue-500');
                thumbnail.classList.remove('opacity-70');
            }
        }
    });
    
    console.log(`✅ Galería actualizada con ${images.length} imágenes`);
}