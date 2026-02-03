$(window).on('load', function() {
    setTimeout(function() {
        if (!$('#preloader').hasClass('hidden')) {
            console.log('Tiempo de carga excedido, mostrando contenido de todas formas');
            $('#preloader').addClass('hidden');
            $('.cartaHecha').removeClass('content-hidden').addClass('content-visible');
        }
    }, 3000); // 10 segundos máximo
});