document.addEventListener('DOMContentLoaded', () => {
    const coursesView = document.getElementById('courses-view');
    const coursesContainer = document.getElementById('courses-container');
    
    let classes = JSON.parse(localStorage.getItem('userClasses')) || [];

    // Renderizar la lista de clases
    const renderClasses = () => {
        coursesContainer.innerHTML = '';

        if (classes.length === 0) {
            coursesContainer.innerHTML = `
                <div class="empty-state">
                    <img src="../assets/imagenes/empty-courses.svg" alt="No hay cursos">
                    <p>No tienes cursos actualmente</p>
                </div>
            `;
        } else {
            classes.forEach(classData => {
                const classCard = document.createElement('div');
                classCard.className = 'course-card';
                classCard.innerHTML = `
                    <div class="course-image" style="background-image: url(${classData.imagen || '../assets/imagenes/default-image.png'});"></div>
                    <div class="course-content">
                        <h3 class="course-title">${classData.nombre}</h3>
                        <p class="course-details">Horario: ${classData.horario}</p>
                        <p class="course-details">Lugar: ${classData.lugar}</p>
                        <p class="course-details">Instructor: ${classData.instructor}</p>
                        <p class="course-details">Contacto: ${classData.contacto}</p>
                        <p class="course-details">Asesoría: ${classData.asesoria}</p>
                    </div>
                `;
                coursesContainer.appendChild(classCard);
            });
        }
    };

    // Inicializar
    renderClasses();
});