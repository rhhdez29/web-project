<?php
// Verificar si el usuario ha iniciado sesión
include_once '../includes/verificar_sesion.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis Cursos</title>
    <link rel="stylesheet" href="../assets/styles/clases_alumno.css">
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <!-- Sección principal de cursos -->
        <div id="courses-view" class="section active">
            <div class="title-search-container">
                <h1 class="page-title">Mis Cursos</h1>
                <div class="search-container">
                    <input type="text" id="search-input" placeholder="Buscar por clave...">
                    <button id="search-btn" class="btn-search"><i class='bx bx-search'></i></button>
                </div>
            </div>
            <p class="subtitle">Explora tus cursos</p>
            
            <div id="courses-container" class="courses-grid">
                <!-- Los cursos se mostrarán aquí desde JavaScript -->
                <div class="empty-state">
                    <img src="../assets/imagenes/empty-courses.svg" alt="No hay cursos">
                    <p>No tienes cursos actualmente</p>
                </div>
            </div>
        </div>
        
        <!-- Vista detallada de la clase -->
        <div id="class-detail-view" class="section">
            <div id="class-detail-content" class="detail-content">
                <!-- El contenido detallado de la clase se insertará aquí dinámicamente -->
            </div>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="../scripts/clases_alumno.js"></script>
</body>
</html>