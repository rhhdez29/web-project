<?php
$host = "localhost"; // Cambia si tu servidor no es local
$user = "root"; // Usuario de la base de datos
$password = ""; // Contraseña del usuario
$dbname = "nombre_de_tu_base_de_datos"; // Cambia por el nombre de tu base de datos

// Crear conexión
$conn = new mysqli($host, $user, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

echo "Conexión exitosa";
?>
