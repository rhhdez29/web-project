document.addEventListener('DOMContentLoaded', function () {
    const calendarDaysEl = document.getElementById('calendar-days');
    const currentMonthEl = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = new Date(currentDate);

    renderCalendar();

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

    function renderCalendar() {
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        calendarDaysEl.innerHTML = '';

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        // Días del mes anterior
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            const dayEl = createCalendarDay(daysInPrevMonth - i, true);
            calendarDaysEl.appendChild(dayEl);
        }

        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const isToday = isSameDay(date, new Date());
            const isSelected = isSameDay(date, selectedDate);

            const dayEl = createCalendarDay(day, false, isToday, isSelected);
            dayEl.addEventListener('click', () => {
                const prevSelected = document.querySelector('.calendar-day.selected');
                if (prevSelected) prevSelected.classList.remove('selected');
            
                dayEl.classList.add('selected');
                selectedDate = date;
            
                mostrarTareasDelDia(date);
            });

            calendarDaysEl.appendChild(dayEl);
        }

        // Días del mes siguiente para completar las 6 filas
        const totalDaysShown = adjustedFirstDay + daysInMonth;
        const daysFromNextMonth = 42 - totalDaysShown;

        for (let day = 1; day <= daysFromNextMonth; day++) {
            const dayEl = createCalendarDay(day, true);
            calendarDaysEl.appendChild(dayEl);
        }
    }

    function createCalendarDay(day, isInactive, isToday = false, isSelected = false) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('calendar-day');
        dayEl.textContent = day;

        if (isInactive) dayEl.classList.add('inactive');
        if (isToday) dayEl.classList.add('today');
        if (isSelected) dayEl.classList.add('selected');

        return dayEl;
    }

    function isSameDay(d1, d2) {
        return d1.getDate() === d2.getDate() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getFullYear() === d2.getFullYear();
    }

    const tareas = [
        { titulo: "Estudiar para el examen", fecha: "2025-04-29", descripcion: "Repasar capítulos 3 y 4" },
        { titulo: "Reunión con equipo", fecha: "2025-04-29", descripcion: "Zoom a las 5 PM" },
        { titulo: "Ir al gimnasio", fecha: "2025-04-30", descripcion: "Entrenamiento de pierna" }
    ];

    function mostrarTareasDelDia(fecha) {
        const contenedor = document.getElementById('contenedor-tareas');
        contenedor.innerHTML = ''; // Limpiar
    
        const fechaStr = fecha.toISOString().split('T')[0];
    
        const tareasDelDia = tareas.filter(t => t.fecha === fechaStr);
    
        if (tareasDelDia.length === 0) {
            contenedor.innerHTML = `<div class="tarea"><strong>No hay actividades para hoy.</strong></div>`;
        } else {
            tareasDelDia.forEach(t => {
                const tareaEl = document.createElement('div');
                tareaEl.classList.add('tarea');
                tareaEl.innerHTML = `<p>${t.fecha}</p><strong>${t.titulo}</strong><p>${t.descripcion}</p>`;
                contenedor.appendChild(tareaEl);
            });
        }
    }
    
  
});
