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
    <link rel="stylesheet" href="../assets/styles/clases.css">
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <!-- Sección principal de cursos -->
        <div id="courses-view" class="section active">
            <h1 class="page-title">Mis Cursos</h1>
            <p class="subtitle">Explora y administra tus cursos</p>
            
            <div class="actions">
                <button id="add-class-btn" class="btn-primary">
                    <i class='bx bx-plus'></i> Añadir clase
                </button>
            </div>
            
            <div id="courses-container" class="courses-grid">
                <!-- Los cursos se mostrarán aquí desde JavaScript -->
                <div class="empty-state">
                    <img src="../assets/imagenes/empty-courses.svg" alt="No hay cursos">
                    <p>No tienes cursos actualmente</p>
                    <button id="empty-add-class-btn" class="btn-secondary">Añadir una clase</button>
                </div>
            </div>
        </div>
        
        <!-- Formulario para añadir clases -->
        <div id="add-form-view" class="section">
            <div class="form-header">
                <h2>Añadir una nueva clase</h2>
                <button id="close-form-btn" class="btn-icon">
                    <i class='bx bx-x'></i>
                </button>
            </div>
            
            <form id="add-class-form" class="form">
                <div class="form-group">
                    <label for="nombre">Nombre de la clase</label>
                    <input type="text" id="nombre" name="nombre" required placeholder="Ej. Matemáticas Avanzadas">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="horario">Horario</label>
                        <input type="text" id="horario" name="horario" required placeholder="Ej. Lunes y Miércoles 10:00-12:00">
                    </div>
                    
                    <div class="form-group">
                        <label for="lugar">Lugar</label>
                        <input type="text" id="lugar" name="lugar" required placeholder="Ej. Edificio A, Salón 205">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="instructor">Instructor</label>
                        <input type="text" id="instructor" name="instructor" required placeholder="Ej. Dr. Juan Pérez">
                    </div>
                    
                    <div class="form-group">
                        <label for="contacto">Contacto</label>
                        <input type="text" id="contacto" name="contacto" required placeholder="Ej. juan.perez@universidad.edu">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="asesoria">Asesoría (hora o lugar)</label>
                    <input type="text" id="asesoria" name="asesoria" required placeholder="Ej. Martes 14:00-16:00, Oficina 305">
                </div>
                
                <div class="form-group">
                    <label for="class-image">Imagen de la clase (opcional)</label>
                    <div class="image-upload">
                        <div id="image-preview" class="image-preview">
                            <i class='bx bx-image-add'></i>
                            <span>Haz clic para seleccionar una imagen</span>
                        </div>
                        <input type="file" id="class-image" name="class-image" accept="image/*">
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" id="cancel-form-btn" class="btn-secondary">Cancelar</button>
                    <button type="submit" class="btn-primary">Guardar clase</button>
                </div>
            </form>
        </div>
        
        <!-- Vista detallada de la clase -->
        <div id="class-detail-view" class="section">
            <div class="detail-header">
                <button id="back-to-courses-btn" class="btn-icon">
                    <i class='bx bx-arrow-back'></i>
                </button>
                <div class="header-actions">
                    <button id="edit-class-btn" class="btn-icon">
                        <i class='bx bx-edit'></i>
                    </button>
                    <button id="delete-class-btn" class="btn-icon">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            </div>
            
            <div id="class-detail-content" class="detail-content">
                <!-- El contenido detallado de la clase se insertará aquí dinámicamente -->
            </div>
        </div>
    </div>
    
    <!-- Modal de confirmación para eliminar -->
    <div id="delete-modal" class="modal">
        <div class="modal-content">
            <h3>¿Estás seguro?</h3>
            <p>Esta acción eliminará permanentemente la clase y no se puede deshacer.</p>
            <div class="modal-actions">
                <button id="cancel-delete-btn" class="btn-secondary">Cancelar</button>
                <button id="confirm-delete-btn" class="btn-danger">Eliminar</button>
            </div>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="../scripts/clases.js"></script>
</body>
</html>
