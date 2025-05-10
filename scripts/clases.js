document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos DOM
    const coursesView = document.getElementById('courses-view');
    const addFormView = document.getElementById('add-form-view');
    const classDetailView = document.getElementById('class-detail-view');
    const addClassBtn = document.getElementById('add-class-btn');
    const emptyAddClassBtn = document.getElementById('empty-add-class-btn');
    const closeFormBtn = document.getElementById('close-form-btn');
    const cancelFormBtn = document.getElementById('cancel-form-btn');
    const addClassForm = document.getElementById('add-class-form');
    const imageInput = document.getElementById('class-image');
    const imagePreview = document.getElementById('image-preview');
    const coursesContainer = document.getElementById('courses-container');
    const backToCoursesBtn = document.getElementById('back-to-courses-btn');
    const classDetailContent = document.getElementById('class-detail-content');
    const deleteClassBtn = document.getElementById('delete-class-btn');
    const editClassBtn = document.getElementById('edit-class-btn');
    const deleteModal = document.getElementById('delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    
    let currentClassId = null;
    let classes = JSON.parse(localStorage.getItem('userClasses')) || [];
    let base64Image = null;
    
    // Función para generar ID único
    const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };
    
    // Mostrar el formulario de añadir clase
    const showAddForm = () => {
        setActiveSection(addFormView);
        addClassForm.reset();
        imagePreview.style.backgroundImage = '';
        imagePreview.classList.remove('has-image');
        base64Image = null;
    };
    
    // Mostrar vista de detalle de clase
    const showClassDetail = (classId) => {
        currentClassId = classId;
        const classData = classes.find(c => c.id === classId);
        
        if (classData) {
            // Crear contenido de detalles
            let bannerClass = classData.imagen ? '' : 'no-image';
            let bannerStyle = classData.imagen ? `background-image: url(${classData.imagen})` : '';
            
            classDetailContent.innerHTML = `
                <div class="detail-banner ${bannerClass}" style="${bannerStyle}"></div>
                <div class="class-info">
                    <h1 class="class-title">${classData.nombre}</h1>
                    <p class="welcome-message">¡Bienvenido/a a tu clase de ${classData.nombre}!</p>
                    
                    <div class="class-details">
                        <div class="detail-item">
                            <div class="detail-icon">
                                <i class='bx bx-time'></i>
                            </div>
                            <div class="detail-content-inner">
                                <h4>Horario</h4>
                                <p>${classData.horario}</p>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-icon">
                                <i class='bx bx-map'></i>
                            </div>
                            <div class="detail-content-inner">
                                <h4>Lugar</h4>
                                <p>${classData.lugar}</p>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-icon">
                                <i class='bx bx-user'></i>
                            </div>
                            <div class="detail-content-inner">
                                <h4>Instructor</h4>
                                <p>${classData.instructor}</p>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-icon">
                                <i class='bx bx-envelope'></i>
                            </div>
                            <div class="detail-content-inner">
                                <h4>Contacto</h4>
                                <p>${classData.contacto}</p>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-icon">
                                <i class='bx bx-conversation'></i>
                            </div>
                            <div class="detail-content-inner">
                                <h4>Asesoría</h4>
                                <p>${classData.asesoria}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            setActiveSection(classDetailView);
        }
    };
    
    // Establecer la sección activa
    const setActiveSection = (section) => {
        [coursesView, addFormView, classDetailView].forEach(s => {
            s.classList.remove('active');
        });
        
        section.classList.add('active');
    };
    
    // Renderizar la lista de clases
    const renderClasses = () => {
        // Actualizar estado vacío
        if (classes.length === 0) {
            coursesContainer.innerHTML = `
                <div class="empty-state">
                    <img src="../assets/imagenes/empty-courses.svg" alt="No hay cursos">
                    <p>No tienes cursos actualmente</p>
                    <button id="empty-add-class-btn" class="btn-secondary">Añadir una clase</button>
                </div>
            `;
            
            document.getElementById('empty-add-class-btn').addEventListener('click', showAddForm);
        } else {
            let coursesHTML = '';
            
            classes.forEach(classData => {
                // Imagen por defecto si no hay imagen
                const imageUrl = classData.imagen || '../assets/imagenes/default-course.jpg';
                
                coursesHTML += `
                    <div class="course-card" data-id="${classData.id}">
                        <img src="${imageUrl}" alt="${classData.nombre}" class="course-image">
                        <div class="course-content">
                            <h3 class="course-title">${classData.nombre}</h3>
                            <div class="course-details">
                                <div class="course-detail">
                                    <i class='bx bx-time'></i>
                                    <span>${classData.horario}</span>
                                </div>
                                <div class="course-detail">
                                    <i class='bx bx-map'></i>
                                    <span>${classData.lugar}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            coursesContainer.innerHTML = coursesHTML;
            
            // Añadir eventos click a las tarjetas
            document.querySelectorAll('.course-card').forEach(card => {
                card.addEventListener('click', () => {
                    const classId = card.getAttribute('data-id');
                    showClassDetail(classId);
                });
            });
        }
    };
    
    // Manejar la previsualización de la imagen
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                base64Image = event.target.result;
                imagePreview.style.backgroundImage = `url(${base64Image})`;
                imagePreview.classList.add('has-image');
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Click en el área de previsualización para abrir el selector de archivos
    imagePreview.addEventListener('click', () => {
        imageInput.click();
    });
    
    // Manejo de eventos
    addClassBtn.addEventListener('click', showAddForm);
    closeFormBtn.addEventListener('click', () => setActiveSection(coursesView));
    cancelFormBtn.addEventListener('click', () => setActiveSection(coursesView));
    backToCoursesBtn.addEventListener('click', () => setActiveSection(coursesView));
    
    // Manejo del formulario de añadir clase
    addClassForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Recoger datos del formulario
        const classData = {
            id: generateUniqueId(),
            nombre: document.getElementById('nombre').value,
            horario: document.getElementById('horario').value,
            lugar: document.getElementById('lugar').value,
            instructor: document.getElementById('instructor').value,
            contacto: document.getElementById('contacto').value,
            asesoria: document.getElementById('asesoria').value,
            imagen: base64Image
        };
        
        // Añadir a la lista de clases
        classes.push(classData);
        localStorage.setItem('userClasses', JSON.stringify(classes));
        
        // Notificar al menú principal para añadir la clase al sidebar
        window.parent.postMessage({
            type: 'addClass',
            classData: {
                id: classData.id,
                nombre: classData.nombre
            }
        }, '*');
        
        // Volver a la vista de cursos y actualizar la lista
        setActiveSection(coursesView);
        renderClasses();
    });
    
    // Manejar eliminación de clase
    deleteClassBtn.addEventListener('click', () => {
        deleteModal.classList.add('active');
    });
    
    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.remove('active');
    });
    
    confirmDeleteBtn.addEventListener('click', () => {
        if (currentClassId) {
            // Filtrar la clase actual
            classes = classes.filter(c => c.id !== currentClassId);
            localStorage.setItem('userClasses', JSON.stringify(classes));
            
            // Cerrar modal y volver a la vista de cursos
            deleteModal.classList.remove('active');
            setActiveSection(coursesView);
            renderClasses();
            
            // Notificar al padre que la clase fue eliminada (para actualizar el menú)
            window.parent.postMessage({
                type: 'removeClass',
                classId: currentClassId
            }, '*');
        }
    });
    
    // Escuchar mensajes del iframe padre
    window.addEventListener('message', (event) => {
        // Verificar si es un mensaje para mostrar el formulario
        if (event.data && event.data.type === 'showAddForm') {
            showAddForm();
        }
        
        // Verificar si es un mensaje para cargar una clase específica
        if (event.data && event.data.type === 'loadClass') {
            const classId = event.data.classId;
            showClassDetail(classId);
        }
    });
    
    // Inicializar
    renderClasses();
});