<?php 
include_once '../includes/verificar_sesion.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu</title>
    <link rel="stylesheet" href="../assets/styles/menu.css">
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
</head>
<body>
    <div class="sidebar" id="sidebar">
        <div class="header">
            <div class="menu-btn" id="menu-btn">
                <i class='bx bx-chevrons-left'></i>
            </div>
            <div class="user">
                <div class="user-img">
                    <img src="../assets/imagenes/perfil.png" alt="user">
                    <div class="user-tooltip user-date">
                        <span class="name" id="username">
                            <?php echo isset($_SESSION['userName']) ? htmlspecialchars($_SESSION['userName']) : 'Invitado'; ?>
                        </span>
                        <span class="rol" id="rol">
                            <?php echo isset($_SESSION['rol']) ? htmlspecialchars($_SESSION['rol']) : 'Uknown'; ?>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="menu-container">
            <ul class="menu">
                <li class="menu-item menu-item-static">
                    <a href="#" class="menu-link" onclick="loadContent('home')">
                        <i class='bx bx-home-smile'></i>
                        <span>Home</span>
                    </a>
                </li>
                <li class="menu-item menu-item-dropdown">
                    <a href="#" class="menu-link dropdown-toggle">
                        <i class='bx bx-book-reader'></i>
                        <span>Mi Espacio</span>
                        <i class='bx bx-chevron-down dropdown-icon'></i>
                    </a>
                    <ul class="sub-menu">
                        <li class="menu-item menu-item-dropdown">
                            <a href="#" class="menu-link dropdown-toggle" id="mis-apuntes-toggle">
                                <i class='bx bx-book-reader'></i>
                                <span>Mis apuntes</span>
                                <i class='bx bx-chevron-down dropdown-icon'></i>
                            </a>
                            <ul class="sub-menu" id="sub-menu-apuntes">
                            <li class="courses-header">
                                <span>Nuevo</span>
                                <div class="add-class-btn pulse" onclick="agregarNuevoApunte()">
                                    <i class='bx bx-plus'></i>
                                </div>
                            </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#" class="sub-menu-link" onclick="loadContent('planificador')">Mi planificador</a>
                        </li>
                    </ul>
                </li>
                <li class="menu-item menu-item-dropdown">
                    <a href="#" class="menu-link dropdown-toggle">
                        <i class='bx bx-chalkboard'></i>
                        <span>Mi Aula Virtual</span>
                        <i class='bx bx-chevron-down dropdown-icon'></i>
                    </a>
                    <ul class="sub-menu">
                        <li>
                            <div class="courses-header">
                                <span>Mis cursos</span>
                                <div class="add-class-btn pulse" onclick="loadContent('mis_cursos', 'showForm')">
                                    <i class='bx bx-plus'></i>
                                </div>
                            </div>
                        </li>
                        <li><a href="#" class="sub-menu-link" onclick="loadContent('mis_cursos')">Ver todos mis cursos</a></li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="footer">
            <ul class="menu">
                <li class="menu-item menu-item-static">
                    <a href="#" class="menu-link" onclick="loadContent('configuracion')">
                        <i class='bx bx-cog'></i>
                        <span>Configuración</span>
                    </a>
                </li>
                <li class="menu-item menu-item-static">
                    <a href="#" class="menu-link" onclick="loadContent('ayuda')">
                        <i class='bx bx-help-circle'></i>
                        <span>Ayuda</span>
                    </a>
                </li>
                <li class="menu-item menu-item-static">
                    <a href="../includes/cerrar_sesion.php" class="menu-link">
                        <i class='bx bx-log-out'></i>
                        <span>Cerrar Sesión</span>
                    </a>
                </li>
            </ul>
            <div class="brand">
                <img src="../assets/imagenes/idea.svg" alt="logo">
                <span>EPA!</span>
            </div>
        </div>
    </div>

    <div id="main-content">
        <!-- El contenido del centro se cambiará dinámicamente aquí -->
    </div>

    <script src="../assets/scripts/menu.js"></script>
    <script>
        // Función para cargar contenido dinámicamente
        function loadContent(page, action) {
            const sidebar = document.getElementById('sidebar');
            // Expandir el menú si está minimizado
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
        }

        // Función para actualizar las clases en el menú
        function updateMenuClasses() {
            const classes = JSON.parse(localStorage.getItem('userClasses')) || [];
            const aulaVirtualItem = document.querySelector('.menu-item-dropdown:nth-child(3)');
            const subMenu = aulaVirtualItem.querySelector('.sub-menu');
            
            // Eliminar solo los elementos de clase, manteniendo los primeros 2 elementos
            const existingClasses = subMenu.querySelectorAll('.class-item');
            existingClasses.forEach(item => {
                item.parentElement.remove();
            });
            
            // Añadir las clases actualizadas
            classes.forEach(classData => {
                const classItem = document.createElement('li');
                classItem.innerHTML = `<a href="#" class="sub-menu-link class-item" data-id="${classData.id}">${classData.nombre}</a>`;
                
                // Insertar antes del último elemento ("Ver todos mis cursos")
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
        }

        // Función para cerrar todos los submenús excepto el especificado
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

        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            loadContent('home');
            updateMenuClasses();
            
            // Configurar el botón de menú
            const menuBtn = document.getElementById('menu-btn');
            const sidebar = document.getElementById('sidebar');
            
            menuBtn.addEventListener('click', function() {
                sidebar.classList.toggle('minimize');
                
                // Cambiar el icono
                const icon = menuBtn.querySelector('i');
                if (sidebar.classList.contains('minimize')) {
                    icon.classList.remove('bx-chevrons-left');
                    icon.classList.add('bx-chevrons-right');
                } else {
                    icon.classList.remove('bx-chevrons-right');
                    icon.classList.add('bx-chevrons-left');
                }
            });

            // Manejar clicks en los dropdowns
            document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    const sidebar = document.getElementById('sidebar');
                    
                    // Si el menú está minimizado, solo expandirlo
                    if (sidebar.classList.contains('minimize')) {
                        sidebar.classList.remove('minimize');
                        const icon = document.querySelector('#menu-btn i');
                        icon.classList.remove('bx-chevrons-right');
                        icon.classList.add('bx-chevrons-left');
                        return;
                    }
                    
                    // Si no está minimizado, proceder con el comportamiento normal
                    const parentItem = this.closest('.menu-item-dropdown');
                    
                    // Si es el toggle de "Mis apuntes", comportamiento específico
                    if (this.id === 'mis-apuntes-toggle') {
                        parentItem.classList.toggle('active');
                        const icon = this.querySelector('.dropdown-icon');
                        icon.classList.toggle('rotate-180');
                        const subMenu = parentItem.querySelector('.sub-menu');
                        if (parentItem.classList.contains('active')) {
                            subMenu.style.maxHeight = subMenu.scrollHeight + 'px';
                        } else {
                            subMenu.style.maxHeight = '0';
                        }
                        return;
                    }
                    
                    // Cerrar otros submenús
                    closeOtherSubmenus(parentItem);
                    
                    // Alternar el estado del submenú actual
                    parentItem.classList.toggle('active');
                    
                    // Rotar el icono
                    const icon = this.querySelector('.dropdown-icon');
                    icon.classList.toggle('rotate-180');
                    
                    // Alternar submenú
                    const subMenu = parentItem.querySelector('.sub-menu');
                    if (parentItem.classList.contains('active')) {
                        subMenu.style.maxHeight = subMenu.scrollHeight + 'px';
                    } else {
                        subMenu.style.maxHeight = '0';
                    }
                });
            });
            
            // Manejar clicks en los enlaces de submenú
            document.querySelectorAll('.sub-menu-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    const sidebar = document.getElementById('sidebar');
                    if (sidebar.classList.contains('minimize')) {
                        sidebar.classList.remove('minimize');
                        const icon = document.querySelector('#menu-btn i');
                        icon.classList.remove('bx-chevrons-right');
                        icon.classList.add('bx-chevrons-left');
                    }
                });
            });
        });
        
        // Escuchar mensajes desde iframes
        window.addEventListener('message', function(event) {
            if (event.data && (event.data.type === 'addClass' || event.data.type === 'updateMenu')) {
                updateMenuClasses();
            }
        });

        let apunteID = 0; // Variable para el ID de apuntes

        // Función para agregar un nuevo apunte
        function agregarNuevoApunte() {
            apunteID++;
            const subMenu = document.getElementById("sub-menu-apuntes");
            // Crear nuevo li
            const nuevoLi = document.createElement("li");
            const enlace = document.createElement("a");
            enlace.href = "#";
            enlace.className = "sub-menu-link";
            enlace.textContent = `Mis apuntes ${apunteID}`;
            enlace.onclick = () => loadContent(`mis_apuntes?id=${apunteID}`);

            nuevoLi.appendChild(enlace);
            subMenu.appendChild(nuevoLi);
            
            // Ajustar la altura del submenú si está abierto
            const parentItem = subMenu.closest('.menu-item-dropdown');
            if (parentItem && parentItem.classList.contains('active')) {
                subMenu.style.maxHeight = subMenu.scrollHeight + 'px';
            }
        }
    </script>
</body>
</html>