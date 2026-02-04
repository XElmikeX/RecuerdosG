window.addEventListener('load', function() {
    setTimeout(function() {
        const preloader = document.getElementById('preloader');
        const cartaHecha = document.querySelector('.cartaHecha');
        
        if (preloader && cartaHecha && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            cartaHecha.classList.remove('content-hidden');
            cartaHecha.classList.add('content-visible');
        }
    }, 10000); 
});