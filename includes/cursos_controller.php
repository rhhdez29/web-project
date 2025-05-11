<?php
// Es crucial iniciar la sesión aquí ANTES de incluir verificar_sesion.php,
// para que verificar_sesion.php pueda usar la sesión ya iniciada.

include_once 'conexion.php'; // Para la conexión $pdo
include_once 'verificar_sesion.php'; // Ya debería manejar la redirección/error si no hay sesión

header('Content-Type: application/json'); // La respuesta siempre será en formato JSON

$action = $_POST['action'] ?? $_GET['action'] ?? null;
$idUsuarioLogueado = $_SESSION['idUsuario'] ?? null;
$rolUsuarioLogueado = $_SESSION['rol'] ?? null;

// Función auxiliar para enviar respuestas JSON estandarizadas
if (!function_exists('responder')) {
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
}

if (!$idUsuarioLogueado) {
    responder(false, 'Usuario no autenticado. Por favor, inicie sesión.', null, 401);
}

try {
    switch ($action) {
        case 'crearCurso':
            if ($rolUsuarioLogueado !== 'Maestro') {
                responder(false, 'Acción no autorizada. Solo los maestros pueden crear cursos.', null, 403);
            }
            // ... (código existente de crearCurso sin cambios)
            $idCurso = trim($_POST['id'] ?? '');
            $nombre = trim($_POST['nombre'] ?? '');
            $horario = trim($_POST['horario'] ?? '');
            $lugar = trim($_POST['lugar'] ?? '');
            $instructor = trim($_POST['instructor'] ?? '');
            $contacto = trim($_POST['contacto'] ?? '');
            $imagenBase64 = $_POST['imagen'] ?? '';
            $asesoria = trim($_POST['asesoria'] ?? '');

            if (empty($idCurso) || empty($nombre) || empty($horario) || empty($lugar) || empty($instructor) || empty($contacto) || empty($imagenBase64) || empty($asesoria) ) {
                responder(false, 'Todos los campos son obligatorios, incluyendo la imagen y la asesoría.', null, 400);
            }

            $sql = "INSERT INTO Cursos (id, nombre, horario, lugar, instructor, contacto, imagen, asesoria, idUsuario_creador) 
                    VALUES (:id, :nombre, :horario, :lugar, :instructor, :contacto, :imagen, :asesoria, :idUsuario_creador)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':id' => $idCurso,
                ':nombre' => $nombre,
                ':horario' => $horario,
                ':lugar' => $lugar,
                ':instructor' => $instructor,
                ':contacto' => $contacto,
                ':imagen' => $imagenBase64,
                ':asesoria' => $asesoria,
                ':idUsuario_creador' => $idUsuarioLogueado
            ]);
            responder(true, 'Curso creado exitosamente.', ['id' => $idCurso], 201);
            break;

        case 'obtenerCursos':
            $cursos = [];
            if ($rolUsuarioLogueado === 'Maestro') {
                $sql = "SELECT id, nombre, horario, lugar, instructor, contacto, imagen, asesoria 
                        FROM Cursos 
                        WHERE idUsuario_creador = :idUsuario_creador 
                        ORDER BY fecha_creacion DESC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':idUsuario_creador' => $idUsuarioLogueado]);
                $cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else if ($rolUsuarioLogueado === 'Estudiante') {
                // Para estudiantes, obtenemos todos los cursos y marcamos si están inscritos
                $sql = "SELECT c.id, c.nombre, c.horario, c.lugar, c.instructor, c.contacto, c.imagen, c.asesoria,
                               (EXISTS(SELECT 1 FROM Inscripciones i WHERE i.Cursos_id = c.id AND i.Usuario_idUsuario = :idUsuarioLogueado)) AS esta_inscrito
                        FROM Cursos c
                        ORDER BY c.fecha_creacion DESC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':idUsuarioLogueado' => $idUsuarioLogueado]);
                $cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                // Convertir 'esta_inscrito' a booleano si es necesario (depende del driver PDO)
                foreach ($cursos as $key => $curso) {
                    $cursos[$key]['esta_inscrito'] = (bool)$curso['esta_inscrito'];
                }
            } else { // Otros roles (si los hubiera) podrían ver todos los cursos sin estado de inscripción
                $sql = "SELECT id, nombre, horario, lugar, instructor, contacto, imagen, asesoria 
                        FROM Cursos 
                        ORDER BY fecha_creacion DESC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute();
                $cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            responder(true, 'Cursos obtenidos exitosamente.', $cursos);
            break;

        case 'actualizarCurso':
            // ... (código existente de actualizarCurso sin cambios, ya verifica rol Maestro y idUsuario_creador)
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
            $asesoria = trim($_POST['asesoria'] ?? '');

            if (empty($idCursoActualizar) || empty($nombre) || empty($horario) || empty($lugar) || empty($instructor) || empty($contacto) || empty($asesoria)) {
                responder(false, 'Todos los campos (excepto la imagen si no se cambia) son obligatorios para actualizar.', null, 400);
            }

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
            
            $updateFields = "nombre = :nombre, horario = :horario, lugar = :lugar, 
                             instructor = :instructor, contacto = :contacto, asesoria = :asesoria";
            $params = [
                ':nombre' => $nombre,
                ':horario' => $horario,
                ':lugar' => $lugar,
                ':instructor' => $instructor,
                ':contacto' => $contacto,
                ':asesoria' => $asesoria,
                ':id' => $idCursoActualizar,
                // ':idUsuario_creador' => $idUsuarioLogueado // No es necesario en el SET, sí en el WHERE
            ];

            if (!empty($imagenBase64)) {
                $updateFields .= ", imagen = :imagen";
                $params[':imagen'] = $imagenBase64;
            }
            // Añadir idUsuario_creador al final para el WHERE
            $params[':idUsuario_creador_where'] = $idUsuarioLogueado;


            $sql = "UPDATE Cursos SET $updateFields 
                    WHERE id = :id AND idUsuario_creador = :idUsuario_creador_where";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            if ($stmt->rowCount() > 0) {
                responder(true, 'Curso actualizado exitosamente.');
            } else {
                responder(false, 'No se pudo actualizar el curso o no hubo cambios detectables.');
            }
            break;

        case 'eliminarCurso':
            // ... (código existente de eliminarCurso sin cambios, ya verifica rol Maestro y idUsuario_creador)
             if ($rolUsuarioLogueado !== 'Maestro') {
                responder(false, 'Acción no autorizada para eliminar.', null, 403);
            }

            $idCursoEliminar = trim($_POST['id'] ?? '');
            if (empty($idCursoEliminar)) {
                responder(false, 'ID del curso no proporcionado para eliminar.', null, 400);
            }

            // Antes de eliminar un curso, se deberían eliminar las inscripciones asociadas
            // o la FK debería tener ON DELETE CASCADE (lo cual ya configuramos en la tabla Inscripciones)
            // Si no tuviera ON DELETE CASCADE, haríamos esto:
            // $sqlDeleteInscripciones = "DELETE FROM Inscripciones WHERE Cursos_id = :idCurso";
            // $stmtDeleteInscripciones = $pdo->prepare($sqlDeleteInscripciones);
            // $stmtDeleteInscripciones->execute([':idCurso' => $idCursoEliminar]);


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

        case 'obtenerCursosParaMenu':
            $cursosMenu = [];
            if ($rolUsuarioLogueado === 'Maestro') {
                $sql = "SELECT id, nombre FROM Cursos WHERE idUsuario_creador = :idUsuario ORDER BY nombre ASC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':idUsuario' => $idUsuarioLogueado]);
                $cursosMenu = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } elseif ($rolUsuarioLogueado === 'Estudiante') {
                // Los estudiantes ven los cursos en los que están inscritos
                $sql = "SELECT c.id, c.nombre 
                        FROM Cursos c
                        JOIN Inscripciones i ON c.id = i.Cursos_id
                        WHERE i.Usuario_idUsuario = :idUsuario 
                        ORDER BY c.nombre ASC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':idUsuario' => $idUsuarioLogueado]);
                $cursosMenu = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            responder(true, 'Cursos para menú obtenidos.', $cursosMenu);
            break;

        case 'inscribirAlumnoEnCurso':
            if ($rolUsuarioLogueado !== 'Estudiante') {
                responder(false, 'Acción no autorizada. Solo los estudiantes pueden inscribirse.', null, 403);
            }
            $idCursoInscribir = trim($_POST['idCurso'] ?? '');
            if (empty($idCursoInscribir)) {
                responder(false, 'ID del curso no proporcionado para la inscripción.', null, 400);
            }

            // Verificar que el curso exista
            $sqlCheckCurso = "SELECT id FROM Cursos WHERE id = :idCurso";
            $stmtCheckCurso = $pdo->prepare($sqlCheckCurso);
            $stmtCheckCurso->execute([':idCurso' => $idCursoInscribir]);
            if (!$stmtCheckCurso->fetch()) {
                responder(false, 'El curso especificado no existe.', null, 404);
            }

            // Verificar si ya está inscrito (aunque la BD tiene UNIQUE KEY, es bueno chequear)
            $sqlCheckInscripcion = "SELECT idInscripciones FROM Inscripciones WHERE Usuario_idUsuario = :idUsuario AND Cursos_id = :idCurso";
            $stmtCheckInscripcion = $pdo->prepare($sqlCheckInscripcion);
            $stmtCheckInscripcion->execute([':idUsuario' => $idUsuarioLogueado, ':idCurso' => $idCursoInscribir]);
            if ($stmtCheckInscripcion->fetch()) {
                responder(false, 'Ya estás inscrito en este curso.', null, 409); // 409 Conflict
            }

            // Inscribir al alumno
            $sqlInscribir = "INSERT INTO Inscripciones (Usuario_idUsuario, Cursos_id) VALUES (:idUsuario, :idCurso)";
            $stmtInscribir = $pdo->prepare($sqlInscribir);
            $stmtInscribir->execute([
                ':idUsuario' => $idUsuarioLogueado,
                ':idCurso' => $idCursoInscribir
            ]);
            responder(true, 'Inscripción realizada exitosamente.', ['idCurso' => $idCursoInscribir], 201);
            break;

        case 'desinscribirAlumnoDeCurso':
            if ($rolUsuarioLogueado !== 'Estudiante') {
                responder(false, 'Acción no autorizada. Solo los estudiantes pueden desinscribirse.', null, 403);
            }
            $idCursoDesinscribir = trim($_POST['idCurso'] ?? '');
            if (empty($idCursoDesinscribir)) {
                responder(false, 'ID del curso no proporcionado para la desinscripción.', null, 400);
            }

            // Desinscribir al alumno
            $sqlDesinscribir = "DELETE FROM Inscripciones WHERE Usuario_idUsuario = :idUsuario AND Cursos_id = :idCurso";
            $stmtDesinscribir = $pdo->prepare($sqlDesinscribir);
            $stmtDesinscribir->execute([
                ':idUsuario' => $idUsuarioLogueado,
                ':idCurso' => $idCursoDesinscribir
            ]);

            if ($stmtDesinscribir->rowCount() > 0) {
                responder(true, 'Te has desinscrito del curso exitosamente.');
            } else {
                responder(false, 'No se pudo procesar la desinscripción. Es posible que no estuvieras inscrito.');
            }
            break;

        default:
            responder(false, 'Acción no especificada o no válida.', null, 400);
            break;
    }
} catch (PDOException $e) {
    error_log("Error de PDO en cursos_controller.php (Action: $action): " . $e->getMessage() . " - SQL: " . ($stmt ?? null ? $stmt->queryString : "N/A"));
    responder(false, 'Error en la base de datos. Por favor, inténtelo más tarde.', null, 500);
} catch (Exception $e) {
    error_log("Error general en cursos_controller.php (Action: $action): " . $e->getMessage());
    responder(false, 'Ocurrió un error inesperado: ' . $e->getMessage(), null, 500);
}
?>