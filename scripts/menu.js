document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const subMenuToggles = document.querySelectorAll('.menu-item-dropdown > .menu-link');
    
    // Cargar configuraciones al iniciar
    cargarConfiguraciones();
    
    // Evento para el botón de menú
    menuBtn.addEventListener('click', toggleSidebar);
    
    // Eventos para los submenús desplegables
    subMenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.parentElement.tagName === 'A') {
                e.preventDefault();
            }
            
            const parentItem = this.parentElement;
            const subMenu = this.nextElementSibling;
            
            // Cerrar otros submenús abiertos
            if (!parentItem.classList.contains('sub-menu-toggle')) {
                document.querySelectorAll('.menu-item-dropdown').forEach(item => {
                    if (item !== parentItem) {
                        item.classList.remove('sub-menu-toggle');
                        const otherSubMenu = item.querySelector('.sub-menu');
                        if (otherSubMenu) {
                            otherSubMenu.style.height = '0';
                        }
                    }
                });
            }
            
            // Alternar el submenú actual
            parentItem.classList.toggle('sub-menu-toggle');
            
            if (subMenu) {
                if (parentItem.classList.contains('sub-menu-toggle')) {
                    subMenu.style.height = subMenu.scrollHeight + 'px';
                } else {
                    subMenu.style.height = '0';
                }
            }
        });
    });
    
    // Cargar cursos del usuario
    updateMenuClasses();
    
    // Escuchar mensajes desde iframes
    window.addEventListener('message', manejarMensajes);
});

// Función para alternar la barra lateral
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menu-btn');
    
    sidebar.classList.toggle('close');
    menuBtn.querySelector('i').classList.toggle('bx-chevrons-right');
    menuBtn.querySelector('i').classList.toggle('bx-chevrons-left');
    
    // Ajustar submenús abiertos al cambiar el tamaño
    if (sidebar.classList.contains('close')) {
        document.querySelectorAll('.sub-menu').forEach(subMenu => {
            subMenu.style.height = '0';
        });
    } else {
        document.querySelectorAll('.menu-item-dropdown.sub-menu-toggle').forEach(item => {
            const subMenu = item.querySelector('.sub-menu');
            if (subMenu) {
                subMenu.style.height = subMenu.scrollHeight + 'px';
            }
        });
    }
}

// Función para cargar contenido dinámicamente
function loadContent(page, action) {
    const content = document.getElementById('main-content');
    
    switch(page) {
        case 'planificador':
            content.innerHTML = '<iframe src="planificador.php" width="100%" height="100%" style="border: none;"></iframe>';
            break;
        case 'mis_cursos':
            content.innerHTML = '<iframe src="clases.php" width="100%" height="100%" style="border: none;"></iframe>';
            
            if (action === 'showForm') {
                setTimeout(() => {
                    const iframe = document.querySelector('#main-content iframe');
                    if (iframe) {
                        iframe.contentWindow.postMessage({
                            type: 'showAddForm'
                        }, '*');
                    }
                }, 500);
            }
            break;
        case 'mis_apuntes':
            content.innerHTML = '<iframe src="apuntes.php" width="100%" height="100%" style="border: none;"></iframe>';
            break;
        case 'home':
            content.innerHTML = '<iframe src="home.php" width="100%" height="100%" style="border: none;"></iframe>';
            break;
        case 'ayuda':
            content.innerHTML = '<iframe src="ayuda.html" width="100%" height="100%" style="border: none;"></iframe>';
            break;
        case 'configuracion':
            content.innerHTML = '<iframe src="configuracion.html" width="100%" height="100%" style="border: none;"></iframe>';
            break;
        default:
            content.innerHTML = '<iframe src="home.php" width="100%" height="100%" style="border: none;"></iframe>';
    }
}

// Función para actualizar las clases en el menú
function updateMenuClasses() {
    const classes = JSON.parse(localStorage.getItem('userClasses')) || [];
    const aulaVirtualItem = document.querySelector('.menu-item-dropdown:nth-child(3)');
    const subMenu = aulaVirtualItem.querySelector('.sub-menu');
    
    // Eliminar solo los elementos de clase
    const existingClasses = subMenu.querySelectorAll('.class-item');
    existingClasses.forEach(item => {
        item.parentElement.remove();
    });
    
    // Añadir las clases actualizadas
    classes.forEach(classData => {
        const classItem = document.createElement('li');
        classItem.innerHTML = `<a href="#" class="sub-menu-link class-item" data-id="${classData.id}">${classData.nombre}</a>`;
        
        // Insertar antes del último elemento
        subMenu.insertBefore(classItem, subMenu.children[2]);
        
        // Añadir evento click
        classItem.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            const classId = e.target.getAttribute('data-id');
            loadContent('mis_cursos');
            
            setTimeout(() => {
                const iframe = document.querySelector('#main-content iframe');
                if (iframe) {
                    iframe.contentWindow.postMessage({
                        type: 'loadClass',
                        classId: classId
                    }, '*');
                }
            }, 500);
        });
    });
    
    // Ajustar altura del submenú si está abierto
    if (aulaVirtualItem.classList.contains('sub-menu-toggle')) {
        subMenu.style.height = `${subMenu.scrollHeight}px`;
    }
}

// Función para manejar mensajes de iframes
function manejarMensajes(event) {
    if (!event.data) return;
    
    switch(event.data.type) {
        case 'addClass':
        case 'updateMenu':
            updateMenuClasses();
            break;
        case 'cambiarTema':
            document.body.classList.toggle('dark-mode', event.data.tema === 'oscuro');
            localStorage.setItem('tema', event.data.tema);
            break;
        case 'cambiarTamañoFuente':
            document.body.style.fontSize = event.data.tamaño;
            localStorage.setItem('fuente', event.data.tamaño);
            break;
        case 'actualizarFotoPerfil':
            const userImg = document.querySelector('.user-img img');
            if (userImg) {
                userImg.src = event.data.foto;
                localStorage.setItem('foto-perfil', event.data.foto);
            }
            break;
    }
}

// Función para cargar configuraciones guardadas
function cargarConfiguraciones() {
    // Cargar tema
    const tema = localStorage.getItem('tema') || 'claro';
    document.body.classList.toggle('dark-mode', tema === 'oscuro');
    
    // Cargar tamaño de fuente
    const fuente = localStorage.getItem('fuente') || '16px';
    document.body.style.fontSize = fuente;
    
    // Cargar foto de perfil
    const fotoPerfil = localStorage.getItem('foto-perfil');
    const userImg = document.querySelector('.user-img img');
    if (fotoPerfil && userImg) {
        userImg.src = fotoPerfil;
    }
}

// Redimensionar submenús cuando cambia el tamaño de la ventana
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar.classList.contains('close')) {
        document.querySelectorAll('.menu-item-dropdown.sub-menu-toggle').forEach(item => {
            const subMenu = item.querySelector('.sub-menu');
            if (subMenu) {
                subMenu.style.height = subMenu.scrollHeight + 'px';
            }
        });
    }
});
