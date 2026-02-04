$(document).ready(function() {

    window.imagenCargada = function() {
        imagenesCargadas++;
        console.log(`✅ Imagen ${imagenesCargadas}/${totalImagenes} cargada`);
        actualizarProgreso();
    };

    let totalImagenes = 0;
    let imagenesCargadas = 0;
    let audioCargado = false;
    let videoCargado = false;
    
    // Elementos del preloader
    const preloader = $('#preloader');
    const loadingProgress = $('.loading-progress');
    const cartaContainer = $('.cartaHecha');
    
    // Función para actualizar progreso
    function actualizarProgreso() {
        const totalElementos = totalImagenes + 2; // +2 para video y audio
        const cargados = imagenesCargadas + (audioCargado ? 1 : 0) + (videoCargado ? 1 : 0);
        const porcentaje = Math.round((cargados / totalElementos) * 100);
        
        loadingProgress.text(`${porcentaje}%`);
        
        // Si todo está cargado, mostrar contenido
        if (porcentaje === 100) {
            setTimeout(() => {
                preloader.addClass('hidden');
                cartaContainer.removeClass('content-hidden').addClass('content-visible');
                
                // Intentar reproducir video de fondo
                const video = document.getElementById('bgVideo');
                if (video) {
                    video.play().catch(e => {
                        console.log("Autoplay bloqueado, se reproducirá con interacción del usuario");
                    });
                }
            }, 800); // Pequeño delay para suavizar la transición
        }
    }
    
    // Precargar video
    const video = document.getElementById('bgVideo');
    if (video) {
        video.addEventListener('loadeddata', function() {
            videoCargado = true;
            actualizarProgreso();
        });
        
        video.addEventListener('error', function() {
            videoCargado = true; // Marcar como cargado incluso si hay error
            actualizarProgreso();
        });
    } else {
        videoCargado = true;
        actualizarProgreso();
    }
    
    // Precargar audio
    const audio = document.getElementById('galeriaAudio');
    if (audio) {
        audio.addEventListener('canplaythrough', function() {
            audioCargado = true;
            actualizarProgreso();
        });
        
        audio.addEventListener('error', function() {
            audioCargado = true; // Marcar como cargado incluso si hay error
            actualizarProgreso();
        });
        
        // Forzar carga del audio
        audio.load();
    } else {
        audioCargado = true;
        actualizarProgreso();
    }
    
    // Contar imágenes que necesitan cargarse
    function contarImagenes() {
        // Imágenes en la galería
        totalImagenes += 40; // Tus 40 imágenes de recuerdos
        
        // Imágenes de la carta (marca1 y marca2)
        totalImagenes += 2;
        
        actualizarProgreso();
    }
    
    // Función para registrar que una imagen se cargó
    function imagenCargada() {
        imagenesCargadas++;
        actualizarProgreso();
    }
    
    function precargarImagenesGaleria() {
        // Lista de TODAS las imágenes de la galería
        const imagenesGaleria = [];
        
        // Generar rutas del 1 al 40
        for (let i = 1; i <= 40; i++) {
            imagenesGaleria.push(`recuerdos/${i}.jpeg`);
        }
        
        // Precargar cada una
        imagenesGaleria.forEach(src => {
            const img = new Image();
            img.onload = imagenCargada;
            img.onerror = imagenCargada;
            img.src = src;
        });
    }

    // Precargar imágenes de la carta
    function precargarImagenesCarta() {
        const imagenesCarta = [
            'imagenes/marca3.png',
            'imagenes/marca4.png'
        ];
        
        imagenesCarta.forEach(src => {
            const img = new Image();
            img.onload = imagenCargada;
            img.onerror = imagenCargada;
            img.src = src;
        });
    }
    
    // Inicializar contador y comenzar precarga
    contarImagenes();
    precargarImagenesCarta();
    precargarImagenesGaleria();
    
    // Reproducir audio de la galería cuando se abra
    $(document).on('galeriaAbierta', function() {
        if (audio && audioCargado) {
            audio.currentTime = 0;
            audio.play().catch(e => {
                console.log("Error al reproducir audio:", e);
            });
        }
    });
    
    // Detener audio cuando se cierre la galería
    $(document).on('galeriaCerrada', function() {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
});