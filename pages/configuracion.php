<?php
// Incluir el archivo de verificación de sesión al inicio
include_once '../includes/verificar_sesion.php';

// Conectar a la base de datos para obtener los datos del usuario
require_once '../includes/conexion.php';

// Obtener información adicional del usuario desde la base de datos
if (isset($_SESSION['userName'])) {
    $userName = $_SESSION['userName'];
    
    try {
        $stmt = $pdo->prepare("SELECT c.correo, u.nombre, u.apellidoP, u.apellidoM, u.rol 
                              FROM Cuenta c 
                              JOIN Usuario u ON c.usuario_idUsuario = u.idUsuario 
                              WHERE c.userName = :userName");
        $stmt->bindParam(':userName', $userName);
        $stmt->execute();
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($userData) {
            $correo = $userData['correo'];
            $nombreCompleto = $userData['nombre'] . ' ' . $userData['apellidoP'] . ' ' . $userData['apellidoM'];
            $rol = $userData['rol'];
            
            // Solo usar la imagen por defecto
            $fotoPerfil = '../assets/imagenes/perfil.png';
        }
    } catch (PDOException $e) {
        error_log("Error al obtener datos del usuario: " . $e->getMessage());
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configuración</title>
    <link rel="stylesheet" href="../assets/styles/configuracion.css">
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
</head>
<body>
    <div class="configuracion-container">
        <h1><i class='bx bx-cog'></i> Configuración</h1>
        
        <!-- Sección de Perfil -->
        <div class="config-section">
            <h2><i class='bx bx-user'></i> Perfil</h2>
            <div class="profile-info">
                <div class="imagen-wrapper redonda">
                    <img id="profile-picture" class="profile-photo" src="<?php echo $fotoPerfil; ?>" alt="Foto de perfil">
                    <div class="imagen-texto">Cambiar foto</div>
                    <input type="file" id="profile-upload" name="profile-upload" accept="image/*" style="display: none;">
                </div>
                <div class="profile-details">
                    <div class="detail">
                        <label>Nombre:</label>
                        <span id="user-name"><?php echo htmlspecialchars($nombreCompleto); ?></span>
                    </div>
                    <div class="detail">
                        <label>Correo:</label>
                        <span id="user-email"><?php echo htmlspecialchars($correo); ?></span>
                    </div>
                    <div class="detail">
                        <label>Rol:</label>
                        <span id="user-rol"><?php echo htmlspecialchars($rol); ?></span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sección de Apariencia -->
        <div class="config-section">
            <h2><i class='bx bx-palette'></i> Apariencia</h2>
            <div class="option">
                <label for="tema">Tema:</label>
                <select id="tema">
                    <option value="claro">Claro</option>
                    <option value="oscuro">Oscuro</option>
                </select>
            </div>
            <div class="option">
                <label for="fuente">Tamaño de fuente:</label>
                <select id="fuente">
                    <option value="pequena">Pequeña</option>
                    <option value="mediana" selected>Mediana</option>
                    <option value="grande">Grande</option>
                </select>
            </div>
        </div>

        <!-- Sección de Notificaciones -->
        <div class="config-section">
            <h2><i class='bx bx-bell'></i> Notificaciones</h2>
            <div class="option">
                <label for="notificaciones">Activar notificaciones:</label>
                <input type="checkbox" id="notificaciones" checked>
            </div>
            <div class="option">
                <label for="notif-sonido">Sonido de notificaciones:</label>
                <input type="checkbox" id="notif-sonido" checked>
            </div>
        </div>

        <!-- Sección de Privacidad -->
        <div class="config-section">
            <h2><i class='bx bx-lock-alt'></i> Privacidad</h2>
            <div class="option">
                <label for="perfil-publico">Perfil público:</label>
                <input type="checkbox" id="perfil-publico">
            </div>
            <div class="option">
                <button id="cambiar-pass" class="btn"><i class='bx bx-key'></i> Cambiar contraseña</button>
            </div>
        </div>

        <!-- Sección de Cuenta -->
        <div class="config-section">
            <h2><i class='bx bx-cog'></i> Cuenta</h2>
            <div class="option">
                <button id="exportar-datos" class="btn"><i class='bx bx-export'></i> Exportar mis datos</button>
            </div>
            <div class="option">
                <button id="eliminar-cuenta" class="btn danger"><i class='bx bx-trash'></i> Eliminar cuenta</button>
            </div>
        </div>
    </div>
    
    <script src="../scripts/dark-mode.js"></script>
    <script src="../assets/scripts/configuracion.js"></script>

    <script>
        // Verificación de carga
        document.addEventListener('DOMContentLoaded', function() {
            if (!window.DarkMode) {
                console.error('DarkMode no se cargó correctamente');
            } else {
                console.log('DarkMode está funcionando');
                console.log('Estado actual:', window.DarkMode.getCurrentState() ? 'Oscuro' : 'Claro');
                
                // Sincronizar el selector de tema con el estado actual
                const temaSelect = document.getElementById('tema');
                if (temaSelect) {
                    temaSelect.value = window.DarkMode.getCurrentState() ? 'oscuro' : 'claro';
                }
            }

            // Manejar el cambio de foto de perfil
            const profileUpload = document.getElementById('profile-upload');
            const profilePicture = document.getElementById('profile-picture');
            const profileForm = document.getElementById('profile-form');

            profileUpload.addEventListener('change', function(e) {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        profilePicture.src = e.target.result;
                        
                        // Enviar el formulario automáticamente cuando se selecciona una imagen
                        profileForm.submit();
                    }
                    
                    reader.readAsDataURL(this.files[0]);
                }
            });
        });
    </script>

    <script>
document.addEventListener('DOMContentLoaded', function() {
    const profileWrapper = document.querySelector('.imagen-wrapper.redonda');
    const profilePicture = document.getElementById('profile-picture');
    const profileUpload = document.getElementById('profile-upload');
    
    // Cargar imagen guardada en localStorage si existe
    const savedImage = localStorage.getItem('userProfileImage');
    if (savedImage) {
        profilePicture.src = savedImage;
    }
    
    profileWrapper.addEventListener('click', function() {
        profileUpload.click();
    });
    
    profileUpload.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Mostrar vista previa
                profilePicture.src = e.target.result;
                
                // Guardar en localStorage para persistencia
                localStorage.setItem('userProfileImage', e.target.result);
                
                // Notificar a otras pestañas/ventanas del cambio
                localStorage.setItem('profilePictureUpdated', e.target.result);
            }
            
            reader.readAsDataURL(this.files[0]);
        }
    });
    
    // Escuchar cambios en otras pestañas
    window.addEventListener('storage', function(e) {
        if (e.key === 'profilePictureUpdated' && e.newValue) {
            profilePicture.src = e.newValue;
        }
    });
});
</script>
</body>
</html>
