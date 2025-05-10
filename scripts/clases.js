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
    
    // Crear modal de edición dinámicamente
    const editModal = document.createElement('div');
    editModal.id = 'edit-modal';
    editModal.className = 'modal';
    editModal.innerHTML = `
        <div class="modal-content">
            <h3>Editar Clase</h3>
            <form id="edit-class-form">
                <div class="form-group">
                    <label for="edit-nombre">Nombre de la clase</label>
                    <input type="text" id="edit-nombre" required>
                </div>
                <div class="form-group">
                    <label for="edit-horario">Horario</label>
                    <input type="text" id="edit-horario" required>
                </div>
                <div class="form-group">
                    <label for="edit-lugar">Lugar</label>
                    <input type="text" id="edit-lugar" required>
                </div>
                <div class="form-group">
                    <label for="edit-instructor">Instructor</label>
                    <input type="text" id="edit-instructor" required>
                </div>
                <div class="form-group">
                    <label for="edit-contacto">Contacto</label>
                    <input type="text" id="edit-contacto" required>
                </div>
                <div class="form-group">
                    <label for="edit-asesoria">Asesoría</label>
                    <input type="text" id="edit-asesoria" required>
                </div>
                <div class="form-group">
                    <label>Imagen</label>
                    <div id="edit-image-preview" class="image-preview">
                        <i class='bx bx-image-add'></i>
                        <span>Haz clic para seleccionar una imagen</span>
                    </div>
                    <input type="file" id="edit-class-image" accept="image/*" style="display: none;">
                    <button type="button" id="remove-image-btn" class="btn-secondary" style="margin-top: 0.5rem; display: none;">
                        <i class='bx bx-trash'></i> Eliminar imagen
                    </button>
                </div>
                <div class="modal-actions">
                    <button type="button" id="cancel-edit-btn" class="btn-secondary">Cancelar</button>
                    <button type="submit" id="confirm-edit-btn" class="btn-primary">Guardar cambios</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(editModal);
    
    // Referencias a elementos del modal de edición
    const editImagePreview = document.getElementById('edit-image-preview');
    const editImageInput = document.getElementById('edit-class-image');
    const editForm = document.getElementById('edit-class-form');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const removeImageBtn = document.getElementById('remove-image-btn');
    
    let currentClassId = null;
    let classes = JSON.parse(localStorage.getItem('userClasses')) || [];
    let base64Image = null;
    let editBase64Image = null;
    
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
            
            document.querySelectorAll('.course-card').forEach(card => {
                card.addEventListener('click', () => {
                    const classId = card.getAttribute('data-id');
                    showClassDetail(classId);
                });
            });
        }
    };
    
    // Manejar la previsualización de la imagen (formulario de añadir)
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
    
    // Click en el área de previsualización para abrir el selector de archivos (añadir)
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
        
        classes.push(classData);
        localStorage.setItem('userClasses', JSON.stringify(classes));
        
        // Notificar al menú principal para actualizar
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
            classes = classes.filter(c => c.id !== currentClassId);
            localStorage.setItem('userClasses', JSON.stringify(classes));
            
            // Notificar al padre para actualizar el menú
            window.parent.postMessage({
                type: 'updateMenu'
            }, '*');
            
            // Cerrar modal y volver a la vista de cursos
            deleteModal.classList.remove('active');
            setActiveSection(coursesView);
            renderClasses();
        }
    });
    
    // Función para abrir el modal de edición
    const openEditModal = () => {
        if (!currentClassId) return;
        
        const classData = classes.find(c => c.id === currentClassId);
        if (!classData) return;
        
        // Resetear la imagen de edición
        editBase64Image = null;
        editImageInput.value = '';
        
        // Rellenar el formulario con los datos actuales
        document.getElementById('edit-nombre').value = classData.nombre;
        document.getElementById('edit-horario').value = classData.horario;
        document.getElementById('edit-lugar').value = classData.lugar;
        document.getElementById('edit-instructor').value = classData.instructor;
        document.getElementById('edit-contacto').value = classData.contacto;
        document.getElementById('edit-asesoria').value = classData.asesoria;
        
        // Manejar la imagen
        editImagePreview.style.backgroundImage = '';
        editImagePreview.classList.remove('has-image');
        removeImageBtn.style.display = 'none';
        
        if (classData.imagen) {
            editImagePreview.style.backgroundImage = `url(${classData.imagen})`;
            editImagePreview.classList.add('has-image');
            editBase64Image = classData.imagen;
            removeImageBtn.style.display = 'block';
        }
        
        // Mostrar el modal
        editModal.classList.add('active');
    };
    
    // Manejar la previsualización de la imagen en el modal de edición
    editImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                editBase64Image = event.target.result;
                editImagePreview.style.backgroundImage = `url(${editBase64Image})`;
                editImagePreview.classList.add('has-image');
                removeImageBtn.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Click en el área de previsualización para abrir el selector de archivos (edición)
    editImagePreview.addEventListener('click', () => {
        editImageInput.click();
    });
    
    // Manejar el botón para eliminar imagen
    removeImageBtn.addEventListener('click', () => {
        editImagePreview.style.backgroundImage = '';
        editImagePreview.classList.remove('has-image');
        editBase64Image = null;
        editImageInput.value = '';
        removeImageBtn.style.display = 'none';
    });
    
    // Manejar el envío del formulario de edición
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!currentClassId) return;
        
        const classIndex = classes.findIndex(c => c.id === currentClassId);
        if (classIndex === -1) return;
        
        // Determinar qué imagen usar
        let imagenActualizada;
        if (editBase64Image !== null) {
            imagenActualizada = editBase64Image;
        } else if (editImagePreview.classList.contains('has-image')) {
            imagenActualizada = classes[classIndex].imagen;
        } else {
            imagenActualizada = null;
        }
        
        // Actualizar los datos de la clase
        classes[classIndex] = {
            id: currentClassId,
            nombre: document.getElementById('edit-nombre').value,
            horario: document.getElementById('edit-horario').value,
            lugar: document.getElementById('edit-lugar').value,
            instructor: document.getElementById('edit-instructor').value,
            contacto: document.getElementById('edit-contacto').value,
            asesoria: document.getElementById('edit-asesoria').value,
            imagen: imagenActualizada
        };
        
        // Guardar en localStorage
        localStorage.setItem('userClasses', JSON.stringify(classes));
        
        // Notificar al padre para actualizar el menú
        window.parent.postMessage({
            type: 'updateMenu'
        }, '*');
        
        // Cerrar el modal y actualizar la vista
        editModal.classList.remove('active');
        showClassDetail(currentClassId);
    });
    
    // Manejar el botón de cancelar en el modal de edición
    cancelEditBtn.addEventListener('click', () => {
        editModal.classList.remove('active');
    });
    
    // Manejar el botón de editar
    editClassBtn.addEventListener('click', openEditModal);
    
    // Escuchar mensajes del iframe padre
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'showAddForm') {
            showAddForm();
        }
        if (event.data && event.data.type === 'loadClass') {
            const classId = event.data.classId;
            showClassDetail(classId);
        }
    });
    
    // Inicializar
    renderClasses();
});
