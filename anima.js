document.addEventListener('DOMContentLoaded', function() {
    let imagenesCargadas = 0;
    let audioCargado = false;
    let videoCargado = false;
    
    const preloader = document.getElementById('preloader');
    const loadingProgress = document.querySelector('.loading-progress');
    const cartaContainer = document.querySelector('.cartaHecha');
    
    window.imagenCargada = function() {
        imagenesCargadas++;
        actualizarProgreso();
    };
    
    function actualizarProgreso() {
        const totalImagenes = 44;
        const cargados = imagenesCargadas + (audioCargado ? 1 : 0) + (videoCargado ? 1 : 0);
        const porcentaje = Math.round((cargados / totalImagenes) * 100);
        
        // JavaScript nativo para actualizar texto
        if (loadingProgress) {
            loadingProgress.textContent = `${porcentaje}%`;
        }
        
        if (porcentaje === 100) {
            setTimeout(() => {
                // JavaScript nativo para manejar clases
                if (preloader) {
                    preloader.classList.add('hidden');
                }
                
                if (cartaContainer) {
                    cartaContainer.classList.remove('content-hidden');
                    cartaContainer.classList.add('content-visible');
                }
                
                const video = document.getElementById('bgVideo');
                if (video) {
                    video.play().catch(e => {
                        console.log("Dispositivo bloquea el video");
                    });
                }
            }, 800);
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
            videoCargado = true;
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
            audioCargado = true;
            actualizarProgreso();
        });
        
        // Forzar carga del audio
        audio.load();
    } else {
        audioCargado = true;
        actualizarProgreso();
    }
    
    function precargarImagenesGaleria() {
        for (let i = 1; i <= 40; i++) {
            const img = new Image();
            img.onload = window.imagenCargada;
            img.onerror = window.imagenCargada;
            img.src = `recuerdos/${i}.jpeg`;
        }
    }

    // Precargar imágenes de la carta
    function precargarImagenesCarta() {
        const imagenesCarta = [
            'imagenes/marca3.png',
            'imagenes/marca4.png'
        ];
        
        imagenesCarta.forEach(src => {
            const img = new Image();
            img.onload = window.imagenCargada;
            img.onerror = window.imagenCargada;
            img.src = src;
        });
    }
    
    precargarImagenesCarta();
    precargarImagenesGaleria();
    
    // Eventos personalizados con JavaScript nativo
    document.addEventListener('galeriaAbierta', function() {
        if (audio && audioCargado) {
            audio.currentTime = 0;
            audio.play().catch(e => {
                console.log("Error al reproducir audio:", e);
            });
        }
    });

    document.addEventListener('galeriaCerrada', function() {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
});