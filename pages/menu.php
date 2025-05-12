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
    <img id="menu-profile-picture" class="profile-photo" src="../assets/imagenes/perfil.png" alt="user">
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
                    <ul class="sub-menu" id="cursos-submenu-container">
                        <li>
                            <div class="courses-header">
                                <span>Mis cursos</span>
                                <div class="add-class-btn pulse" id="add-class-btn-sidebar">
                                    <i class='bx bx-plus'></i>
                                </div>
                            </div>
                        </li>
                        <li><a id="ver-todos-mis-cursos" href="#" class="sub-menu-link" onclick="loadContent('mis_cursos')">Ver todos mis cursos</a></li>
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
    <script src="../scripts/dark-mode.js"></script>
    <script>
    // Integración con el sistema DarkMode principal
    document.addEventListener('DOMContentLoaded', function() {
        // Inicializar el modo oscuro
        if (window.DarkMode) {
            // Sincronizar el menú con el estado actual
            window.DarkMode.syncAllElements();
            
            // Escuchar cambios para actualizar el menú
            document.addEventListener('darkModeChange', function(e) {
                const isDarkMode = e.detail.isDarkMode;
                // Asegurar que el menú responda a los cambios
                document.body.classList.toggle('modo-oscuro', isDarkMode);
                
                // Actualizar estilos específicos del menú si es necesario
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.toggle('modo-oscuro', isDarkMode);
                }
            });
        }
    });
    </script>

    <script>
document.addEventListener('DOMContentLoaded', function() {
    // Cargar foto de perfil desde localStorage si existe
    const savedPhoto = localStorage.getItem('userProfileImage');
    if (savedPhoto) {
        document.getElementById('menu-profile-picture').src = savedPhoto;
    }
    
    // Escuchar cambios en otras pestañas
    window.addEventListener('storage', function(e) {
        if (e.key === 'userProfileImage' && e.newValue) {
            document.getElementById('menu-profile-picture').src = e.newValue;
        }
    });
});
</script>
    
    <script src="../scripts/menu.js"></script>
</body>
</html>
