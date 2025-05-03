<?php
$host = "localhost"; // Servidor de la base de datos
$user = "root"; // Usuario de la base de datos
$password = ""; // Contraseña de la base de datos
$dbname = "epadbp"; // Nombre de la base de datos

// Crear conexión
$conn = new mysqli($host, $user, $password, $dbname);

try {
    // Crear conexión con PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Habilitar excepciones para errores
} catch (PDOException $e) {
    die("Error al conectar a la base de datos: " . $e->getMessage());
}
?>
