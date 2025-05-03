<?php
session_start();

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['idUsuario'])) {
    // Si no hay sesión activa, redirigir al inicio
    header("Location: ../index.html");
    exit();
}
?>