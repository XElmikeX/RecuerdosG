// Archivo: galeria.js (modificado con funcionalidad táctil)
// Archivo: galeria.js (ajustado para imágenes horizontales)
$(document).ready(function() {
    // Datos de las imágenes con sus títulos
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
    
    // Variables de control
    let galeriaActiva = false;
    let velocidad = 1.5; // Reducida para imágenes más grandes
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
                // Si el ancho es mayor que el alto, es horizontal
                resolve(this.width > this.height);
            };
            img.onerror = function() {
                // Por defecto asumimos que es horizontal
                resolve(true);
            };
            img.src = src;
        });
    }
    
    // Inicializar galería
    async function inicializarGaleria() {
        const galeriaInner = $('<div class="galeria-inner"></div>');
        
        // Crear un array para almacenar información de orientación
        const imagenesInfo = [];
        
        // Cargar cada imagen y determinar su orientación
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
            const item = $('<div class="galeria-item"></div>');
            item.addClass(imagen.clase);
            
            const img = $('<img class="galeria-img">').attr('src', imagen.src).attr('alt', `Recuerdo ${index + 1}`);
            const titulo = $('<div class="galeria-titulo"></div>').text(imagen.titulo);
            
            item.append(img, titulo);
            galeriaInner.append(item);
        });
        
        // Duplicar imágenes para crear un efecto de bucle continuo
        imagenesInfo.forEach((imagen, index) => {
            const item = $('<div class="galeria-item"></div>');
            item.addClass(imagen.clase);
            
            const img = $('<img class="galeria-img">').attr('src', imagen.src).attr('alt', `Recuerdo ${index + 1} (copia)`);
            const titulo = $('<div class="galeria-titulo"></div>').text(imagen.titulo);
            
            item.append(img, titulo);
            galeriaInner.append(item);
        });
        
        $('.galeria-track').append(galeriaInner);
        
        // Configurar controles
        configurarControles();
        
        // Configurar eventos táctiles
        configurarEventosTactiles();
        
        // Pre-cargar todas las imágenes para mejor rendimiento
        preCargarImagenes();
    }
    
    // Pre-cargar imágenes para evitar problemas de carga
    function preCargarImagenes() {
        imagenes.forEach(imagen => {
            const img = new Image();
            img.src = imagen.src;
        });
    }
    
    // Configurar controles de la galería
    function configurarControles() {
        // Botón de pausar/reanudar
        $('#btn-pausar').click(function() {
            pausado = !pausado;
            $(this).text(pausado ? 'Reanudar' : 'Pausar');
            
            if (!pausado) {
                iniciarAnimacion();
            }
        });
        
        // Cerrar galería
        $('.cerrar-galeria').click(function() {
            cerrarGaleria();
        });
    }   
    
    // Configurar eventos táctiles para móvil
    function configurarEventosTactiles() {
        const galeriaTrack = $('.galeria-track')[0];
        
        // Eventos para toque (móvil)
        galeriaTrack.addEventListener('touchstart', handleTouchStart, { passive: false });
        galeriaTrack.addEventListener('touchmove', handleTouchMove, { passive: false });
        galeriaTrack.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // Eventos para ratón (escritorio)
        galeriaTrack.addEventListener('mousedown', handleMouseDown);
        galeriaTrack.addEventListener('mousemove', handleMouseMove);
        galeriaTrack.addEventListener('mouseup', handleMouseUp);
        galeriaTrack.addEventListener('mouseleave', handleMouseLeave);
        
        // Prevenir el comportamiento por defecto del arrastre en imágenes
        $('.galeria-img').on('dragstart', function(e) {
            e.preventDefault();
        });
        
        // Permitir hacer zoom en imágenes con doble toque
        $('.galeria-item').on('dblclick', function() {
            $(this).toggleClass('zoom');
        });
        
        // Para móvil: toque doble
        let lastTouchEnd = 0;
        $('.galeria-item').on('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                // Doble toque detectado
                $(this).toggleClass('zoom');
                e.preventDefault();
            }
            lastTouchEnd = now;
        });
    }
    
    // Manejadores de eventos táctiles
    function handleTouchStart(e) {
        if (!galeriaActiva) return;
        e.preventDefault();
        
        // Detener animación automática temporalmente
        if (animacionId) {
            cancelAnimationFrame(animacionId);
            animacionId = null;
        }
        
        isDragging = true;
        startX = e.touches[0].clientX;
        currentX = startX;
        
        // Guardar el offset actual
        dragOffset = posicion;
        
        // Añadir clase para feedback visual
        $('.galeria-track').addClass('dragging');
    }
    
    function handleTouchMove(e) {
        if (!isDragging || !galeriaActiva) return;
        e.preventDefault();
        
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        
        // Mover la galería según el desplazamiento táctil
        posicion = dragOffset + deltaX;
        
        // Aplicar transformación inmediata
        $('.galeria-inner').css('transform', `translateX(${posicion}px)`);
        
        // Calcular velocidad para el momentum (más sensible)
        velocidadDespuesDeArrastre = deltaX / 5;
    }
    
    function handleTouchEnd(e) {
        if (!isDragging || !galeriaActiva) return;
        e.preventDefault();
        
        isDragging = false;
        $('.galeria-track').removeClass('dragging');
        
        // Aplicar momentum (inercia) al soltar
        aplicarMomentum();
    }
    
    // Manejadores de eventos de ratón (para escritorio también)
    function handleMouseDown(e) {
        if (!galeriaActiva) return;
        e.preventDefault();
        
        // Detener animación automática temporalmente
        if (animacionId) {
            cancelAnimationFrame(animacionId);
            animacionId = null;
        }
        
        isDragging = true;
        startX = e.clientX;
        currentX = startX;
        
        // Guardar el offset actual
        dragOffset = posicion;
        
        // Cambiar cursor y añadir clase para feedback visual
        $('.galeria-track').css('cursor', 'grabbing').addClass('dragging');
    }
    
    function handleMouseMove(e) {
        if (!isDragging || !galeriaActiva) return;
        e.preventDefault();
        
        currentX = e.clientX;
        const deltaX = currentX - startX;
        
        // Mover la galería según el desplazamiento del ratón
        posicion = dragOffset + deltaX;
        
        // Aplicar transformación inmediata
        $('.galeria-inner').css('transform', `translateX(${posicion}px)`);
        
        // Calcular velocidad para el momentum
        velocidadDespuesDeArrastre = deltaX / 8;
    }
    
    function handleMouseUp(e) {
        if (!isDragging || !galeriaActiva) return;
        
        isDragging = false;
        
        // Restaurar cursor y remover clase
        $('.galeria-track').css('cursor', 'grab').removeClass('dragging');
        
        // Aplicar momentum (inercia) al soltar
        aplicarMomentum();
    }
    
    function handleMouseLeave(e) {
        if (isDragging && galeriaActiva) {
            handleMouseUp(e);
        }
    }
    
    // Aplicar momentum (inercia) después de soltar
    function aplicarMomentum() {
        // Aplicar momentum incluso con velocidad baja para mejor experiencia
        aplicarMomentumAnimacion(velocidadDespuesDeArrastre);
    }
    
    // Animación de momentum
    function aplicarMomentumAnimacion(velocidadInicial) {
        let velocidadMomentum = velocidadInicial;
        const deceleracion = 0.92; // Factor de deceleración (más suave)
        
        function momentumStep() {
            // Aplicar velocidad de momentum
            posicion += velocidadMomentum;
            
            // Reducir velocidad gradualmente
            velocidadMomentum *= deceleracion;
            
            // Obtener el ancho total del contenido
            const galeriaInner = $('.galeria-inner');
            const anchoTotal = galeriaInner.width();
            
            // Si hemos recorrido todo el ancho, reiniciar posición
            if (Math.abs(posicion) >= anchoTotal / 2) {
                posicion = 0;
            }
            
            // Aplicar transformación
            galeriaInner.css('transform', `translateX(${posicion}px)`);
            
            // Continuar momentum hasta que la velocidad sea muy baja
            if (Math.abs(velocidadMomentum) > 0.05) {
                momentumId = requestAnimationFrame(momentumStep);
            } else {
                // Cuando termine el momentum, reanudar animación automática
                iniciarAnimacion();
            }
        }
        
        // Iniciar animación de momentum
        momentumId = requestAnimationFrame(momentumStep);
    }
    
    // Animar la galería automáticamente
    function animarGaleria() {
        if (pausado || isDragging) return;
        
        const galeriaInner = $('.galeria-inner');
        
        // Mover las imágenes de derecha a izquierda
        posicion -= velocidad;
        
        // Obtener el ancho total del contenido
        const anchoTotal = galeriaInner.width();
        
        // Si hemos recorrido todo el ancho, reiniciar posición
        if (Math.abs(posicion) >= anchoTotal / 2) {
            posicion = 0;
        }
        
        // Aplicar transformación
        galeriaInner.css('transform', `translateX(${posicion}px)`);
        
        // Continuar animación
        animacionId = requestAnimationFrame(animarGaleria);
    }
    
    // Iniciar animación
    function iniciarAnimacion() {
        // Cancelar momentum si está activo
        if (momentumId) {
            cancelAnimationFrame(momentumId);
            momentumId = null;
        }
        
        // Cancelar animación anterior si existe
        if (animacionId) {
            cancelAnimationFrame(animacionId);
        }
        
        // Iniciar nueva animación
        animacionId = requestAnimationFrame(animarGaleria);
    }
    
    // Abrir galería
    function abrirGaleria() {
        $('#galeria').addClass('activo');
        galeriaActiva = true;
        
        // Establecer cursor inicial
        $('.galeria-track').css('cursor', 'grab');
        
        // Disparar evento para reproducir audio
        $(document).trigger('galeriaAbierta');
        
        // Iniciar animación después de un breve delay para que todo cargue
        setTimeout(() => {
            iniciarAnimacion();
        }, 100);
    }
    
    // Cerrar galería
    function cerrarGaleria() {
        $('#galeria').removeClass('activo');
        galeriaActiva = false;
        pausado = false;
        $('#btn-pausar').text('Pausar');
        
        // Restaurar velocidad base
        velocidad = velocidadBase;
        
        // Cancelar todas las animaciones
        if (animacionId) {
            cancelAnimationFrame(animacionId);
            animacionId = null;
        }
        
        if (momentumId) {
            cancelAnimationFrame(momentumId);
            momentumId = null;
        }
        
        // Disparar evento para detener audio
        $(document).trigger('galeriaCerrada');
        
        // Restaurar posición y remover zoom
        posicion = 0;
        $('.galeria-inner').css('transform', 'translateX(0px)');
        $('.galeria-item').removeClass('zoom');
    }
    
    // Configurar el corazón para abrir la galería
    function configurarCorazon() { 
        // También el enlace invisible
        $('.mostrar a').on('click', function(e) {
            console.log('Enlace clickeado');
            e.preventDefault();
            e.stopPropagation();
            abrirGaleria();
            return false;
        });
    }
    
    // Inicializar cuando el documento esté listo
    inicializarGaleria();
    configurarCorazon();
    
    // Asegurar que el video de fondo continúe
    $('#bgVideo').on('pause', function() {
        this.play();
    });
});