<?php
// Verificar si el usuario ha iniciado sesión
include_once '../includes/verificar_sesion.php'; // Esto ya debería iniciar la sesión si no está activa
$currentUserRole = $_SESSION['rol'] ?? 'Invitado'; // Obtener el rol del usuario
$currentUserId = $_SESSION['idUsuario'] ?? null; // Obtener el ID del usuario
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cursos</title> <!--{/* Cambiado de "Mis Cursos" a "Cursos" para ser más general */}-->
    <link rel="stylesheet" href="../assets/styles/clases.css">
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <!-- Sección principal de cursos -->
        <div id="courses-view" class="section active">
            <h1 class="page-title"><?php echo ($currentUserRole === 'Maestro') ? 'Mis Cursos Creados' : 'Catálogo de Cursos'; ?></h1>
            <p class="subtitle">
                <?php echo ($currentUserRole === 'Maestro') ? 'Administra los cursos que has creado.' : 'Explora los cursos disponibles e inscríbete.'; ?>
            </p>
            
            <?php if ($currentUserRole === 'Maestro'): ?>
            <div class="actions">
                <button id="add-class-btn" class="btn-primary">
                    <i class='bx bx-plus'></i> Añadir clase
                </button>
            </div>
            <?php endif; ?>

            <?php if ($currentUserRole === 'Estudiante'): ?>
            <div id="enroll-by-code-section" class="enroll-by-code-container">
                <h2>Inscribirse a un Curso por Código</h2>
                <div class="enroll-form">
                    <input type="text" id="input-enroll-course-id" placeholder="Introduce el ID del curso">
                    <button id="btn-enroll-by-code" class="btn-primary">
                        <i class='bx bx-search'></i> Buscar curso
                    </button>
                </div>
                <p id="enroll-by-code-message" class="message-feedback"></p>
            </div>
            <?php endif; ?>
            
            <div id="courses-container" class="courses-grid">
                <!-- Los cursos se mostrarán aquí desde JavaScript */}
                {/* El estado vacío se manejará en JS -->
            </div>
        </div>
        
        <?php if ($currentUserRole === 'Maestro'): ?>
        <!-- Formulario para añadir/editar clases (solo para Maestros) -->
        <div id="add-form-view" class="section">
            <div class="form-header">
                <h2 id="form-view-title">Añadir una nueva clase</h2> <!-- ID cambiado para evitar conflicto con h2 de detalle -->
                <button id="close-form-btn" class="btn-icon">
                    <i class='bx bx-x'></i>
                </button>
            </div>
            
            <form id="add-class-form" class="form">
               <!-- Campo oculto para el ID del curso en modo edición -->
                <input type="hidden" id="edit-course-id" name="edit_course_id">

                <div class="form-group">
                    <input type="hidden" id="course_id_form" name="id">
                </div>
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
                    <label for="class-image-input">Imagen de la clase</label> <!-- ID del input cambiado -->
                    <div class="image-upload">
                        <div id="image-preview" class="image-preview">
                            <i class='bx bx-image-add'></i>
                            <span>Haz clic para seleccionar una imagen</span>
                        </div>
                        <input type="file" id="class-image-input" name="class-image-file" accept="image/*"> 
                        <input type="hidden" id="class-image-base64" name="imagen"> <!-- Para enviar la imagen en base64 -->
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" id="cancel-form-btn" class="btn-secondary">Cancelar</button>
                    <button type="submit" class="btn-primary">Guardar clase</button>
                </div>
                <p id="form-feedback" class="message-feedback"></p>
            </form>
        </div>
        <?php endif; ?>
        
        <!-- Vista detallada de la clase -->
        <div id="class-detail-view" class="section">
            <div class="detail-header">
                <button id="back-to-courses-btn" class="btn-icon">
                    <i class='bx bx-arrow-back'></i>
                </button>
                <div class="header-actions">
                    <?php if ($currentUserRole === 'Maestro'): ?>
                    <button id="edit-class-btn" class="btn-icon">
                        <i class='bx bx-edit'></i>
                    </button>
                    <button id="delete-class-btn" class="btn-icon">
                        <i class='bx bx-trash'></i>
                    </button>
                    <?php endif; ?>
                </div>
            </div>
            
            <div id="class-detail-content" class="detail-content">
                <!-- El contenido detallado de la clase se insertará aquí dinámicamente -->
            </div>
        </div>
    </div>
    
    <?php if ($currentUserRole === 'Maestro'): ?>
    <!-- Modal de confirmación para eliminar (solo para Maestros) -->
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
    <?php endif; ?>
    
    <!-- Scripts -->
    <script>
        // Pasar el rol y el ID del usuario a JavaScript
        const currentUserRole = "<?php echo htmlspecialchars($currentUserRole, ENT_QUOTES, 'UTF-8'); ?>";
        const currentUserId = <?php echo json_encode($currentUserId); ?>; 
         // datos del maestro
        const currentUserName = <?php echo json_encode($_SESSION['nombreCompleto'] ?? ''); ?>;
        const currentUserEmail = <?php echo json_encode($_SESSION['correo'] ?? ''); ?>;
    </script>

    <script>
        // Función para sincronizar el modo oscuro
        function syncDarkMode() {
            const darkMode = localStorage.getItem('darkMode') === 'true' || 
                            document.cookie.includes('darkMode=true');
            
            if (darkMode) {
                document.body.classList.add('modo-oscuro');
            } else {
                document.body.classList.remove('modo-oscuro');
            }
        }

        // Escuchar cambios en el modo oscuro
        window.addEventListener('storage', function(event) {
            if (event.key === 'darkMode') {
                syncDarkMode();
            }
        });

        // Sincronizar al cargar
        document.addEventListener('DOMContentLoaded', syncDarkMode);
    </script>
    <script src="../scripts/clases.js"></script>
</body>
</html>
