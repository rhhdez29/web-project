<?php
session_start();
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
                        <a href="#" class="menu-link small">
                            <i class='bx bx-home-smile'></i>
                            <span>Inicio</span>
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
                        <li> <a href="#" class="sub-menu-link" onclick="loadContent('mis_cursos')">Mis cursos</a></li>
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
                    <a href="#" class="menu-link">
                        <i class='bx bx-help-circle' ></i>
                        <span>Ayuda</span>
                    </a>
                </li>
                <li class="menu-item menu-item-static">
                    <a href="#" class="menu-link">
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
        function loadContent(page) {
            const content = document.getElementById('main-content');
            
            // Aquí puedes cargar diferentes contenidos dependiendo de la página seleccionada
            if (page === 'planificador') {
                                        
                content.innerHTML = '<<iframe src="planificador.html" width="100%" height="100%" style="border: none;"></iframe>';
            } 
            if (page === 'mis_cursos') {
                content.innerHTML = '<iframe src="clases.html" width="100%" height="100%" style="border: none;"></iframe>';
            }
            if (page === 'mis_apuntes') {
                content.innerHTML = '<iframe src="apuntes.html" width="100%" height="100%" style="border: none;"></iframe>';
            }
        }

        // Al cargar la página, puedes definir un contenido por defecto
        window.onload = function() {
            loadContent('home');
        };
    </script>
</body>
</html>
