// Función para cargar contenido dinámicamente
function loadContent(page, action) {
    const sidebar = document.getElementById('sidebar');
    // Expandir el menú si está minimizado y no es una acción de cierre de sesión
    if (page !== '../includes/cerrar_sesion.php' && sidebar.classList.contains('minimize')) {
        sidebar.classList.remove('minimize');
        const icon = document.querySelector('#menu-btn i');
        if (icon) { // Verificar que el icono exista
            icon.classList.remove('bx-chevrons-right');
            icon.classList.add('bx-chevrons-left');
        }
    }

    const content = document.getElementById('main-content');
    if (!content) {
        console.error("Elemento main-content no encontrado.");
        return;
    }
    
    let iframeSrc = '';
    switch (page) {
        case 'planificador':
            iframeSrc = 'planificador.php';
            break;
        case 'mis_cursos':
            iframeSrc = 'clases.php';
            break;
        case 'home':
            iframeSrc = 'home.php';
            break;
        case 'ayuda':
            iframeSrc = 'ayuda.html';
            break;
        case 'configuracion':
            iframeSrc = 'configuracion.php';
            break;
        default:
            if (page.startsWith('mis_apuntes')) {
                iframeSrc = page.replace('mis_apuntes', 'apuntes.php');
            } else if (page.startsWith('../includes/cerrar_sesion.php')) {
                // Para cerrar sesión, no cargamos iframe, simplemente navegamos.
                window.location.href = page;
                return;
            } else {
                console.warn('Página desconocida para loadContent:', page);
                iframeSrc = '404.php'; // O una página de error por defecto
            }
    }
    content.innerHTML = `<iframe src="${iframeSrc}" width="100%" height="100%" style="border: none;"></iframe>`;

    if (page === 'mis_cursos' && action === 'showForm') {
        setTimeout(() => {
            const iframe = document.querySelector('#main-content iframe');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type: 'showAddForm' }, '*');
            }
        }, 500);
    }
}

