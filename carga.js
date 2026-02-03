$(window).on('load', function() {
    // Si después de 10 segundos aún no se cargó todo, forzar la visualización
    setTimeout(function() {
        if (!$('#preloader').hasClass('hidden')) {
            console.log('Tiempo de carga excedido, mostrando contenido de todas formas');
            $('#preloader').addClass('hidden');
            $('.cartaHecha').removeClass('content-hidden').addClass('content-visible');
        }
    }, 10000); // 10 segundos máximo
});