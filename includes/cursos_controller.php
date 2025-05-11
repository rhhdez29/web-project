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
// Definida aquí para asegurar que esté disponible para este script.
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

// Verificar que el usuario esté logueado para cualquier acción
// verificar_sesion.php ya debería haber manejado esto, pero una doble comprobación aquí es segura.
if (!$idUsuarioLogueado) {
    responder(false, 'Usuario no autenticado. Por favor, inicie sesión.', null, 401);
}

try {
    switch ($action) {
        case 'crearCurso':
            if ($rolUsuarioLogueado !== 'Maestro') {
                responder(false, 'Acción no autorizada. Solo los maestros pueden crear cursos.', null, 403);
            }

            $idCurso = trim($_POST['id'] ?? '');
            $nombre = trim($_POST['nombre'] ?? '');
            $horario = trim($_POST['horario'] ?? '');
            $lugar = trim($_POST['lugar'] ?? '');
            $instructor = trim($_POST['instructor'] ?? '');
            $contacto = trim($_POST['contacto'] ?? '');
            $imagenBase64 = $_POST['imagen'] ?? '';
            $asesoria = trim($_POST['asesoria'] ?? ''); // Añadido campo asesoría

            // Validar campos obligatorios (según tu tabla Cursos y formulario)
            // Ajusta esta validación según tus necesidades.
            // El controller original marcaba la imagen como obligatoria.
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
            // Los maestros ven solo sus cursos. Los estudiantes ven todos (cuando se implemente inscripciones).
            // Por ahora, si no es maestro, devuelve todos los cursos.
            $cursos = [];
            if ($rolUsuarioLogueado === 'Maestro') {
                $sql = "SELECT id, nombre, horario, lugar, instructor, contacto, imagen, asesoria 
                        FROM Cursos 
                        WHERE idUsuario_creador = :idUsuario_creador 
                        ORDER BY fecha_creacion DESC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':idUsuario_creador' => $idUsuarioLogueado]);
                $cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else { // Estudiantes u otros roles ven todos los cursos (o los inscritos en el futuro)
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
            if ($rolUsuarioLogueado !== 'Maestro') {
                responder(false, 'Acción no autorizada para actualizar.', null, 403);
            }

            $idCursoActualizar = trim($_POST['id'] ?? '');
            $nombre = trim($_POST['nombre'] ?? '');
            $horario = trim($_POST['horario'] ?? '');
            $lugar = trim($_POST['lugar'] ?? '');
            $instructor = trim($_POST['instructor'] ?? '');
            $contacto = trim($_POST['contacto'] ?? '');
            $imagenBase64 = $_POST['imagen'] ?? ''; // Puede ser opcional si no se cambia
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
            
            // Construir la sentencia SQL dinámicamente para la imagen
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
                ':idUsuario_creador' => $idUsuarioLogueado
            ];

            if (!empty($imagenBase64)) {
                $updateFields .= ", imagen = :imagen";
                $params[':imagen'] = $imagenBase64;
            }

            $sql = "UPDATE Cursos SET $updateFields 
                    WHERE id = :id AND idUsuario_creador = :idUsuario_creador";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            if ($stmt->rowCount() > 0) {
                responder(true, 'Curso actualizado exitosamente.');
            } else {
                // Podría ser que no hubo cambios efectivos o el curso no se encontró (ya cubierto por el check)
                responder(false, 'No se pudo actualizar el curso o no hubo cambios detectables.');
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
            } 
            // elseif ($rolUsuarioLogueado === 'Estudiante') { // TEMPORALMENTE COMENTADO
                // $sql = "SELECT c.id, c.nombre 
                //         FROM Cursos c
                //         JOIN Inscripciones i ON c.id = i.idCurso_inscrito
                //         WHERE i.idUsuario_estudiante = :idUsuario 
                //         ORDER BY c.nombre ASC";
                // $stmt = $pdo->prepare($sql);
                // $stmt->execute([':idUsuario' => $idUsuarioLogueado]);
                // $cursosMenu = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // }
            responder(true, 'Cursos para menú obtenidos.', $cursosMenu);
            break;

        default:
            responder(false, 'Acción no especificada o no válida.', null, 400);
            break;
    }
} catch (PDOException $e) {
    // Loguear el error real para depuración del lado del servidor
    error_log("Error de PDO en cursos_controller.php (Action: $action): " . $e->getMessage() . " - SQL: " . ($stmt ?? null ? $stmt->queryString : "N/A"));
    // Enviar un mensaje genérico al cliente
    responder(false, 'Error en la base de datos. Por favor, inténtelo más tarde.', null, 500);
} catch (Exception $e) {
    error_log("Error general en cursos_controller.php (Action: $action): " . $e->getMessage());
    responder(false, 'Ocurrió un error inesperado: ' . $e->getMessage(), null, 500);
}
?>