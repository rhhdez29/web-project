<?php 
// Verificar si el usuario ha iniciado sesión
// Si no se ha iniciado sesión, redirigir a la página de inicio
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
                <div class=" user-img">
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
                <div class="user-tooltip">
                    <div class="user-home">
                        <a href="#" class="menu-link small" onclick="loadContent('home')">
                            <i class='bx bx-home-smile'></i><span>Inicio</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="menu-container">
            <ul class="menu">
                <li class="menu-item menu-item-static home-item">
                    <a href="#" class="menu-link">
                        <i class='bx bx-home-smile' ></i>
                        <span>Home</span>
                    </a>
                </li>
                <li class="menu-item menu-item-dropdown">
                    <a href="#" class="menu-link">
                        <i class='bx bx-book-reader' ></i>
                        <span>Mi Espacio</span>
                        <i class='bx bx-chevron-down' ></i>
                    </a>
                    <ul class="sub-menu">
                        <li> <a href="#" class="sub-menu-link" onclick="loadContent('mis_apuntes')">Mis apuntes</a></li> 
                        <li> <a href="#" class="sub-menu-link" onclick="loadContent('planificador')">Mi planificador</a></li>
                        
                    </ul>
                </li>
                <li class="menu-item menu-item-dropdown">
                    <a href="#" class="menu-link">
                        <i class='bx bx-chalkboard' ></i>
                        <span>Mi Aula Virtual</span>
                        <i class='bx bx-chevron-down' ></i>
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
                        <!-- Los cursos añadidos se insertarán aquí dinámicamente -->
                    </ul>
                </li>
                <li class="menu-item menu-item-static">
                    <a href="#" class="menu-link">
                        <i class='bx bx-trash' ></i>
                        <span>Papelera</span>
                    </a>
                </li>
            </ul>
        </div>
        <div class="footer">
            <ul class="menu">
                <li class="menu-item menu-item-static">
                    <a href="#" class="menu-link">
                        <i class='bx bx-cog' ></i>
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
                        <i class='bx bx-log-out' ></i>
                        <span>Cerrar Sesión</span>
                    </a>
                </li>
            </ul>
            <div class="brand">
                <img src="../assets/imagenes/logoepa.png" alt="logo">
                <span>EPA!</span>
            </div>
        </div>
    </div>

    <div id="main-content">
        <!-- El contenido del centro se cambiará dinámicamente aquí -->
    </div>

    <script src="../scripts/menu.js"></script>
    <script>
        // Función para cargar contenido dinámicamente en el centro
        function loadContent(page, action) {
            const content = document.getElementById('main-content');
            
            // Aquí puedes cargar diferentes contenidos dependiendo de la página seleccionada
            if (page === 'planificador') {
                content.innerHTML = '<iframe src="planificador.php" width="100%" height="100%" style="border: none;"></iframe>';
            } 
            if (page === 'mis_cursos') {
                content.innerHTML = '<iframe src="clases.php" width="100%" height="100%" style="border: none;"></iframe>';
                
                // Si se indica mostrar el formulario, enviar mensaje al iframe
                if (action === 'showForm') {
                    // Esperamos a que el iframe esté cargado
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
            if (page === 'mis_apuntes') {
                content.innerHTML = '<iframe src="apuntes.php" width="100%" height="100%" style="border: none;"></iframe>';
            }
            if (page === 'home') {
                content.innerHTML = '<iframe src="home.php" width="100%" height="100%" style="border: none;"></iframe>';
            }
            else if (page === 'ayuda') {
    content.innerHTML = '<iframe src="ayuda.html" width="100%" height="100%" style="border: none;"></iframe>';
}
        }

        // Al cargar la página, puedes definir un contenido por defecto
        window.onload = function() {
            loadContent('home');
        };
        
        // Escuchar mensajes desde el iframe
        window.addEventListener('message', function(event) {
            // Verificar si es un mensaje para añadir clase al menú
            if (event.data && event.data.type === 'addClass') {
                const classData = event.data.classData;
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
                    
                    // Cargar el contenido de la clase
                    loadContent('mis_cursos');
                    
                    // Esperar a que el iframe esté cargado
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
            }
        });
    </script>
</body>
</html>
