document.addEventListener('DOMContentLoaded', function() {

    const imagenes = [
        { src: 'recuerdos/1.jpeg'},
        { src: 'recuerdos/2.jpeg', titulo: 'Te quedo increible 😄' },
        { src: 'recuerdos/3.jpeg'},
        { src: 'recuerdos/4.jpeg', titulo: 'Tiene hipertelorismo xd' },
        { src: 'recuerdos/5.jpeg'},
        { src: 'recuerdos/6.jpeg'},
        { src: 'recuerdos/7.jpeg'},
        { src: 'recuerdos/8.jpeg'},
        { src: 'recuerdos/9.jpeg', titulo: 'Destructor de Universos' },
        { src: 'recuerdos/10.jpeg'},
        { src: 'recuerdos/11.jpeg'},
        { src: 'recuerdos/12.jpeg'},
        { src: 'recuerdos/13.jpeg', titulo: 'Algun dia me lo robare jeje' },
        { src: 'recuerdos/14.jpeg', titulo: '⚡Cuchau⚡' },
        { src: 'recuerdos/15.jpeg'},
        { src: 'recuerdos/16.jpeg', titulo: 'Aqui descubri una nueva especie 😁' },
        { src: 'recuerdos/17.jpeg', titulo: 'Gigante con Dulce' },
        { src: 'recuerdos/18.jpeg', titulo: 'Gigante sin Dulce' },
        { src: 'recuerdos/19.jpeg'},
        { src: 'recuerdos/20.jpeg'},
        { src: 'recuerdos/21.jpeg'},
        { src: 'recuerdos/22.jpeg', titulo: 'Pensando a su futura victima' },
        { src: 'recuerdos/23.jpeg'},
        { src: 'recuerdos/24.jpeg', titulo: 'Osito crying' },
        { src: 'recuerdos/25.jpeg'},
        { src: 'recuerdos/26.jpeg', titulo: 'Presumiendo musculo 😅' },
        { src: 'recuerdos/27.jpeg'},
        { src: 'recuerdos/28.jpeg'},
        { src: 'recuerdos/29.jpeg', titulo: 'Habra estado rico' },
        { src: 'recuerdos/30.jpeg'},
        { src: 'recuerdos/31.jpeg', titulo: 'Aqui enborrachandome' },
        { src: 'recuerdos/32.jpeg', titulo: 'jeje' },
        { src: 'recuerdos/33.jpeg', titulo: 'Murio el conejito' },
        { src: 'recuerdos/34.jpeg'},
        { src: 'recuerdos/35.jpeg'},
        { src: 'recuerdos/36.jpeg'},
        { src: 'recuerdos/37.jpeg'},
        { src: 'recuerdos/38.jpeg'},
        { src: 'recuerdos/39.jpeg', titulo: '🥺' },
        { src: 'recuerdos/40.jpeg', titulo: 'Gracias Gigante' },
    ];
    
    let galeriaActiva = false;
    let velocidad = 1.5;
    let velocidadBase = 1.5;
    let pausado = false;
    let posicion = 0;
    let animacionId = null;
    
    // Variables para el control táctil
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let dragOffset = 0;
    let velocidadDespuesDeArrastre = 0;
    let momentumId = null;
    
    // Función para detectar orientación de imagen
    function esImagenHorizontal(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function() {
                resolve(this.width > this.height);
            };
            img.onerror = function() {
                resolve(true);
            };
            img.src = src;
        });
    }
    
    // Inicializar galería
    async function inicializarGaleria() {
        const galeriaInner = document.createElement('div');
        galeriaInner.className = 'galeria-inner';
        
        const imagenesInfo = [];
        
        for (let i = 0; i < imagenes.length; i++) {
            const imagen = imagenes[i];
            const esHorizontal = await esImagenHorizontal(imagen.src);
            imagenesInfo.push({
                ...imagen,
                esHorizontal: esHorizontal,
                clase: esHorizontal ? 'horizontal' : 'vertical'
            });
        }
        
        // Añadir cada imagen al track
        imagenesInfo.forEach((imagen, index) => {
            const item = document.createElement('div');
            item.className = `galeria-item ${imagen.clase}`;
            
            const img = document.createElement('img');
            img.className = 'galeria-img';
            img.src = imagen.src;
            img.alt = `Recuerdo ${index + 1}`;
            
            const titulo = document.createElement('div');
            titulo.className = 'galeria-titulo';
            titulo.textContent = imagen.titulo || '';
            
            item.appendChild(img);
            if (imagen.titulo) item.appendChild(titulo);
            galeriaInner.appendChild(item);
        });
        
        // Duplicar imágenes para bucle
        imagenesInfo.forEach((imagen, index) => {
            const item = document.createElement('div');
            item.className = `galeria-item ${imagen.clase}`;
            
            const img = document.createElement('img');
            img.className = 'galeria-img';
            img.src = imagen.src;
            img.alt = `Recuerdo ${index + 1} (copia)`;
            
            const titulo = document.createElement('div');
            titulo.className = 'galeria-titulo';
            titulo.textContent = imagen.titulo || '';
            
            item.appendChild(img);
            if (imagen.titulo) item.appendChild(titulo);
            galeriaInner.appendChild(item);
        });
        
        const galeriaTrack = document.querySelector('.galeria-track');
        galeriaTrack.appendChild(galeriaInner);
        
        configurarControles();
        configurarEventosTactiles();
    }
    
    // Configurar controles de la galería
    function configurarControles() {
        // Botón de pausar/reanudar
        const btnPausar = document.getElementById('btn-pausar');
        if (btnPausar) {
            btnPausar.addEventListener('click', function() {
                pausado = !pausado;
                this.textContent = pausado ? 'Reanudar' : 'Pausar';
                
                if (!pausado) {
                    iniciarAnimacion();
                }
            });
        }
        
        // Cerrar galería
        const cerrarBtn = document.querySelector('.cerrar-galeria');
        if (cerrarBtn) {
            cerrarBtn.addEventListener('click', cerrarGaleria);
        }
    }
    
    // Configurar eventos táctiles para móvil
    function configurarEventosTactiles() {
        const galeriaTrack = document.querySelector('.galeria-track');
        if (!galeriaTrack) return;
        
        // Eventos para toque (móvil)
        galeriaTrack.addEventListener('touchstart', handleTouchStart, { passive: false });
        galeriaTrack.addEventListener('touchmove', handleTouchMove, { passive: false });
        galeriaTrack.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // Eventos para ratón (escritorio)
        galeriaTrack.addEventListener('mousedown', handleMouseDown);
        galeriaTrack.addEventListener('mousemove', handleMouseMove);
        galeriaTrack.addEventListener('mouseup', handleMouseUp);
        galeriaTrack.addEventListener('mouseleave', handleMouseLeave);
        
        // Prevenir arrastre en imágenes
        const galeriaImgs = document.querySelectorAll('.galeria-img');
        galeriaImgs.forEach(img => {
            img.addEventListener('dragstart', function(e) {
                e.preventDefault();
            });
        });
        
        // Zoom con doble clic
        const galeriaItems = document.querySelectorAll('.galeria-item');
        galeriaItems.forEach(item => {
            item.addEventListener('dblclick', function() {
                this.classList.toggle('zoom');
            });
            
            // Para móvil: toque doble
            let lastTouchEnd = 0;
            item.addEventListener('touchend', function(e) {
                const now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    this.classList.toggle('zoom');
                    e.preventDefault();
                }
                lastTouchEnd = now;
            });
        });
    }
    
    // Manejadores de eventos táctiles (ya están en JS nativo)
    function handleTouchStart(e) {
        if (!galeriaActiva) return;
        e.preventDefault();
        
        if (animacionId) {
            cancelAnimationFrame(animacionId);
            animacionId = null;
        }
        
        isDragging = true;
        startX = e.touches[0].clientX;
        currentX = startX;
        dragOffset = posicion;
        
        const galeriaTrack = document.querySelector('.galeria-track');
        galeriaTrack.classList.add('dragging');
    }
    
    function handleTouchMove(e) {
        if (!isDragging || !galeriaActiva) return;
        e.preventDefault();
        
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        posicion = dragOffset + deltaX;
        
        const galeriaInner = document.querySelector('.galeria-inner');
        galeriaInner.style.transform = `translateX(${posicion}px)`;
        velocidadDespuesDeArrastre = deltaX / 5;
    }
    
    function handleTouchEnd(e) {
        if (!isDragging || !galeriaActiva) return;
        e.preventDefault();
        
        isDragging = false;
        const galeriaTrack = document.querySelector('.galeria-track');
        galeriaTrack.classList.remove('dragging');
        aplicarMomentum();
    }
    
    function handleMouseDown(e) {
        if (!galeriaActiva) return;
        e.preventDefault();
        
        if (animacionId) {
            cancelAnimationFrame(animacionId);
            animacionId = null;
        }
        
        isDragging = true;
        startX = e.clientX;
        currentX = startX;
        dragOffset = posicion;
        
        const galeriaTrack = document.querySelector('.galeria-track');
        galeriaTrack.style.cursor = 'grabbing';
        galeriaTrack.classList.add('dragging');
    }
    
    function handleMouseMove(e) {
        if (!isDragging || !galeriaActiva) return;
        e.preventDefault();
        
        currentX = e.clientX;
        const deltaX = currentX - startX;
        posicion = dragOffset + deltaX;
        
        const galeriaInner = document.querySelector('.galeria-inner');
        galeriaInner.style.transform = `translateX(${posicion}px)`;
        velocidadDespuesDeArrastre = deltaX / 8;
    }
    
    function handleMouseUp(e) {
        if (!isDragging || !galeriaActiva) return;
        
        isDragging = false;
        const galeriaTrack = document.querySelector('.galeria-track');
        galeriaTrack.style.cursor = 'grab';
        galeriaTrack.classList.remove('dragging');
        aplicarMomentum();
    }
    
    function handleMouseLeave(e) {
        if (isDragging && galeriaActiva) {
            handleMouseUp(e);
        }
    }
    
    function aplicarMomentum() {
        aplicarMomentumAnimacion(velocidadDespuesDeArrastre);
    }
    
    function aplicarMomentumAnimacion(velocidadInicial) {
        let velocidadMomentum = velocidadInicial;
        const deceleracion = 0.92;
        
        function momentumStep() {
            posicion += velocidadMomentum;
            velocidadMomentum *= deceleracion;
            
            const galeriaInner = document.querySelector('.galeria-inner');
            const anchoTotal = galeriaInner.offsetWidth;
            
            if (Math.abs(posicion) >= anchoTotal / 2) {
                posicion = 0;
            }
            
            galeriaInner.style.transform = `translateX(${posicion}px)`;
            
            if (Math.abs(velocidadMomentum) > 0.05) {
                momentumId = requestAnimationFrame(momentumStep);
            } else {
                iniciarAnimacion();
            }
        }
        
        momentumId = requestAnimationFrame(momentumStep);
    }
    
    function animarGaleria() {
        if (pausado || isDragging) return;
        
        const galeriaInner = document.querySelector('.galeria-inner');
        posicion -= velocidad;
        
        const anchoTotal = galeriaInner.offsetWidth;
        if (Math.abs(posicion) >= anchoTotal / 2) {
            posicion = 0;
        }
        
        galeriaInner.style.transform = `translateX(${posicion}px)`;
        animacionId = requestAnimationFrame(animarGaleria);
    }
    
    function iniciarAnimacion() {
        if (momentumId) {
            cancelAnimationFrame(momentumId);
            momentumId = null;
        }
        
        if (animacionId) {
            cancelAnimationFrame(animacionId);
        }
        
        animacionId = requestAnimationFrame(animarGaleria);
    }
    
    // Abrir galería
    function abrirGaleria() {
        const galeria = document.getElementById('galeria');
        galeria.classList.add('activo');
        galeriaActiva = true;
        
        const galeriaTrack = document.querySelector('.galeria-track');
        galeriaTrack.style.cursor = 'grab';
        
        // Disparar evento para reproducir audio
        document.dispatchEvent(new CustomEvent('galeriaAbierta'));
        
        setTimeout(() => {
            iniciarAnimacion();
        }, 100);
    }
    
    // Cerrar galería
    function cerrarGaleria() {
        const galeria = document.getElementById('galeria');
        galeria.classList.remove('activo');
        galeriaActiva = false;
        pausado = false;
        
        const btnPausar = document.getElementById('btn-pausar');
        if (btnPausar) btnPausar.textContent = 'Pausar';
        
        velocidad = velocidadBase;
        
        if (animacionId) {
            cancelAnimationFrame(animacionId);
            animacionId = null;
        }
        
        if (momentumId) {
            cancelAnimationFrame(momentumId);
            momentumId = null;
        }
        
        // Disparar evento para detener audio
        document.dispatchEvent(new CustomEvent('galeriaCerrada'));
        
        posicion = 0;
        const galeriaInner = document.querySelector('.galeria-inner');
        galeriaInner.style.transform = 'translateX(0px)';
        
        const galeriaItems = document.querySelectorAll('.galeria-item');
        galeriaItems.forEach(item => {
            item.classList.remove('zoom');
        });
    }
    
    // Configurar el corazón para abrir la galería
    function configurarCorazon() { 
        const mostrarLink = document.querySelector('.mostrar a');
        if (mostrarLink) {
            mostrarLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const preloader = document.getElementById('preloader');
                if (preloader && !preloader.classList.contains('hidden')) {
                    return false;
                }
                
                console.log('Enlace clickeado');
                abrirGaleria();
                return false;
            });
        }
    }
    
    // Inicializar
    inicializarGaleria();
    configurarCorazon();
    
    // Asegurar que el video de fondo continúe
    const bgVideo = document.getElementById('bgVideo');
    if (bgVideo) {
        bgVideo.addEventListener('pause', function() {
            this.play();
        });
    }
});
