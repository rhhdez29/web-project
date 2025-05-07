<?php
$host = "sql.freedb.tech:3306"; // Servidor de la base de datos
$user = "freedb_root_epa"; // Usuario de la base de datos
$password = "53!ANVPxB4yTw\$s"; // Contraseña de la base de datos
$dbname = "freedb_epadbp"; // Nombre de la base de datos

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
