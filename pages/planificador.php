<?php 
//verificamos si el usuario ha iniciado sesión
include_once '../includes/verificar_sesion.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Planificador</title>
    <link rel="stylesheet" href="../assets/styles/planificador.css">
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
</head>
<body>
    <div class="planificador-container">
        <!-- Header section -->
        <header class="planificador-header">
            <h1>Mi Planificador</h1>
            <button id="add-item-btn" class="add-btn">
                <i class='bx bx-plus'></i> Añadir
            </button>
        </header>

        <!-- Contenido principal -->
        <main class="planificador-content">
            <!--Lado izquierdo calendario -->
            <div class="left-sidebar">
                <div class="calendar-container">
                    <div class="calendar-header">
                        <button id="prev-month" class="calendar-nav-btn"><i class='bx bx-chevron-left'></i></button>
                        <h2 id="current-month">Abril 2025</h2>
                        <button id="next-month" class="calendar-nav-btn"><i class='bx bx-chevron-right'></i></button>
                    </div>
                    <div class="weekdays">
                        <span>Lu</span>
                        <span>Ma</span>
                        <span>Mi</span>
                        <span>Ju</span>
                        <span>Vi</span>
                        <span>Sa</span>
                        <span>Do</span>
                    </div>
                    <div id="calendar-days" class="calendar-days">
                        <!-- Calendario generado por JavaScript -->
                    </div>
                </div>

                <div class="important-reminders">
                    <h3><i class='bx bx-bookmark'></i> Recordatorios Importantes</h3>
                    <div id="important-reminders-list" class="reminders-list">
                        <!-- Generado por JavaScript -->
                    </div>
                </div>
            </div>

            <!-- vistas por semana -->
            <div class="weekly-container">
                <div class="weekly-goal-section">
                    <h3><i class='bx bx-target-lock'></i> Objetivo Semanal</h3>
                    <div id="weekly-goal" class="weekly-goal">
                        <!-- Semana metas -->
                    </div>
                </div>

                <div class="weekly-items">
                    <h2 id="weekly-title">Semana Actual</h2>
                    <div id="weekly-grid" class="weekly-grid">
                        <!-- Items generados JavaScript -->
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Nuevos items -->
    <div id="add-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Añadir Nuevo</h2>
                <button id="close-modal" class="close-btn"><i class='bx bx-x'></i></button>
            </div>
            <form id="add-item-form">
                <div class="form-group">
                    <label for="item-date">Fecha:</label>
                    <input type="date" id="item-date" required>
                </div>
                <div class="form-group">
                    <label for="item-type">Tipo:</label>
                    <select id="item-type" required>
                        <option value="">Seleccionar...</option>
                        <option value="task">Tarea</option>
                        <option value="appointment">Cita</option>
                        <option value="goal">Objetivo Semanal</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="item-title">Título:</label>
                    <input type="text" id="item-title" required>
                </div>
                <div class="form-group">
                    <label for="item-time">Hora (opcional):</label>
                    <input type="time" id="item-time">
                </div>
                <div class="form-group">
                    <label for="item-description">Descripción (opcional):</label>
                    <textarea id="item-description" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="item-important">
                        Marcar como importante
                    </label>
                </div>
                <div class="form-actions">
                    <button type="button" id="cancel-btn" class="cancel-btn">Cancelar</button>
                    <button type="submit" class="submit-btn">Guardar</button>
                </div>
            </form>
        </div>
    </div>
    
    <script>
        // Función para sincronizar el modo oscuro
        function syncDarkMode() {
            const darkMode = localStorage.getItem('darkMode') === 'true' || 
                            document.cookie.includes('darkMode=true');
            
            if (darkMode) {
                document.body.classList.add('modo-oscuro');
            } else {
                document.body.classList.remove('modo-oscuro');
            }
        }

        // Escuchar cambios en el modo oscuro
        window.addEventListener('storage', function(event) {
            if (event.key === 'darkMode') {
                syncDarkMode();
            }
        });

        // Sincronizar al cargar
        document.addEventListener('DOMContentLoaded', syncDarkMode);
    </script>
    
    <script src="../scripts/dark-mode.js"></script>

    <script src="../scripts/planificador.js"></script>
</body>
</html>
