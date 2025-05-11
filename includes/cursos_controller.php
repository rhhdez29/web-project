<?php

include_once 'conexion.php'; // Para la conexión $pdo
// Asumimos que verificar_sesion.php maneja la redirección o finalización si no hay sesión.
// Si este script es un endpoint AJAX directo, es crucial que verificar_sesion.php
// también maneje la respuesta de error para AJAX (ej. http_response_code(401)).
include_once 'verificar_sesion.php'; 

header('Content-Type: application/json'); // La respuesta siempre será en formato JSON

$action = $_POST['action'] ?? $_GET['action'] ?? null;
$idUsuarioLogueado = $_SESSION['idUsuario'] ?? null;
$rolUsuarioLogueado = $_SESSION['rol'] ?? null; // Asumiendo que verificar_sesion.php o iniciar_sesion.php lo establece

// Función auxiliar para enviar respuestas JSON estandarizadas
function responder($success, $message = '', $data = null, $statusCode = 200) {
    http_response_code($statusCode);
    $response = ['success' => $success];
    if (!empty($message)) {
        $response['message'] = $message;
    }
    if ($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response);
    exit;
}

// Verificar que el usuario esté logueado para cualquier acción
if (!$idUsuarioLogueado) {
    responder(false, 'Usuario no autenticado. Por favor, inicie sesión.', null, 401);
}

