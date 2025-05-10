const menusItemsDropDown = document.querySelectorAll('.menu-item-dropdown');
const menusItemsStatic = document.querySelectorAll('.menu-item-static');
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menu-btn');

// Botón de minimizar
menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('minimize');
});

// Manejo de submenús
menusItemsDropDown.forEach((menuItem) => {
    const subMenu = menuItem.querySelector('.sub-menu');

    // Abrir / cerrar submenú con click
    menuItem.addEventListener('click', (e) => {
        e.stopPropagation(); // evitar conflictos

        const isActive = menuItem.classList.toggle('sub-menu-toggle');

        if (isActive) {
            subMenu.style.height = `${subMenu.scrollHeight + 6}px`;
            subMenu.style.padding = '0.2rem 0';
        } else {
            subMenu.style.height = '0';
            subMenu.style.padding = '0';
        }

        // Cerrar otros submenús
        menusItemsDropDown.forEach((item) => {
            if (item !== menuItem) {
                const otherSubMenu = item.querySelector('.sub-menu');
                item.classList.remove('sub-menu-toggle');
                otherSubMenu.style.height = '0';
                otherSubMenu.style.padding = '0';
            }
        });
    });

    let timeout;

    menuItem.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            if (!menuItem.matches(':hover')) {
                menuItem.classList.remove('sub-menu-toggle');
                subMenu.style.height = '0';
                subMenu.style.padding = '0';
            }
        }, 200); // pequeña espera para permitir clics
    });

    menuItem.addEventListener('mouseenter', () => {
        clearTimeout(timeout); // si el mouse vuelve, cancela el cierre
    });
});

// Cierre de submenús desde ítems estáticos
menusItemsStatic.forEach((menuItem) => {
    menuItem.addEventListener('click', () => {
        if (sidebar.classList.contains('minimize')) return;

        menusItemsDropDown.forEach((item) => {
            const otherSubmenu = item.querySelector('.sub-menu');
            if (otherSubmenu) {
                item.classList.remove('sub-menu-toggle');
                otherSubmenu.style.height = '0';
                otherSubmenu.style.padding = '0';
            }
        });
    });
});

// Función para añadir clases al menú
function addClassToMenu(classData) {
    // Buscar el submenú de "Mis cursos"
    const aulaVirtualItem = document.querySelector('.menu-item-dropdown:nth-child(3)');
    const subMenu = aulaVirtualItem.querySelector('.sub-menu');
    
    // Crear un nuevo elemento de lista para la clase
    const classItem = document.createElement('li');
    classItem.innerHTML = `<a href="#" class="sub-menu-link class-item" data-id="${classData.id}">${classData.nombre}</a>`;
    
    // Añadir el elemento al submenú
    subMenu.appendChild(classItem);
    
    // Actualizar la altura del submenú si está abierto
    if (aulaVirtualItem.classList.contains('sub-menu-toggle')) {
        subMenu.style.height = `${subMenu.scrollHeight + 6}px`;
    }
    
    // Añadir evento click al elemento
    classItem.querySelector('.class-item').addEventListener('click', (e) => {
        e.preventDefault();
        const classId = e.target.getAttribute('data-id');
        loadClassContent(classId);
    });
}

// Cargar las clases guardadas al iniciar
function loadSavedClasses() {
    const savedClasses = JSON.parse(localStorage.getItem('userClasses')) || [];
    savedClasses.forEach(classData => {
        addClassToMenu(classData);
    });
}

// Cargar al iniciar la página
window.addEventListener('DOMContentLoaded', () => {
    loadSavedClasses();
});

// Función para cargar el contenido de una clase
function loadClassContent(classId) {
    const iframe = document.querySelector('#main-content iframe');
    if (iframe) {
        iframe.contentWindow.postMessage({
            type: 'loadClass',
            classId: classId
        }, '*');
    }
}