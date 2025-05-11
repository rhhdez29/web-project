document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const subMenuToggles = document.querySelectorAll('.menu-item-dropdown > .menu-link');
    const toggleModeBtn = document.getElementById('toggle-mode');
    
    // Inicializar modo oscuro desde localStorage
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('modo-oscuro');
        toggleModeBtn.checked = true;
    }

    // Evento para cambiar el modo oscuro
    toggleModeBtn.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('modo-oscuro');
            localStorage.setItem('darkMode', 'true');
            
            // Sincronizar modo oscuro con otros frames
            const frames = document.querySelectorAll('iframe');
            frames.forEach(frame => {
                try {
                    frame.contentWindow.postMessage({ type: 'darkMode', enabled: true }, '*');
                } catch (e) {
                    console.error('Error al sincronizar modo oscuro:', e);
                }
            });
        } else {
            document.body.classList.remove('modo-oscuro');
            localStorage.setItem('darkMode', 'false');
            
            // Sincronizar modo oscuro con otros frames
            const frames = document.querySelectorAll('iframe');
            frames.forEach(frame => {
                try {
                    frame.contentWindow.postMessage({ type: 'darkMode', enabled: false }, '*');
                } catch (e) {
                    console.error('Error al sincronizar modo oscuro:', e);
                }
            });
        }
    });
    
    cargarConfiguraciones();
    menuBtn.addEventListener('click', toggleSidebar);
    
    subMenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (sidebar.classList.contains('minimize')) {
                expandirSidebar();
                return;
            }
            
            toggleSubMenu(this);
        });
    });
    
    document.querySelectorAll('.sub-menu-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (sidebar.classList.contains('minimize')) {
                e.preventDefault();
                expandirSidebar();
                
                const href = this.getAttribute('href');
                const onclick = this.getAttribute('onclick');
                
                setTimeout(() => {
                    if (onclick) {
                        eval(onclick);
                    } else if (href && href !== '#') {
                        window.location.href = href;
                    }
                }, 300);
            }
        });
    });
    
    updateMenuClasses();
    
    window.addEventListener('message', function(event) {
        if (event.data && (event.data.type === 'addClass' || event.data.type === 'updateMenu')) {
            updateMenuClasses();
        }
    });
});

function toggleSubMenu(toggle) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('minimize')) {
        expandirSidebar();
        return;
    }

    const parentItem = toggle.closest('.menu-item-dropdown');
    const subMenu = parentItem.querySelector('.sub-menu');
    const icon = toggle.querySelector('.dropdown-icon');
    
    if (toggle.id === 'mis-apuntes-toggle') {
        parentItem.classList.toggle('active');
        if (icon) icon.classList.toggle('rotate-180');
        
        if (subMenu) {
            if (parentItem.classList.contains('active')) {
                subMenu.style.maxHeight = subMenu.scrollHeight + 'px';
            } else {
                subMenu.style.maxHeight = '0';
            }
        }
        return;
    }
    
    closeOtherSubmenus(parentItem);
    
    parentItem.classList.toggle('active');
    if (icon) icon.classList.toggle('rotate-180');
    
    if (subMenu) {
        if (parentItem.classList.contains('active')) {
            subMenu.style.maxHeight = subMenu.scrollHeight + 'px';
        } else {
            subMenu.style.maxHeight = '0';
        }
    }
}

function expandirSidebar() {
    const sidebar = document.getElementById('sidebar');
    const icon = document.querySelector('#menu-btn i');
    
    sidebar.classList.remove('minimize');
    icon.classList.remove('bx-chevrons-right');
    icon.classList.add('bx-chevrons-left');
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const icon = document.querySelector('#menu-btn i');
    
    sidebar.classList.toggle('minimize');
    
    if (sidebar.classList.contains('minimize')) {
        icon.classList.remove('bx-chevrons-left');
        icon.classList.add('bx-chevrons-right');
        
        document.querySelectorAll('.menu-item-dropdown').forEach(item => {
            item.classList.remove('active');
            const subMenu = item.querySelector('.sub-menu');
            if (subMenu) subMenu.style.maxHeight = '0';
        });
    } else {
        icon.classList.remove('bx-chevrons-right');
        icon.classList.add('bx-chevrons-left');
    }
}

