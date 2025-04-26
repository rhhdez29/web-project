<?php
$host = "localhost"; // Cambia si tu servidor no es local
$user = "root"; // Usuario de la base de datos
$password = "1234"; // Contraseña del usuario
$dbname = "epadbp"; // Cambia por el nombre de tu base de datos

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
