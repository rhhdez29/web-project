<?php
// Incluir la conexión a la base de datos
include_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener los datos del formulario
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $estado = 'Activo'; // Estado predeterminado para la cuenta

    // Validar los datos
    if (empty($username) || empty($email) || empty($password)) {
        die('Todos los campos son obligatorios.');
    }

    // Hashear la contraseña
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Preparar la consulta SQL
        $sql = "INSERT INTO Cuenta (userName, correo, contrasenia, estado) 
                VALUES (:username, :email, :password, :estado)";
        $stmt = $pdo->prepare($sql);

        // Vincular los parámetros
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':estado', $estado);

        // Ejecutar la consulta
        if ($stmt->execute()) {
            // Si la inserción fue exitosa, redirigir a la página de inicio de sesión
            header('Location: ../index.php?registro=exito');
            exit();
        } else {
            echo 'Error al registrar el usuario.';
        }
    } catch (PDOException $e) {
        echo 'Error: ' . $e->getMessage();
    }
}
?>