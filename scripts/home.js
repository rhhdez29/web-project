document.addEventListener('DOMContentLoaded', function () {
    // Referencias a elementos DOM
    const calendarDaysEl = document.getElementById('calendar-days');
    const currentMonthEl = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    // Variables de estado
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = new Date(currentDate);
    let plannerItems = []; // Almacena las tareas del planificador

    // Función para cargar elementos del planificador desde la base de datos
    async function loadPlannerItems() {
        try {
            const response = await fetch('../includes/planificador.php?action=getItems');
            const data = await response.json();
            
            if (data.error) {
                console.error('Error al cargar tareas:', data.error);
                return;
            }
            
            // Procesar los datos recibidos
            plannerItems = data.map(item => {
                // Extraer componentes de fecha para evitar problemas de zona horaria
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
            
            // Actualizar el calendario
            renderCalendar();
            
            // Mostrar tareas del día actual
            mostrarTareasDelDia(selectedDate);
            
        } catch (error) {
            console.error('Error al cargar tareas:', error);
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

    function initTrabajosRecientes() { // Inicializa los trabajos recientes
        // Esta función simula la carga de trabajos recientes
        // En un caso real, aquí se haría una llamada a la base de datos
         const trabajos = [
            { titulo: "Apunte de Álgebra", icono: "#icon-papel" },
            { titulo: "Resumen de Historia", icono: "#icon-papel" },
            { titulo: "Práctica de Física", icono: "#icon-papel" },
             { titulo: "Apunte de Álgebra", icono: "#icon-papel" },
            { titulo: "Resumen de Historia", icono: "#icon-papel" },
            { titulo: "Práctica de Física", icono: "#icon-papel" },
             { titulo: "Apunte de Álgebra", icono: "#icon-papel" },
            { titulo: "Resumen de Historia", icono: "#icon-papel" },
            { titulo: "Práctica de Física", icono: "#icon-papel" },
             { titulo: "Apunte de Álgebra", icono: "#icon-papel" },
            { titulo: "Resumen de Historia", icono: "#icon-papel" },
            { titulo: "Práctica de Física", icono: "#icon-papel" }
        ];

        cargarTarjetas(trabajos);
    }

    // Cargar tarjetas de trabajos recientes
    // Esta función crea y carga las tarjetas en el contenedor
    function cargarTarjetas(trabajos) {
        const contenedor = document.querySelector(".tarjetas"); // ✅ Usar clase real del HTML

        if (!contenedor) {
            console.error("Contenedor .tarjetas no encontrado");
            return;
        }

        // Mantener la primera tarjeta existente ("¿Creamos algo nuevo?")
        const primeraTarjeta = contenedor.querySelector(".tarjeta");
        contenedor.innerHTML = '';
        contenedor.appendChild(primeraTarjeta);

        trabajos.forEach(trabajo => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta";

            const p = document.createElement("p");
            p.textContent = trabajo.titulo;

            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "60");
            svg.setAttribute("height", "70");

            const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttributeNS("http://www.w3.org/1999/xlink", "href", trabajo.icono);

            svg.appendChild(use);
            tarjeta.appendChild(p);
            tarjeta.appendChild(svg);
            contenedor.appendChild(tarjeta);
        });
    }




    // Renderizar el calendario
    function renderCalendar() {
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Limpiar el contenedor
        calendarDaysEl.innerHTML = '';
        
        // Calcular el primer día del mes (ajustado para que lunes sea el día 1)
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        
        // Días del mes anterior (inactivos)
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day inactive';
            dayEl.textContent = daysInPrevMonth - i;
            calendarDaysEl.appendChild(dayEl);
        }
        
        // Días del mes actual
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
            
            // Evento de click para seleccionar día
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
        
        // Días del mes siguiente (inactivos)
        const totalDaysShown = adjustedFirstDay + daysInMonth;
        const daysFromNextMonth = 42 - totalDaysShown; // 42 = 6 semanas x 7 días
        for (let day = 1; day <= daysFromNextMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day inactive';
            dayEl.textContent = day;
            calendarDaysEl.appendChild(dayEl);
        }
    }

    // Mostrar tareas del día seleccionado
    function mostrarTareasDelDia(fecha) {
    const contenedor = document.getElementById('contenedor-tareas');
    if (!contenedor) {
        console.error('Elemento contenedor-tareas no encontrado');
        return;
    }
    
    contenedor.innerHTML = ''; // Limpiar contenedor
    
    // Añadir título con la fecha
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
    
    // Crear contenedor para las tarjetas
    const tarjetasContenedor = document.createElement('div');
    tarjetasContenedor.className = 'tarjetas-contenedor';
    contenedor.appendChild(tarjetasContenedor);
    
    // Filtrar tareas del día seleccionado
    const tareasDelDia = plannerItems.filter(item => 
        item.date.getDate() === fecha.getDate() &&
        item.date.getMonth() === fecha.getMonth() &&
        item.date.getFullYear() === fecha.getFullYear()
    );
    
    if (tareasDelDia.length === 0) {
        // Crear una estructura similar a cuando hay tareas
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
            
            // Añadir clase según el tipo de tarea
            if (tarea.type === 'task') tareaEl.classList.add('tarea-normal');
            else if (tarea.type === 'appointment') tareaEl.classList.add('tarea-cita');
            else tareaEl.classList.add('tarea-objetivo');
            
            // Si es importante, añadir clase
            if (tarea.important) tareaEl.classList.add('tarea-importante');
            
            // Crear tarjeta con los datos de la tarea
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
}function mostrarTareasDelDia(fecha) {
    const contenedor = document.getElementById('contenedor-tareas');
    if (!contenedor) {
        console.error('Elemento contenedor-tareas no encontrado');
        return;
    }
    
    contenedor.innerHTML = ''; // Limpiar contenedor
    
    // Añadir título con la fecha
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
    
    // Crear contenedor para las tarjetas
    const tarjetasContenedor = document.createElement('div');
    tarjetasContenedor.className = 'tarjetas-contenedor';
    contenedor.appendChild(tarjetasContenedor);
    
    // Filtrar tareas del día seleccionado
    const tareasDelDia = plannerItems.filter(item => 
        item.date.getDate() === fecha.getDate() &&
        item.date.getMonth() === fecha.getMonth() &&
        item.date.getFullYear() === fecha.getFullYear()
    );
    
    if (tareasDelDia.length === 0) {
        // Crear una estructura similar a cuando hay tareas
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
            
            // Añadir clase según el tipo de tarea
            if (tarea.type === 'task') tareaEl.classList.add('tarea-normal');
            else if (tarea.type === 'appointment') tareaEl.classList.add('tarea-cita');
            else tareaEl.classList.add('tarea-objetivo');
            
            // Si es importante, añadir clase
            if (tarea.important) tareaEl.classList.add('tarea-importante');
            
            // Crear tarjeta con los datos de la tarea
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
    // Eventos de navegación del calendario
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

    // Inicializar
    renderCalendar(); // Renderizar el calendario al cargar
    mostrarTareasDelDia(selectedDate); // Mostrar tareas del día actual
    // Cargar tareas del planificador
    loadPlannerItems(); // Cargar las tareas al iniciar
    initTrabajosRecientes(); // Inicializar trabajos recientes
});