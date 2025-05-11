<?php 
//verificamos si el usuario ha iniciado sesión
include_once '../includes/verificar_sesion.php';
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
                <div class="profile-picture-container">
                    <img id="profile-picture" src="../assets/imagenes/perfil.png" alt="Foto de perfil">
                    <label for="profile-upload" class="upload-btn">
                        <i class='bx bx-camera'></i> Cambiar foto
                        <input type="file" id="profile-upload" accept="image/*" style="display: none;">
                    </label>
                </div>
                <div class="profile-details">
                    <div class="detail">
                        <label>Nombre:</label>
                        <span id="user-name"><?php echo isset($_SESSION['userName']) ? htmlspecialchars($_SESSION['userName']) : 'Invitado'; ?></span>
                    </div>
                    <div class="detail">
                        <label>Correo:</label>
                        <span id="user-email"><?php echo isset($_SESSION['correo']) ? htmlspecialchars($_SESSION['correo']) : 'No disponible'; ?></span>
                    </div>
                    <div class="detail">
                        <label>Rol:</label>
                        <span id="user-rol"><?php echo isset($_SESSION['rol']) ? htmlspecialchars($_SESSION['rol']) : 'Uknown'; ?></span>
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

    <script src="../assets/scripts/configuracion.js"></script>
</body>
</html>