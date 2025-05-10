document.addEventListener('DOMContentLoaded', function() {
    // Inicialización - Cierra todos los items al cargar
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.classList.remove('active');
    });

    // Funcionalidad para desplegar/plegar preguntas FAQ
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Cierra todos los demás items primero
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    
                    // Pausa cualquier video en los items que se cierran
                    const videos = otherItem.querySelectorAll('video');
                    videos.forEach(video => {
                        video.pause();
                    });
                }
            });
            
            // Abre/cierra el item clickeado
            item.classList.toggle('active');
            
            // Si se está cerrando, pausa el video
            if (!item.classList.contains('active')) {
                const videos = item.querySelectorAll('video');
                videos.forEach(video => {
                    video.pause();
                });
            }
        });
    });

    // Funcionalidad de búsqueda
    const searchInput = document.getElementById('help-search');
    const searchBtn = document.querySelector('.search-container button');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            // Mostrar todos si la búsqueda está vacía
            faqItems.forEach(item => {
                item.style.display = '';
                item.classList.remove('active');
            });
            return;
        }
        
        let hasResults = false;
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question span').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = '';
                item.classList.add('active');
                hasResults = true;
                
                // Desplázate al primer resultado
                if (!hasResults) {
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        if (!hasResults) {
            alert('No se encontraron resultados para: ' + searchTerm);
        }
    }

    // Control de videos
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        const closeBtn = container.querySelector('.close-video');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                video.pause();
                container.style.display = 'none';
                const preview = container.previousElementSibling;
                if (preview && preview.classList.contains('video-preview')) {
                    preview.style.display = 'block';
                }
            });
        }
    });
});

// Funciones globales para control de videos
function openVideo(element) {
    const container = element.nextElementSibling;
    const video = container.querySelector('video');
    const videoSrc = element.getAttribute('data-video-src');
    
    element.style.display = 'none';
    container.style.display = 'block';
    video.src = videoSrc;
    video.play().catch(e => console.log('Error al reproducir video:', e));
}

function closeVideo(button) {
    const container = button.parentElement;
    const video = container.querySelector('video');
    const preview = container.previousElementSibling;
    
    video.pause();
    video.currentTime = 0;
    container.style.display = 'none';
    
    if (preview && preview.classList.contains('video-preview')) {
        preview.style.display = 'block';
    }
}

document.getElementById('show-email').addEventListener('click', function() {
    const emailInfo = document.getElementById('email-info');
    emailInfo.style.opacity = emailInfo.style.opacity === '1' ? '0' : '1';
    emailInfo.style.visibility = emailInfo.style.visibility === 'visible' ? 'hidden' : 'visible';
    document.getElementById('phone-info').style.opacity = '0';
    document.getElementById('phone-info').style.visibility = 'hidden';
});

document.getElementById('show-phone').addEventListener('click', function() {
    const phoneInfo = document.getElementById('phone-info');
    phoneInfo.style.opacity = phoneInfo.style.opacity === '1' ? '0' : '1';
    phoneInfo.style.visibility = phoneInfo.style.visibility === 'visible' ? 'hidden' : 'visible';
    document.getElementById('email-info').style.opacity = '0';
    document.getElementById('email-info').style.visibility = 'hidden';
});

// Ocultar al hacer clic fuera
document.addEventListener('click', function(e) {
    if (!e.target.closest('.contact-option')) {
        document.querySelectorAll('.contact-info').forEach(info => {
            info.style.opacity = '0';
            info.style.visibility = 'hidden';
        });
    }
});