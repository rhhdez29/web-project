<?php
// filepath: c:\wamp64\www\web-project\includes\planner_api.php
include_once 'conexion.php';
session_start();

// Verificar la sesión y mostrar más información de depuración
if (!isset($_SESSION['idUsuario'])) {
    // Intenta buscar otras posibles claves de sesión
    $possibleKeys = ['Usuario_idUsuario', 'id', 'user_id'];
    $foundKey = null;
    
    foreach ($possibleKeys as $key) {
        if (isset($_SESSION[$key])) {
            $foundKey = $key;
            // Copiar a idUsuario para mantener consistencia
            $_SESSION['idUsuario'] = $_SESSION[$key];
            break;
        }
    }
    
    // Si aún no encuentra ID de usuario, devuelve error de autorización
    if (!$foundKey) {
        header('Content-Type: application/json');
        echo json_encode([
            'error' => 'No autorizado', 
            'session_data' => $_SESSION,
            'session_id' => session_id(),
            'tip' => 'Debes iniciar sesión primero en login.html'
        ]);
        exit();
    }
}

$userId = $_SESSION['idUsuario'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

    // Función para formatear fechas correctamente
    function formatDateForDB($date) {
        // Asegura que la fecha se interpreta correctamente sin cambios de zona horaria
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            // Si ya está en formato YYYY-MM-DD, usarlo directamente
            return $date;
        } else {
            // De otro modo usar strtotime, pero forzar la hora a medio día para evitar problemas
            $timestamp = strtotime($date);
            return date('Y-m-d', $timestamp);
        }
    }

// Obtener todos los elementos del planificador del usuario
if ($action === 'getItems') {
    try {
        $stmt = $pdo->prepare("SELECT * FROM Planificador WHERE usuario_idUsuario = :userId ORDER BY Fecha, Hora");
        $stmt->execute([':userId' => $userId]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        header('Content-Type: application/json');
        echo json_encode($items);
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// En la sección se inserta el nuevo elemento:
elseif ($action === 'addItem' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Depuración de fechas
        error_log("Fecha recibida: " . $data['date']);
        $fechaFormateada = formatDateForDB($data['date']);
        error_log("Fecha formateada: " . $fechaFormateada);
        
        // Inserción en la base de datos
        $stmt = $pdo->prepare("INSERT INTO Planificador (Titulo, Tipo, Fecha, Hora, Descripcion, Importante, usuario_idUsuario) 
                              VALUES (:titulo, :tipo, :fecha, :hora, :descripcion, :importante, :userId)");
        
        $resultado = $stmt->execute([
            // Mapeo de campos
            ':titulo' => $data['title'],
            ':tipo' => $data['type'] === 'task' ? 'Tarea' : ($data['type'] === 'appointment' ? 'Cita' : 'Objetivo Semanal'),
            ':fecha' => $fechaFormateada,
            ':hora' => !empty($data['time']) ? $data['time'] : null,
            ':descripcion' => $data['description'] ?? null,
            ':importante' => $data['important'] ? 1 : 0,
            ':userId' => $userId
        ]);

        // Devuelve el elemento creado con su ID
        if ($resultado) {
            $newId = $pdo->lastInsertId();
            
            // Devolver el elemento creado con su ID
            $stmt = $pdo->prepare("SELECT * FROM Planificador WHERE idPlanificador = :id");
            $stmt->execute([':id' => $newId]);
            $newItem = $stmt->fetch(PDO::FETCH_ASSOC);
            
            header('Content-Type: application/json');
            echo json_encode($newItem);
        } else {
            throw new Exception("Error al insertar el elemento");
        }
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Elimina un elemento del planificador
elseif ($action === 'deleteItem' && isset($_GET['id'])) {
    try {
        $itemId = $_GET['id'];
        
        // Verifica que el elemento pertenece al usuario
        $stmt = $pdo->prepare("SELECT * FROM Planificador WHERE idPlanificador = :id AND usuario_idUsuario = :userId");
        $stmt->execute([':id' => $itemId, ':userId' => $userId]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$item) {
            throw new Exception("Elemento no encontrado o no tienes permisos");
        }
        // Eliminar de la base de datos
        $stmt = $pdo->prepare("DELETE FROM Planificador WHERE idPlanificador = :id");
        $stmt->execute([':id' => $itemId]);
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Elemento eliminado correctamente']);
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Actualizar un elemento del planificador
// Similar a addItem pero con verificación de propiedad y actualización en lugar de inserción
elseif ($action === 'updateItem' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $itemId = $data['id'];
        
        // Verificar que el elemento pertenece al usuario
        $stmt = $pdo->prepare("SELECT * FROM Planificador WHERE idPlanificador = :id AND usuario_idUsuario = :userId");
        $stmt->execute([':id' => $itemId, ':userId' => $userId]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$item) {
            throw new Exception("Elemento no encontrado o no tienes permisos");
        }
        
        $stmt = $pdo->prepare("UPDATE Planificador SET 
                              Titulo = :titulo, 
                              Tipo = :tipo, 
                              Fecha = :fecha, 
                              Hora = :hora, 
                              Descripcion = :descripcion, 
                              Importante = :importante 
                              WHERE idPlanificador = :id");
        
        $stmt->execute([
            ':titulo' => $data['title'],
            ':tipo' => $data['type'] === 'task' ? 'Tarea' : ($data['type'] === 'appointment' ? 'Cita' : 'Objetivo Semanal'),
            ':fecha' => formatDateForDB($data['date']),
            ':hora' => !empty($data['time']) ? $data['time'] : null,
            ':descripcion' => $data['description'] ?? null,
            ':importante' => $data['important'] ? 1 : 0,
            ':id' => $itemId
        ]);
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Elemento actualizado correctamente']);
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