function closeOtherSubmenus(exceptItem) {
    document.querySelectorAll('.menu-item-dropdown').forEach(item => {
        if (item !== exceptItem && !item.contains(exceptItem)) {
            item.classList.remove('active');
            const icon = item.querySelector('.dropdown-icon');
            if (icon) icon.classList.remove('rotate-180');
            const subMenu = item.querySelector('.sub-menu');
            if (subMenu) subMenu.style.maxHeight = '0';
        }
    });
}

function loadContent(page, action) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('minimize')) {
        sidebar.classList.remove('minimize');
        const icon = document.querySelector('#menu-btn i');
        icon.classList.remove('bx-chevrons-right');
        icon.classList.add('bx-chevrons-left');
    }

    const content = document.getElementById('main-content');
    
    if (page === 'planificador') {
        content.innerHTML = '<iframe src="planificador.php" width="100%" height="100%" style="border: none;"></iframe>';
    } 
    if (page === 'mis_cursos') {
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
    }
    if (page.startsWith('mis_apuntes')) {
        content.innerHTML = `<iframe src="${page.replace('mis_apuntes', 'apuntes.php')}" width="100%" height="100%" style="border: none;"></iframe>`;
    }
    if (page === 'home') {
        content.innerHTML = '<iframe src="home.php" width="100%" height="100%" style="border: none;"></iframe>';
    }
    if (page === 'ayuda') {
        content.innerHTML = '<iframe src="ayuda.html" width="100%" height="100%" style="border: none;"></iframe>';
    }
    if (page === 'configuracion') {
        content.innerHTML = '<iframe src="configuracion.php" width="100%" height="100%" style="border: none;"></iframe>';
    }

    // Sincronizar modo oscuro con el nuevo iframe
    setTimeout(() => {
        const iframe = document.querySelector('#main-content iframe');
        if (iframe) {
            try {
                const isDarkMode = document.body.classList.contains('modo-oscuro');
                iframe.contentWindow.postMessage({ 
                    type: 'darkMode', 
                    enabled: isDarkMode 
                }, '*');
            } catch (e) {
                console.error('Error al sincronizar modo oscuro con iframe:', e);
            }
        }
    }, 500);
}

function updateMenuClasses() {
    const classes = JSON.parse(localStorage.getItem('userClasses')) || [];
    const aulaVirtualItem = document.querySelector('.menu-item-dropdown:nth-child(3)');
    const subMenu = aulaVirtualItem.querySelector('.sub-menu');
    
    const existingClasses = subMenu.querySelectorAll('.class-item');
    existingClasses.forEach(item => {
        item.parentElement.remove();
    });
    
    classes.forEach(classData => {
        const classItem = document.createElement('li');
        classItem.innerHTML = `<a href="#" class="sub-menu-link class-item" data-id="${classData.id}">${classData.nombre}</a>`;
        
        subMenu.insertBefore(classItem, subMenu.children[2]);
        
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
}

let apunteID = 0;

function agregarNuevoApunte() {
    apunteID++;
    const subMenu = document.getElementById("sub-menu-apuntes");
    const nuevoLi = document.createElement("li");
    const enlace = document.createElement("a");
    enlace.href = "#";
    enlace.className = "sub-menu-link";
    enlace.textContent = `Mis apuntes ${apunteID}`;
    enlace.onclick = () => loadContent(`mis_apuntes?id=${apunteID}`);

    nuevoLi.appendChild(enlace);
    subMenu.appendChild(nuevoLi);
    
    const parentItem = subMenu.closest('.menu-item-dropdown');
    if (parentItem && parentItem.classList.contains('active')) {
        subMenu.style.maxHeight = subMenu.scrollHeight + 'px';
    }
}

function cargarConfiguraciones() {
    // Placeholder para futuras configuraciones
}