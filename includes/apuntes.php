<?php
include_once 'conexion.php';
session_start();

// Verifica que el usuario esté autenticado
if (!isset($_SESSION['idUsuario'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autenticado']);
    exit();
}

$usuario_id = $_SESSION['idUsuario']; // <-- ¡AQUÍ!

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['titulo'], $_POST['contenido_html'])) {
    // GUARDAR APUNTE
    $titulo = trim($_POST['titulo']);
    $contenido_html = $_POST['contenido_html'];

    try {
        $sql = "INSERT INTO Apuntes (titulo, contenido_html, Usuario_idUsuario) VALUES (:titulo, :contenido_html, :usuario_id)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':titulo' => $titulo,
            ':contenido_html' => $contenido_html,
            ':usuario_id' => $usuario_id
        ]);
        echo json_encode(['success' => true, 'message' => 'Apunte guardado correctamente']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al guardar el apunte', 'details' => $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // CARGAR APUNTES
    try {
        $sql = "SELECT idApuntes, titulo, contenido_html, fecha_creacion, fecha_actualizacion 
                FROM Apuntes 
                WHERE Usuario_idUsuario = :usuario_id
                ORDER BY fecha_actualizacion DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':usuario_id' => $usuario_id]);
        $apuntes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'apuntes' => $apuntes]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al cargar los apuntes', 'details' => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Solicitud no válida']);
}
?>