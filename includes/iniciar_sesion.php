<?php
include_once 'conexion.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = trim($_POST['mail']);
    $password = trim($_POST['password']);

    // Buscar por correo
    $sql = "SELECT Cuenta.*, Usuario.idUsuario as usuario_id, Usuario.rol FROM Cuenta 
            INNER JOIN Usuario ON Cuenta.Usuario_idUsuario = Usuario.idUsuario
            WHERE Cuenta.correo = :mail OR Cuenta.userName = :mail LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':mail' => $user]);
    $cuenta = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($cuenta && password_verify($password, $cuenta['contrasenia'])) {
        // Login exitoso, puedes guardar datos en la sesión
        $_SESSION['idUsuario'] = $cuenta['usuario_id']; // Usamos el ID correcto
        $_SESSION['Usuario_idUsuario'] = $cuenta['Usuario_idUsuario']; // Para compatibilidad
        $_SESSION['userName'] = $cuenta['userName'];
        $_SESSION['correo'] = $cuenta['correo'];
        $_SESSION['rol'] = $cuenta['rol'];
        
        // Para depuración
        $_SESSION['debug_info'] = [
            'id_cuenta' => $cuenta['idCuenta'] ?? 'no disponible',
            'id_usuario' => $cuenta['usuario_id'] ?? 'no disponible'
        ];
        
        header('Location: ../pages/menu.php?login=exito');
        exit();
    } else {
        // Login fallido
        header('Location: ../pages/login.html?error=1');
        exit();
    }
}
?>