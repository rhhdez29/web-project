<?php
include_once 'conexion.php';
session_start();

// Verificar sesión
if (!isset($_SESSION['idUsuario'])) {
    header('Content-Type: application/json');
    echo json_encode([
        'error' => 'No autorizado',
        'session_data' => $_SESSION
    ]);
    exit();
}

$userId = $_SESSION['idUsuario'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Obtener todas las clases del usuario
if ($action === 'getClases') {
    try {
        $stmt = $pdo->prepare("SELECT * FROM Clases WHERE usuario_idUsuario = :userId");
        $stmt->execute([':userId' => $userId]);
        $clases = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        header('Content-Type: application/json');
        echo json_encode($clases);
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Añadir una nueva clase
elseif ($action === 'addClass' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $pdo->prepare("INSERT INTO Clases (nombre, horario, lugar, instructor, contacto, asesoria, imagen, usuario_idUsuario) 
                              VALUES (:nombre, :horario, :lugar, :instructor, :contacto, :asesoria, :imagen, :userId)");
        
        $resultado = $stmt->execute([
            ':nombre' => $data['nombre'],
            ':horario' => $data['horario'],
            ':lugar' => $data['lugar'],
            ':instructor' => $data['instructor'],
            ':contacto' => $data['contacto'],
            ':asesoria' => $data['asesoria'],
            ':imagen' => $data['imagen'] ?? null,
            ':userId' => $userId
        ]);

        // Devuelve la clase creada con su ID
        if ($resultado) {
            $newId = $pdo->lastInsertId();
            
            $stmt = $pdo->prepare("SELECT * FROM Clases WHERE idClase = :id");
            $stmt->execute([':id' => $newId]);
            $nuevaClase = $stmt->fetch(PDO::FETCH_ASSOC);
            
            header('Content-Type: application/json');
            echo json_encode($nuevaClase);
        } else {
            throw new Exception("Error al insertar la clase");
        }
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Actualizar una clase existente
elseif ($action === 'updateClass' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $claseId = $data['id'];
        
        // Verificar que la clase pertenece al usuario
        $stmt = $pdo->prepare("SELECT * FROM Clases WHERE idClase = :id AND usuario_idUsuario = :userId");
        $stmt->execute([':id' => $claseId, ':userId' => $userId]);
        $clase = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$clase) {
            throw new Exception("Clase no encontrada o no tienes permisos");
        }
        
        $stmt = $pdo->prepare("UPDATE Clases SET 
                              nombre = :nombre, 
                              horario = :horario, 
                              lugar = :lugar, 
                              instructor = :instructor, 
                              contacto = :contacto, 
                              asesoria = :asesoria, 
                              imagen = :imagen 
                              WHERE idClase = :id");
        
        $stmt->execute([
            ':nombre' => $data['nombre'],
            ':horario' => $data['horario'],
            ':lugar' => $data['lugar'],
            ':instructor' => $data['instructor'],
            ':contacto' => $data['contacto'],
            ':asesoria' => $data['asesoria'],
            ':imagen' => $data['imagen'] ?? null,
            ':id' => $claseId
        ]);
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Clase actualizada correctamente']);
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Eliminar una clase
elseif ($action === 'deleteClass' && isset($_GET['id'])) {
    try {
        $claseId = $_GET['id'];
        
        // Verificar que la clase pertenece al usuario
        $stmt = $pdo->prepare("SELECT * FROM Clases WHERE idClase = :id AND usuario_idUsuario = :userId");
        $stmt->execute([':id' => $claseId, ':userId' => $userId]);
        $clase = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$clase) {
            throw new Exception("Clase no encontrada o no tienes permisos");
        }
        
        // Eliminar de la base de datos
        $stmt = $pdo->prepare("DELETE FROM Clases WHERE idClase = :id");
        $stmt->execute([':id' => $claseId]);
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Clase eliminada correctamente']);
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

else {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Acción no válida']);
}
?>