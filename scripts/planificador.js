document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const calendarDaysEl = document.getElementById('calendar-days');
    const currentMonthEl = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const weeklyGridEl = document.getElementById('weekly-grid');
    const weeklyTitleEl = document.getElementById('weekly-title');
    const weeklyGoalEl = document.getElementById('weekly-goal');
    const importantRemindersListEl = document.getElementById('important-reminders-list');
    const addItemBtn = document.getElementById('add-item-btn');
    const addModal = document.getElementById('add-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const addItemForm = document.getElementById('add-item-form');
    const itemDateInput = document.getElementById('item-date');
    const itemTypeSelect = document.getElementById('item-type');

    // State variables
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = new Date(currentDate);
    let selectedWeekStart = getWeekStart(selectedDate);
    
    // Initialize empty planner items array
    let plannerItems = [];

    // Initialize
    renderCalendar();
    renderWeeklyView();
    renderImportantReminders();

    // Clean up expired items every minute
    setInterval(cleanupExpiredItems, 60000);

    // Event listeners
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

    addItemBtn.addEventListener('click', () => {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        itemDateInput.value = `${year}-${month}-${day}`;
        addModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        addModal.classList.remove('active');
    });

    cancelBtn.addEventListener('click', () => {
        addModal.classList.remove('active');
    });

    itemTypeSelect.addEventListener('change', (e) => {
        const timeInput = document.getElementById('item-time');
        const importantCheck = document.getElementById('item-important');
        
        if (e.target.value === 'appointment') {
            timeInput.required = true;
            timeInput.parentElement.style.display = 'flex';
            importantCheck.parentElement.style.display = 'flex';
        } else if (e.target.value === 'goal') {
            timeInput.required = false;
            timeInput.parentElement.style.display = 'none';
            importantCheck.parentElement.style.display = 'none';
        } else {
            timeInput.required = false;
            timeInput.parentElement.style.display = 'flex';
            importantCheck.parentElement.style.display = 'flex';
        }
    });

    addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('item-title').value;
        const type = document.getElementById('item-type').value;
        const dateStr = document.getElementById('item-date').value;
        const time = document.getElementById('item-time').value;
        const description = document.getElementById('item-description').value;
        const important = document.getElementById('item-important').checked;
        
        const [year, month, day] = dateStr.split('-');
        const date = new Date(year, month - 1, day);
        
        const newItem = {
            id: Date.now(),
            title,
            type,
            date,
            time,
            description,
            important
        };
        
        plannerItems.push(newItem);
        
        addModal.classList.remove('active');
        addItemForm.reset();
        
        renderCalendar();
        renderWeeklyView();
        renderImportantReminders();
    });

    // Helper functions
    function getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    function formatDate(date) {
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return date.toLocaleDateString('es-ES', options);
    }

    function cleanupExpiredItems() {
        const now = new Date();
        plannerItems = plannerItems.filter(item => {
            if (item.type === 'appointment') {
                const itemDateTime = new Date(item.date);
                if (item.time) {
                    const [hours, minutes] = item.time.split(':');
                    itemDateTime.setHours(parseInt(hours), parseInt(minutes));
                }
                return itemDateTime > now;
            }
            return true;
        });
        renderCalendar();
        renderWeeklyView();
        renderImportantReminders();
    }

    function renderCalendar() {
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        calendarDaysEl.innerHTML = '';
        
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            const dayEl = createCalendarDay(daysInPrevMonth - i, true);
            calendarDaysEl.appendChild(dayEl);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const isToday = isDateToday(date);
            const isSelected = isDateSelected(date);
            const hasItems = doesDateHaveItems(date);
            
            const dayEl = createCalendarDay(day, false, isToday, isSelected, hasItems);
            
            dayEl.addEventListener('click', () => {
                const prevSelected = document.querySelector('.calendar-day.selected');
                if (prevSelected) {
                    prevSelected.classList.remove('selected');
                }
                
                dayEl.classList.add('selected');
                selectedDate = date;
                selectedWeekStart = getWeekStart(date);
                
                renderWeeklyView();
            });
            
            calendarDaysEl.appendChild(dayEl);
        }
        
        const totalDaysShown = adjustedFirstDay + daysInMonth;
        const daysFromNextMonth = 42 - totalDaysShown;
        
        for (let day = 1; day <= daysFromNextMonth; day++) {
            const dayEl = createCalendarDay(day, true);
            calendarDaysEl.appendChild(dayEl);
        }
    }

    function createCalendarDay(day, isInactive, isToday = false, isSelected = false, hasItems = false) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('calendar-day');
        dayEl.textContent = day;
        
        if (isInactive) dayEl.classList.add('inactive');
        if (isToday) dayEl.classList.add('today');
        if (isSelected) dayEl.classList.add('selected');
        if (hasItems) dayEl.classList.add('has-items');
        
        return dayEl;
    }

    function renderWeeklyView() {
        weeklyGridEl.innerHTML = '';
        weeklyTitleEl.textContent = `Semana del ${formatDate(selectedWeekStart)}`;
        
        // Render weekly goal
        const weeklyGoal = plannerItems.find(item => 
            item.type === 'goal' && 
            isInSameWeek(item.date, selectedWeekStart)
        );
        
        weeklyGoalEl.innerHTML = weeklyGoal 
            ? `<p>${weeklyGoal.title}</p><small>${weeklyGoal.description}</small>`
            : '<p class="text-muted">No hay objetivo definido para esta semana</p>';

        // Render daily cards
        for (let i = 0; i < 7; i++) {
            const date = new Date(selectedWeekStart);
            date.setDate(date.getDate() + i);
            
            const dayItems = plannerItems.filter(item => 
                item.type !== 'goal' && 
                isSameDay(item.date, date)
            );
            
            const tasks = dayItems.filter(item => item.type === 'task');
            const appointments = dayItems.filter(item => item.type === 'appointment');
            
            const dayCard = createDayCard(date, tasks, appointments);
            weeklyGridEl.appendChild(dayCard);
        }
    }

    function createDayCard(date, tasks, appointments) {
        const dayCard = document.createElement('div');
        dayCard.classList.add('day-card');
        
        const header = document.createElement('div');
        header.classList.add('day-card-header');
        header.innerHTML = `
            <h3>${formatDate(date)}</h3>
            <span>${tasks.length + appointments.length} items</span>
        `;
        
        const content = document.createElement('div');
        content.classList.add('day-card-content');
        
        // Tasks section
        const tasksSection = document.createElement('div');
        tasksSection.classList.add('tasks-section');
        tasksSection.innerHTML = `
            <div class="section-title">
                <i class='bx bx-task'></i> Tareas
            </div>
            <div class="tasks-list">
                ${tasks.map(task => `
                    <div class="task-item">
                        <div class="task-checkbox" data-id="${task.id}"></div>
                        <div class="task-content" onclick="showTaskDescription(${task.id})">
                            <span class="task-title">${task.title}</span>
                            ${task.description ? `<div class="task-description" style="display: none;">${task.description}</div>` : ''}
                        </div>
                    </div>
                `).join('') || '<p class="no-items">Sin tareas</p>'}
            </div>
        `;
        
        // Appointments section
        const appointmentsSection = document.createElement('div');
        appointmentsSection.classList.add('appointments-section');
        appointmentsSection.innerHTML = `
            <div class="section-title">
                <i class='bx bx-calendar-event'></i> Citas
            </div>
            <div class="appointments-list">
                ${appointments.map(apt => `
                    <div class="appointment-item">
                        <span>${apt.title}</span>
                        <span class="appointment-time">${apt.time}</span>
                    </div>
                `).join('') || '<p class="no-items">Sin citas</p>'}
            </div>
        `;
        
        content.appendChild(tasksSection);
        content.appendChild(appointmentsSection);
        
        dayCard.appendChild(header);
        dayCard.appendChild(content);

        // Add click handlers for checkboxes
        const checkboxes = dayCard.querySelectorAll('.task-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                const taskId = parseInt(e.target.dataset.id);
                completeTask(taskId);
            });
        });
        
        return dayCard;
    }

    function renderImportantReminders() {
        const importantItems = plannerItems.filter(item => 
            item.important && 
            item.date >= new Date()
        ).sort((a, b) => a.date - b.date);
        
        importantRemindersListEl.innerHTML = importantItems.length 
            ? importantItems.map(item => `
                <div class="reminder-item">
                    <div class="title">${item.title}</div>
                    <div class="date">${formatDate(item.date)}${item.time ? ` - ${item.time}` : ''}</div>
                </div>
            `).join('')
            : '<p class="no-items">No hay recordatorios importantes</p>';
    }

    // Utility functions
    function isDateToday(date) {
        const today = new Date();
        return isSameDay(date, today);
    }

    function isDateSelected(date) {
        return isSameDay(date, selectedDate);
    }

    function isSameDay(d1, d2) {
        return d1.getDate() === d2.getDate() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getFullYear() === d2.getFullYear();
    }

    function isInSameWeek(d1, d2) {
        const week1 = getWeekStart(d1);
        const week2 = getWeekStart(d2);
        return isSameDay(week1, week2);
    }

    function doesDateHaveItems(date) {
        return plannerItems.some(item => isSameDay(item.date, date));
    }

    // Task completion handler
    function completeTask(taskId) {
        plannerItems = plannerItems.filter(item => item.id !== taskId);
        renderCalendar();
        renderWeeklyView();
        renderImportantReminders();
    }

    // Make functions available globally
    window.showTaskDescription = function(taskId) {
        const task = plannerItems.find(item => item.id === taskId);
        if (task && task.description) {
            const descEl = document.querySelector(`.task-content[onclick="showTaskDescription(${taskId})"] .task-description`);
            if (descEl) {
                descEl.style.display = descEl.style.display === 'none' ? 'block' : 'none';
            }
        }
    };
});