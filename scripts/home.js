document.addEventListener('DOMContentLoaded', function() {
    // Variables para el calendario
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = new Date(currentDate);
    let plannerItems = [];

    // Elementos del DOM
    const calendarDaysEl = document.getElementById('calendar-days');
    const currentMonthEl = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const toggleModeBtn = document.getElementById('toggle-mode');

    // Inicializar modo oscuro desde localStorage
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('modo-oscuro');
        toggleModeBtn.checked = true;
    }

    // Evento para cambiar el modo oscuro
    toggleModeBtn.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('modo-oscuro');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('modo-oscuro');
            localStorage.setItem('darkMode', 'false');
        }
    });

    // Función para cargar elementos del planificador
    async function loadPlannerItems() {
        try {
            const response = await fetch('../includes/planificador.php?action=getItems');
            const data = await response.json();
            
            if (data.error) {
                console.error('Error al cargar tareas:', data.error);
                return;
            }
            
            plannerItems = data.map(item => {
                const [year, month, day] = item.Fecha.split('-').map(Number);
                
                return {
                    id: item.idPlanificador,
                    title: item.Titulo,
                    type: item.Tipo === 'Tarea' ? 'task' : 
                          (item.Tipo === 'Cita' ? 'appointment' : 'goal'),
                    date: new Date(year, month - 1, day, 12, 0, 0),
                    time: item.Hora,
                    description: item.Descripcion,
                    important: item.Importante == 1
                };
            });
            
            renderCalendar();
            mostrarTareasDelDia(selectedDate);
            
        } catch (error) {
            console.error('Error al cargar tareas:', error);
        }
    }

    // --- MODIFICACIÓN: Cargar tarjetas de apuntes reales ---
    async function cargarTarjetasApuntes() {
    const tarjetas = document.querySelector('.tarjetas');
    if (!tarjetas) return;

    // Tarjeta para crear nuevo apunte
    tarjetas.innerHTML = `
        <div class="tarjeta nueva">
            <p>¿Creamos algo nuevo?</p>
            <a href="apuntes.php">
                <svg id="Editar" width="60" height="70">
                    <use href="#icon-papel"></use>
                </svg>
            </a>
        </div>
    `;

    try {
        const response = await fetch('../includes/apuntes.php', { method: 'GET' });
        const data = await response.json();
        if (data.success && Array.isArray(data.apuntes)) {
            data.apuntes.slice(0, 5).forEach(apunte => {
                const div = document.createElement('div');
                div.className = 'tarjeta apunte';
                div.innerHTML = `
                    <div class="apunte-link" style="cursor:pointer;">
                        <h3>${apunte.titulo || "Sin título"}</h3>
                        <p>Actualizado: ${new Date(apunte.fecha_actualizacion).toLocaleDateString()}</p>
                    </div>
                `;
                div.querySelector('.apunte-link').onclick = (e) => {
                    e.preventDefault();
                    // Cargar el apunte en el iframe del editor central
                    const content = window.parent.document.getElementById('main-content');
                    let iframe = content.querySelector('iframe');
                    if (!iframe || !iframe.src.includes('apuntes.php')) {
                        content.innerHTML = `<iframe src="apuntes.php" width="100%" height="100%" style="border: none;"></iframe>`;
                        iframe = content.querySelector('iframe');
                        iframe.onload = function() {
                            iframe.contentWindow.postMessage({
                                type: 'cargarApunte',
                                idApuntes: apunte.idApuntes,
                                titulo: apunte.titulo,
                                contenido_html: apunte.contenido_html
                            }, '*');
                        };
                    } else {
                        iframe.contentWindow.postMessage({
                            type: 'cargarApunte',
                            idApuntes: apunte.idApuntes,
                            titulo: apunte.titulo,
                            contenido_html: apunte.contenido_html
                        }, '*');
                    }
                };
                tarjetas.appendChild(div);
            });
        }
    } catch (err) {
        console.error("Error al cargar apuntes:", err);
    }
}

    // Verificar si un día tiene tareas
    function doesDateHaveItems(date) {
        return plannerItems.some(item => 
            item.date.getDate() === date.getDate() &&
            item.date.getMonth() === date.getMonth() &&
            item.date.getFullYear() === date.getFullYear()
        );
    }

    function renderCalendar() {
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        calendarDaysEl.innerHTML = '';
        
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day inactive';
            dayEl.textContent = daysInPrevMonth - i;
            calendarDaysEl.appendChild(dayEl);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const hasItems = doesDateHaveItems(date);
            
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            if (isToday) dayEl.classList.add('today');
            if (isSelected) dayEl.classList.add('selected');
            if (hasItems) dayEl.classList.add('has-items');
            
            dayEl.textContent = day;
            
            dayEl.addEventListener('click', () => {
                document.querySelectorAll('.calendar-day.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                
                dayEl.classList.add('selected');
                selectedDate = date;
                mostrarTareasDelDia(selectedDate);
            });
            
            calendarDaysEl.appendChild(dayEl);
        }
        
        const totalDaysShown = adjustedFirstDay + daysInMonth;
        const daysFromNextMonth = 42 - totalDaysShown;
        for (let day = 1; day <= daysFromNextMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day inactive';
            dayEl.textContent = day;
            calendarDaysEl.appendChild(dayEl);
        }
    }

    function mostrarTareasDelDia(fecha) {
        const contenedor = document.getElementById('contenedor-tareas');
        if (!contenedor) {
            console.error('Elemento contenedor-tareas no encontrado');
            return;
        }
        
        contenedor.innerHTML = '';
        
        const fechaFormateada = fecha.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const tituloFecha = document.createElement('h3');
        tituloFecha.className = 'titulo-fecha';
        tituloFecha.textContent = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
        contenedor.appendChild(tituloFecha);
        
        const tarjetasContenedor = document.createElement('div');
        tarjetasContenedor.className = 'tarjetas-contenedor';
        contenedor.appendChild(tarjetasContenedor);
        
        const tareasDelDia = plannerItems.filter(item => 
            item.date.getDate() === fecha.getDate() &&
            item.date.getMonth() === fecha.getMonth() &&
            item.date.getFullYear() === fecha.getFullYear()
        );
        
        if (tareasDelDia.length === 0) {
            const tareaVacia = document.createElement('div');
            tareaVacia.classList.add('tarea', 'tarea-vacia');
            tareaVacia.innerHTML = `
                <div class="tarjeta-tarea">
                    <p class="no-tareas">No hay actividades programadas para este día.</p>
                </div>
            `;
            tarjetasContenedor.appendChild(tareaVacia);
        } else {
            tareasDelDia.forEach(tarea => {
                const tareaEl = document.createElement('div');
                tareaEl.classList.add('tarea');
                
                if (tarea.type === 'task') tareaEl.classList.add('tarea-normal');
                else if (tarea.type === 'appointment') tareaEl.classList.add('tarea-cita');
                else tareaEl.classList.add('tarea-objetivo');
                
                if (tarea.important) tareaEl.classList.add('tarea-importante');
                
                tareaEl.innerHTML = `
                    <div class="tarjeta-tarea">
                        <div class="tarea-header">
                            <h4>${tarea.title}</h4>
                            ${tarea.important ? '<span class="importante"><i class="bx bx-star"></i></span>' : ''}
                        </div>
                        ${tarea.time ? `<p class="tarea-hora"><i class='bx bx-time'></i> ${tarea.time}</p>` : ''}
                        ${tarea.description ? `<p class="tarea-descripcion">${tarea.description}</p>` : ''}
                    </div>
                `;
                
                tarjetasContenedor.appendChild(tareaEl);
            });
        }
    }

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    renderCalendar();
    mostrarTareasDelDia(selectedDate);
    loadPlannerItems();
    cargarTarjetasApuntes();
});