try {
    switch ($action) {
        case 'crearCurso':
            if ($rolUsuarioLogueado !== 'Maestro') {
                responder(false, 'Acción no autorizada. Solo los maestros pueden crear cursos.', null, 403);
            }

            // Recibir y validar datos del formulario (enviados por clases.js)
            $idCurso = trim($_POST['id'] ?? ''); // ID generado por JavaScript
            $nombre = trim($_POST['nombre'] ?? '');
            $horario = trim($_POST['horario'] ?? '');
            $lugar = trim($_POST['lugar'] ?? '');
            $instructor = trim($_POST['instructor'] ?? '');
            $contacto = trim($_POST['contacto'] ?? '');
            $imagenBase64 = $_POST['imagen'] ?? ''; // La tabla Cursos la define como NOT NULL

            // Validar campos obligatorios (según tu tabla Cursos)
            if (empty($idCurso) || empty($nombre) || empty($horario) || empty($lugar) || empty($instructor) || empty($contacto) || empty($imagenBase64)) {
                responder(false, 'Todos los campos son obligatorios, incluyendo la imagen.', null, 400);
            }

            $sql = "INSERT INTO Cursos (id, nombre, horario, lugar, instructor, contacto, imagen, idUsuario_creador) 
                    VALUES (:id, :nombre, :horario, :lugar, :instructor, :contacto, :imagen, :idUsuario_creador)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':id' => $idCurso,
                ':nombre' => $nombre,
                ':horario' => $horario,
                ':lugar' => $lugar,
                ':instructor' => $instructor,
                ':contacto' => $contacto,
                ':imagen' => $imagenBase64, // Se guarda como LONGTEXT
                ':idUsuario_creador' => $idUsuarioLogueado
            ]);
            responder(true, 'Curso creado exitosamente.', ['id' => $idCurso], 201); // 201 Created
            break;

        case 'obtenerCursos':
            // Los maestros ven solo sus cursos. Los estudiantes ven todos los cursos.
            if ($rolUsuarioLogueado === 'Maestro') {
                $sql = "SELECT id, nombre, horario, lugar, instructor, contacto, imagen 
                        FROM Cursos 
                        WHERE idUsuario_creador = :idUsuario_creador 
                        ORDER BY fecha_creacion DESC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':idUsuario_creador' => $idUsuarioLogueado]);
            } else { // Estudiantes u otros roles ven todos los cursos
                $sql = "SELECT id, nombre, horario, lugar, instructor, contacto, imagen 
                        FROM Cursos 
                        ORDER BY fecha_creacion DESC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute();
            }
            $cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            responder(true, 'Cursos obtenidos exitosamente.', $cursos);
            break;

        case 'actualizarCurso':
            if ($rolUsuarioLogueado !== 'Maestro') {
                responder(false, 'Acción no autorizada para actualizar.', null, 403);
            }

            $idCursoActualizar = trim($_POST['id'] ?? '');
            $nombre = trim($_POST['nombre'] ?? '');
            $horario = trim($_POST['horario'] ?? '');
            $lugar = trim($_POST['lugar'] ?? '');
            $instructor = trim($_POST['instructor'] ?? '');
            $contacto = trim($_POST['contacto'] ?? '');
            $imagenBase64 = $_POST['imagen'] ?? '';

            if (empty($idCursoActualizar) || empty($nombre) || empty($horario) || empty($lugar) || empty($instructor) || empty($contacto) || empty($imagenBase64)) {
                responder(false, 'Todos los campos son obligatorios para actualizar.', null, 400);
            }

            // Verificar que el maestro es el creador del curso antes de actualizar
            $sqlCheck = "SELECT idUsuario_creador FROM Cursos WHERE id = :id";
            $stmtCheck = $pdo->prepare($sqlCheck);
            $stmtCheck->execute([':id' => $idCursoActualizar]);
            $cursoExistente = $stmtCheck->fetch();

            if (!$cursoExistente) {
                responder(false, 'Curso no encontrado para actualizar.', null, 404);
            }
            if ($cursoExistente['idUsuario_creador'] != $idUsuarioLogueado) {
                responder(false, 'No tiene permiso para modificar este curso.', null, 403);
            }

            $sql = "UPDATE Cursos SET nombre = :nombre, horario = :horario, lugar = :lugar, 
                    instructor = :instructor, contacto = :contacto, imagen = :imagen 
                    WHERE id = :id AND idUsuario_creador = :idUsuario_creador";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':nombre' => $nombre,
                ':horario' => $horario,
                ':lugar' => $lugar,
                ':instructor' => $instructor,
                ':contacto' => $contacto,
                ':imagen' => $imagenBase64,
                ':id' => $idCursoActualizar,
                ':idUsuario_creador' => $idUsuarioLogueado
            ]);

            if ($stmt->rowCount() > 0) {
                responder(true, 'Curso actualizado exitosamente.');
            } else {
                // Podría ser que no hubo cambios efectivos o el curso no se encontró (ya cubierto por el check)
                responder(false, 'No se pudo actualizar el curso o no hubo cambios.');
            }
            break;

        case 'eliminarCurso':
            if ($rolUsuarioLogueado !== 'Maestro') {
                responder(false, 'Acción no autorizada para eliminar.', null, 403);
            }

            $idCursoEliminar = trim($_POST['id'] ?? '');
            if (empty($idCursoEliminar)) {
                responder(false, 'ID del curso no proporcionado para eliminar.', null, 400);
            }

            // Verificar que el maestro es el creador del curso antes de eliminar
            $sqlCheck = "SELECT idUsuario_creador FROM Cursos WHERE id = :id";
            $stmtCheck = $pdo->prepare($sqlCheck);
            $stmtCheck->execute([':id' => $idCursoEliminar]);
            $cursoExistente = $stmtCheck->fetch();

            if (!$cursoExistente) {
                responder(false, 'Curso no encontrado para eliminar.', null, 404);
            }
            if ($cursoExistente['idUsuario_creador'] != $idUsuarioLogueado) {
                responder(false, 'No tiene permiso para eliminar este curso.', null, 403);
            }

            // La tabla Inscripciones (si la creaste como se discutió) debería tener ON DELETE CASCADE
            // para que las inscripciones se eliminen automáticamente al borrar un curso.
            // Si no, necesitarías borrar las inscripciones manualmente primero.

            $sql = "DELETE FROM Cursos WHERE id = :id AND idUsuario_creador = :idUsuario_creador";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':id' => $idCursoEliminar,
                ':idUsuario_creador' => $idUsuarioLogueado
            ]);

            if ($stmt->rowCount() > 0) {
                responder(true, 'Curso eliminado exitosamente.');
            } else {
                responder(false, 'No se pudo eliminar el curso.');
            }
            break;

        default:
            responder(false, 'Acción no especificada o no válida.', null, 400);
            break;
    }
} catch (PDOException $e) {
    error_log("Error de PDO en cursos_controller.php: " . $e->getMessage() . " - SQL: " . ($stmt ?? null ? $stmt->queryString : "N/A"));
    responder(false, 'Error en la base de datos. Por favor, inténtelo más tarde.', null, 500);
} catch (Exception $e) {
    error_log("Error general en cursos_controller.php: " . $e->getMessage());
    responder(false, 'Ocurrió un error inesperado: ' . $e->getMessage(), null, 500);
}
?>