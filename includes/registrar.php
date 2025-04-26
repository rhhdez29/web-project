<?php
include_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Recoge los datos del formulario
    $nombre = trim($_POST['name']);
    $apellidoP = trim($_POST['lastnameP']);
    $apellidoM = trim($_POST['LastnameM']);
    $fechaNacimiento = trim($_POST['date']);
    $matricula = trim($_POST['matricula']);
    $rol = trim($_POST['rol']);
    $userName = trim($_POST['user-name']);
    $correo = trim($_POST['email-addres']);
    $password = trim($_POST['password']);
    $estado = 'activa';

    // Validación básica
    if (
        empty($nombre) || empty($apellidoP) || empty($apellidoM) ||
        empty($fechaNacimiento) || empty($matricula) || empty($rol) ||
        empty($userName) || empty($correo) || empty($password)
    ) {
        die('Todos los campos son obligatorios.');
    }

    // Hashea la contraseña
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Inicia la transacción
        $pdo->beginTransaction();

        // 2. Inserta en Usuario
        $sqlUsuario = "INSERT INTO Usuario (nombre, apellidoP, apellidoM, rol, fechaNaciemiento, matricula)
                       VALUES (:nombre, :apellidoP, :apellidoM, :rol, :fechaNacimiento, :matricula)";
        $stmtUsuario = $pdo->prepare($sqlUsuario);
        $stmtUsuario->execute([
            ':nombre' => $nombre,
            ':apellidoP' => $apellidoP,
            ':apellidoM' => $apellidoM,
            ':rol' => $rol,
            ':fechaNacimiento' => $fechaNacimiento,
            ':matricula' => $matricula
        ]);
        $idUsuario = $pdo->lastInsertId();

        // 3. Inserta en Cuenta
        $sqlCuenta = "INSERT INTO Cuenta (userName, correo, contrasenia, estado, Usuario_idUsuario)
                      VALUES (:userName, :correo, :contrasenia, :estado, :Usuario_idUsuario)";
        $stmtCuenta = $pdo->prepare($sqlCuenta);
        $stmtCuenta->execute([
            ':userName' => $userName,
            ':correo' => $correo,
            ':contrasenia' => $hashedPassword,
            ':estado' => $estado,
            ':Usuario_idUsuario' => $idUsuario
        ]);

        // Confirma la transacción
        $pdo->commit();

        header('Location: ../index.html?registro=exito');
        exit();
    } catch (PDOException $e) {
        $pdo->rollBack();
        echo 'Error: ' . $e->getMessage();
    }
}
?>