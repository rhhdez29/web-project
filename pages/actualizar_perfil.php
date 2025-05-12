<?php
// Habilitar visualización de errores
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
require_once __DIR__ . '/../includes/conexion.php';

// Definir página de redirección (home)
$redirectTo = '../pages/configuracion.php';

// Verificar solicitud POST y archivo subido
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_FILES['profile-upload'])) {
    $_SESSION['error'] = 'No se recibió ningún archivo.';
    header("Location: $redirectTo");
    exit();
}

$file = $_FILES['profile-upload'];
$userName = $_SESSION['userName'] ?? null;

// Verificar sesión de usuario
if (!$userName) {
    $_SESSION['error'] = 'Debes iniciar sesión para cambiar tu foto de perfil.';
    header("Location: $redirectTo");
    exit();
}

// Validaciones de archivo
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
$maxSize = 2 * 1024 * 1024; // 2MB

if (!in_array($file['type'], $allowedTypes)) {
    $_SESSION['error'] = 'Solo se permiten imágenes JPEG, PNG o GIF.';
    header("Location: $redirectTo");
    exit();
}

if ($file['size'] > $maxSize) {
    $_SESSION['error'] = 'La imagen es demasiado grande (máximo 2MB).';
    header("Location: $redirectTo");
    exit();
}

// Configurar directorio de destino
$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/AyudaConfigurado/web-project/assets/imagenes/usuarios/';
if (!file_exists($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        $_SESSION['error'] = 'No se pudo crear el directorio de destino.';
        header("Location: $redirectTo");
        exit();
    }
}

// Procesar imagen
$fileName = $userName . '.jpg';
$destination = $uploadDir . $fileName;

if (move_uploaded_file($file['tmp_name'], $destination)) {
    // Convertir a JPEG si es necesario
    if ($file['type'] !== 'image/jpeg') {
        $image = match($file['type']) {
            'image/png' => imagecreatefrompng($destination),
            'image/gif' => imagecreatefromgif($destination),
            default => null
        };
        
        if ($image) {
            imagejpeg($image, $destination, 85);
            imagedestroy($image);
        }
    }
    
    // Actualizar datos de sesión
    $_SESSION['success'] = 'Foto de perfil actualizada correctamente.';
    $_SESSION['profile_picture'] = $fileName;
    $_SESSION['profile_picture_path'] = '/AyudaConfigurado/web-project/assets/imagenes/usuarios/' . $fileName;
    
    // Redirigir al home
    header("Location: $redirectTo");
    exit();
} else {
    $_SESSION['error'] = 'Error al guardar la imagen. Inténtalo de nuevo.';
    header("Location: $redirectTo");
    exit();
}

<script>
        // Manejo del cambio de imagen
        document.addEventListener('DOMContentLoaded', function() {
            const profileWrapper = document.querySelector('.imagen-wrapper.redonda');
            const profileUpload = document.getElementById('profile-upload');
            const profileForm = document.getElementById('profile-form');

            profileWrapper.addEventListener('click', () => profileUpload.click());
            
            profileUpload.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.getElementById('profile-picture').src = e.target.result;
                        profileForm.submit();
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            });
        });
    </script>
?>
