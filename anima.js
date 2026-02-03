// Archivo: anima.js (modificado)
$(document).ready(function() {
    
    const video = document.getElementById('bgVideo');
    if (video) {
        video.play().catch(e => {
            console.log("Autoplay bloqueado, intentando reproducir con interacción del usuario");
        });
    }
    
    // Reproducir audio de la galería cuando se abra
    $(document).on('galeriaAbierta', function() {
        const audio = document.getElementById('galeriaAudio');
        if (audio) {
            audio.currentTime = 0; // Reiniciar al inicio
            audio.play().catch(e => {
                console.log("Error al reproducir audio:", e);
            });
        }
    });
    
    // Detener audio cuando se cierre la galería
    $(document).on('galeriaCerrada', function() {
        const audio = document.getElementById('galeriaAudio');
        if (audio) {
            audio.pause();
            audio.currentTime = 0; // Opcional: reiniciar al inicio
        }
    });
});