// --- NUEVA LÓGICA PARA CARGAR CURSOS DEL MENÚ DESDE EL BACKEND ---
async function fetchCoursesForMenu() {
    try {
        const response = await fetch('../includes/cursos_controller.php?action=obtenerCursosParaMenu', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) {
            let errorMsg = `Error del servidor: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) errorMsg = errorData.message;
            } catch (e) { /* Ignorar si no es JSON */ }
            console.error('Error al obtener cursos para el menú (respuesta no ok):', errorMsg);
            return []; // Devolver array vacío en caso de error de respuesta
        }
        const result = await response.json();
        if (result.success) {
            return result.data || [];
        } else {
            console.error('Fallo al obtener cursos para el menú (success false):', result.message);
            return []; // Devolver array vacío si la operación no fue exitosa
        }
    } catch (error) {
        console.error('Error en fetchCoursesForMenu (catch):', error);
        return []; 
    }
}

async function renderCoursesInMenu() {
    const courses = await fetchCoursesForMenu();
    const subMenuContainer = document.getElementById('cursos-submenu-container');

    if (!subMenuContainer) {
        console.error("El contenedor del submenú de cursos ('cursos-submenu-container') no fue encontrado.");
        return;
    }

    // Identificar elementos a preservar (header y "Ver todos")
    const headerLi = subMenuContainer.querySelector('li:first-child'); // Asumiendo que el header es el primero
    const verTodosLi = subMenuContainer.querySelector('li:last-child');   // Asumiendo que "Ver todos" es el último

    // Limpiar solo los items de curso dinámicos (los que no son el header ni "Ver todos")
    const dynamicCourseItems = Array.from(subMenuContainer.children).filter(li => {
        return li !== headerLi && li !== verTodosLi;
    });
    dynamicCourseItems.forEach(item => item.remove());

    if (courses.length > 0) {
        courses.forEach(course => {
            const listItem = document.createElement('li');
            // No añadir clase 'menu-item' aquí para no confundir con los items principales
            listItem.innerHTML = `<a href="#" class="sub-menu-link dynamic-course-item" data-id="${course.id}">
                                    <i class='bx bx-chevron-right'></i> 
                                    <span class="sub-menu-text">${course.nombre}</span>
                                 </a>`;
            
            const link = listItem.querySelector('a.dynamic-course-item');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const classId = e.currentTarget.dataset.id;
                loadContent('mis_cursos'); 
                setTimeout(() => {
                    const iframe = document.querySelector('#main-content iframe');
                    if (iframe && iframe.contentWindow) {
                        iframe.contentWindow.postMessage({ type: 'loadClassDetail', classId: classId }, '*');
                    } else {
                         console.warn("Iframe para 'mis_cursos' no encontrado o no listo para postMessage.");
                    }
                }, 500); 
            });

            // Insertar el nuevo curso antes del enlace "Ver todos mis cursos"
            if (verTodosLi) {
                subMenuContainer.insertBefore(listItem, verTodosLi);
            } else if (headerLi) { // Si "Ver todos" no existe, insertar después del header
                 subMenuContainer.insertBefore(listItem, headerLi.nextSibling);
            } else { // Si ninguno existe, simplemente añadir
                subMenuContainer.appendChild(listItem);
            }
        });
    }

    // Reajustar altura del submenú si está activo
    const parentDropdown = subMenuContainer.closest('.menu-item-dropdown');
    if (parentDropdown && parentDropdown.classList.contains('active')) {
        subMenuContainer.style.maxHeight = subMenuContainer.scrollHeight + 'px';
    }
}
// --- FIN DE LA NUEVA LÓGICA PARA CURSOS ---

// Función para cerrar todos los submenús excepto el especificado
function closeOtherSubmenus(exceptItem) {
    document.querySelectorAll('.menu-item-dropdown.active').forEach(item => {
        if (item !== exceptItem && !item.contains(exceptItem)) {
            item.classList.remove('active');
            const icon = item.querySelector('.dropdown-icon');
            if (icon) icon.classList.remove('rotate-180');
            const subMenu = item.querySelector('.sub-menu');
            if (subMenu) subMenu.style.maxHeight = '0';
        }
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadContent('home'); // Carga la página de inicio por defecto
    renderCoursesInMenu(); // Carga los cursos en el menú

    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('minimize');
            const icon = menuBtn.querySelector('i');
            if (sidebar.classList.contains('minimize')) {
                icon.classList.remove('bx-chevrons-left');
                icon.classList.add('bx-chevrons-right');
                // Cerrar todos los submenús al minimizar
                document.querySelectorAll('.menu-item-dropdown.active').forEach(item => {
                    item.classList.remove('active');
                    const subMenuIcon = item.querySelector('.dropdown-icon');
                    if (subMenuIcon) subMenuIcon.classList.remove('rotate-180');
                    const subMenu = item.querySelector('.sub-menu');
                    if (subMenu) subMenu.style.maxHeight = '0';
                });
            } else {
                icon.classList.remove('bx-chevrons-right');
                icon.classList.add('bx-chevrons-left');
            }
        });
    }

    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const currentSidebar = document.getElementById('sidebar'); // Re-obtener por si acaso
            
            if (currentSidebar && currentSidebar.classList.contains('minimize')) {
                currentSidebar.classList.remove('minimize');
                const menuButtonIcon = document.querySelector('#menu-btn i');
                if (menuButtonIcon) {
                    menuButtonIcon.classList.remove('bx-chevrons-right');
                    menuButtonIcon.classList.add('bx-chevrons-left');
                }
                return; 
            }
            
            const parentItem = this.closest('.menu-item-dropdown');
            if (!parentItem) return;

            // Cerrar otros submenús solo si no es el mismo que se está abriendo/cerrando
            if (!parentItem.classList.contains('active')) {
                 closeOtherSubmenus(parentItem);
            }
            
            parentItem.classList.toggle('active');
            const icon = this.querySelector('.dropdown-icon');
            if (icon) icon.classList.toggle('rotate-180');
            
            const subMenu = parentItem.querySelector('.sub-menu');
            if (subMenu) {
                if (parentItem.classList.contains('active')) {
                    subMenu.style.maxHeight = subMenu.scrollHeight + 'px';
                } else {
                    subMenu.style.maxHeight = '0';
                }
            }
        });
    });
    
    // Los clicks en sub-menu-link que tienen onclick="loadContent(...)" en el HTML se manejan directamente.
    // Los clicks en los cursos generados dinámicamente tienen su propio listener añadido en renderCoursesInMenu.
});

window.addEventListener('message', function(event) {
    // En un entorno de producción, deberías validar event.origin
    // if (event.origin !== 'URL_ESPERADA') return;
    if (event.data && (event.data.type === 'addClass' || event.data.type === 'updateMenu' || event.data.type === 'updateCourseListInMenu')) {
        renderCoursesInMenu(); // Actualizar la lista de cursos en el menú
    }
});

let apunteID = 0; 
function agregarNuevoApunte() {
    apunteID++;
    const subMenu = document.getElementById("sub-menu-apuntes");
    if (!subMenu) {
        console.error("Submenú de apuntes no encontrado.");
        return;
    }
    const nuevoLi = document.createElement("li");
    const enlace = document.createElement("a");
    enlace.href = "#";
    enlace.className = "sub-menu-link";
    // Usar textContent para seguridad
    enlace.textContent = `Mis apuntes ${apunteID}`; 
    enlace.onclick = () => loadContent(`mis_apuntes?id=${apunteID}`);

    nuevoLi.appendChild(enlace);
    // Insertar el nuevo apunte antes de cualquier otro elemento si el header es el primero
    const headerApuntes = subMenu.querySelector('.courses-header');
    if (headerApuntes && headerApuntes.parentElement === subMenu) {
        subMenu.insertBefore(nuevoLi, headerApuntes.nextSibling);
    } else {
        subMenu.appendChild(nuevoLi);
    }
    
    const parentItem = subMenu.closest('.menu-item-dropdown');
    if (parentItem && parentItem.classList.contains('active')) {
        subMenu.style.maxHeight = subMenu.scrollHeight + 'px';
    }
}
