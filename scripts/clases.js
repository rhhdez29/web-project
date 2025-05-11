document.addEventListener('DOMContentLoaded', () => {
    // Vistas principales
    const coursesView = document.getElementById('courses-view');
    const addFormView = document.getElementById('add-form-view');
    const classDetailView = document.getElementById('class-detail-view');

    // Contenedores y elementos de la lista de cursos
    const coursesContainer = document.getElementById('courses-container');
    const mainAddClassBtn = document.getElementById('add-class-btn'); // Botón principal en la vista de lista

    // Elementos del formulario de añadir/editar
    const classForm = document.getElementById('add-class-form');
    const formTitle = addFormView.querySelector('h2'); // Título del formulario (ej. "Añadir..." o "Editar...")
    const courseIdInput = document.createElement('input'); // Se creará un input oculto para el ID si es necesario
    courseIdInput.type = 'hidden';
    courseIdInput.name = 'id';
    if (classForm) classForm.prepend(courseIdInput); // Añadir al inicio del formulario

    const imageNameInput = document.getElementById('class-image'); // Input file
    const imagePreview = document.getElementById('image-preview');
    const cancelFormBtn = document.getElementById('cancel-form-btn');
    const closeFormIconBtn = document.getElementById('close-form-btn'); // Icono 'x'

    // Elementos de la vista de detalle
    const classDetailContent = document.getElementById('class-detail-content');
    const backToCoursesBtn = document.getElementById('back-to-courses-btn');
    const editClassDetailBtn = document.getElementById('edit-class-btn'); // Botón editar en vista detalle
    const deleteClassDetailBtn = document.getElementById('delete-class-btn'); // Botón borrar en vista detalle

    // Elementos del modal de eliminación
    const deleteModal = document.getElementById('delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    let currentEditingClassId = null;
    let imageBase64 = null;
    let classToDeleteId = null;
    let allCoursesData = []; // Para almacenar los datos de los cursos y usarlos en detalles/edición

    // --- FUNCIONES DE NAVEGACIÓN ENTRE VISTAS ---
    const showView = (viewToShow) => {
        [coursesView, addFormView, classDetailView].forEach(view => {
            if (view) view.classList.remove('active');
        });
        if (viewToShow) viewToShow.classList.add('active');
    };

    // --- FUNCIONES DE INTERACCIÓN CON EL BACKEND ---
    const apiCall = async (action, method = 'GET', body = null) => {
        const url = `../includes/cursos_controller.php${method === 'GET' && action ? `?action=${action}` : ''}`;
        const options = {
            method: method,
            headers: { 'Accept': 'application/json' }
        };
        if (method === 'POST') {
            // Si el body es FormData, no se establece Content-Type, el navegador lo hace.
            // Si es un objeto JS, se convierte a JSON.
            if (body instanceof FormData) {
                if (action && !body.has('action')) body.append('action', action);
                options.body = body;
            } else if (body) {
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify({ action, ...body });
            } else if (action) { // Para POST sin body pero con action en el cuerpo
                 const formData = new FormData();
                 formData.append('action', action);
                 options.body = formData;
            }
        }

        try {
            const response = await fetch(url, options);
            const responseData = await response.json().catch(() => ({ // Intenta parsear JSON, si falla, crea un objeto de error
                success: false, 
                message: `Respuesta no válida del servidor. Estado: ${response.status}`
            }));

            if (!response.ok) {
                throw new Error(responseData.message || `Error ${response.status} del servidor.`);
            }
            if (!responseData.success) {
                throw new Error(responseData.message || 'La operación falló sin un mensaje específico.');
            }
            return responseData;
        } catch (error) {
            console.error(`Error en apiCall (action: ${action}):`, error);
            alert(`Error: ${error.message}`);
            throw error; // Re-lanzar para que la función que llama pueda manejarlo si es necesario
        }
    };

    const fetchCourses = async () => {
        try {
            const result = await apiCall('obtenerCursos', 'GET');
            allCoursesData = result.data || [];
            renderCourses(allCoursesData);
        } catch (error) {
            if(coursesContainer) coursesContainer.innerHTML = `<div class="empty-state"><p>No se pudieron cargar los cursos. ${error.message}</p></div>`;
        }
    };

    const saveCourse = async (event) => {
        event.preventDefault();
        if (!classForm) return;

        const formData = new FormData(classForm);
        const action = currentEditingClassId ? 'actualizarCurso' : 'crearCurso';

        // El ID para 'crearCurso' se genera aquí si no está ya en el formulario (ej. campo oculto)
        // El backend espera un 'id' generado por JS para 'crearCurso'
        if (!currentEditingClassId && !formData.get('id')) {
            formData.set('id', generateUniqueId()); // Usar set para asegurar que esté, o reemplazar si estaba vacío
        } else if (currentEditingClassId) {
            formData.set('id', currentEditingClassId); // Asegurar que el ID de edición esté
        }
        
        if (imageBase64) {
            formData.append('imagen', imageBase64);
        } else if (!currentEditingClassId) {
            // Para creación, si la imagen es obligatoria y no hay imageBase64, el backend debería fallar.
            // Podríamos añadir una validación aquí o una imagen placeholder en base64.
            // Por ahora, si el backend la requiere, fallará allí.
            // Si el campo imagen es opcional en el backend, esto está bien.
            // El controller actual la marca como obligatoria.
            alert("Por favor, selecciona una imagen para el curso.");
            return; // Detener si la imagen es obligatoria y no está
        }
        // Si se está editando y no se cambió la imagen, imageBase64 podría tener la original
        // o ser null si la original no se cargó. El backend debe manejar si 'imagen' no se envía en actualización.
        // El controller actual la marca como obligatoria también para actualizar.

        try {
            const result = await apiCall(action, 'POST', formData);
            alert(result.message || 'Curso guardado exitosamente.');
            fetchCourses();
            closeAndResetForm();
        } catch (error) {
            // El error ya se muestra por apiCall, aquí podríamos hacer algo más si es necesario
        }
    };

    const handleDeleteCourse = async () => {
        if (!classToDeleteId) return;
        try {
            const formData = new FormData();
            formData.append('id', classToDeleteId);
            const result = await apiCall('eliminarCurso', 'POST', formData);
            alert(result.message || 'Curso eliminado exitosamente.');
            fetchCourses();
            closeDeleteModal();
            showView(coursesView); // Volver a la lista de cursos
        } catch (error) {
            // El error ya se muestra
        }
    };

    // --- FUNCIONES DE RENDERIZADO Y UI ---
    const generateUniqueId = () => `curso_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const renderCourses = (courses = []) => {
        if (!coursesContainer) return;
        coursesContainer.innerHTML = '';

        if (courses.length === 0) {
            coursesContainer.innerHTML = `
                <div class="empty-state">
                    <img src="../assets/imagenes/empty-courses.svg" alt="No hay cursos">
                    <p>Aún no has creado ninguna clase.</p>
                    <button id="empty-add-class-btn" class="btn-secondary">Añadir una clase</button>
                </div>`;
            const emptyBtn = document.getElementById('empty-add-class-btn');
            if (emptyBtn) emptyBtn.addEventListener('click', openAddForm);
            return;
        }

        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';
            card.dataset.id = course.id;
            // Asumiendo que el backend envía 'asesoria' si se implementa
            const asesoriaHTML = course.asesoria ? `<p class="course-detail"><i class='bx bx-help-circle'></i> Asesoría: ${course.asesoria}</p>` : '';

            card.innerHTML = `
                <div class="course-image" style="background-image: url('${course.imagen || '../assets/imagenes/default-image.png'}');"></div>
                <div class="course-content">
                    <h3 class="course-title">${course.nombre}</h3>
                    <div class="course-details">
                        <p class="course-detail"><i class='bx bx-time-five'></i> Horario: ${course.horario || 'N/A'}</p>
                        <p class="course-detail"><i class='bx bx-map'></i> Lugar: ${course.lugar || 'N/A'}</p>
                        <p class="course-detail"><i class='bx bx-user'></i> Instructor: ${course.instructor || 'N/A'}</p>
                        <p class="course-detail"><i class='bx bx-phone'></i> Contacto: ${course.contacto || 'N/A'}</p>
                        ${asesoriaHTML}
                    </div>
                </div>`;
            // No se añaden botones de editar/eliminar aquí, se manejan en la vista de detalle.
            // El card completo es clickeable para ver detalles.
            card.addEventListener('click', () => openDetailView(course.id));
            coursesContainer.appendChild(card);
        });
    };
    
    const renderClassDetail = (courseId) => {
        const course = allCoursesData.find(c => c.id === courseId);
        if (!course || !classDetailContent) return;

        // Asumiendo que el backend envía 'asesoria' si se implementa
        const asesoriaDetailHTML = course.asesoria ? `
            <div class="detail-item">
                <div class="detail-icon"><i class='bx bx-help-circle'></i></div>
                <div class="detail-content-inner">
                    <h4>Asesoría</h4>
                    <p>${course.asesoria}</p>
                </div>
            </div>` : '';
        
        classDetailContent.innerHTML = `
            <div class="detail-banner ${course.imagen ? '' : 'no-image'}" style="background-image: url('${course.imagen || ''}');">
            </div>
            <div class="class-info">
                <div class="title-container">
                     <h2 class="class-title">${course.nombre}</h2>
                     <span class="course-code" title="Copiar clave del curso">${course.id} <i class='bx bx-copy copy-icon'></i></span>
                </div>
                <div class="welcome-message">
                    <p>Bienvenido a los detalles del curso. Aquí puedes ver toda la información relevante.</p>
                </div>
                <div class="class-details">
                    <div class="detail-item">
                        <div class="detail-icon"><i class='bx bx-time-five'></i></div>
                        <div class="detail-content-inner">
                            <h4>Horario</h4>
                            <p>${course.horario || 'No especificado'}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon"><i class='bx bx-map'></i></div>
                        <div class="detail-content-inner">
                            <h4>Lugar</h4>
                            <p>${course.lugar || 'No especificado'}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon"><i class='bx bx-user'></i></div>
                        <div class="detail-content-inner">
                            <h4>Instructor</h4>
                            <p>${course.instructor || 'No especificado'}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon"><i class='bx bx-phone'></i></div>
                        <div class="detail-content-inner">
                            <h4>Contacto</h4>
                            <p>${course.contacto || 'No especificado'}</p>
                        </div>
                    </div>
                    ${asesoriaDetailHTML}
                </div>
            </div>`;

        // Funcionalidad de copiar clave
        const courseCodeElement = classDetailContent.querySelector('.course-code');
        if (courseCodeElement) {
            courseCodeElement.addEventListener('click', () => {
                navigator.clipboard.writeText(course.id).then(() => {
                    courseCodeElement.classList.add('copied');
                    const originalText = courseCodeElement.innerHTML;
                    courseCodeElement.innerHTML = `${course.id} <i class='bx bx-check copy-icon'></i> Copiado!`;
                    setTimeout(() => {
                        courseCodeElement.innerHTML = originalText;
                        courseCodeElement.classList.remove('copied');
                    }, 1500);
                }).catch(err => console.error('Error al copiar: ', err));
            });
        }

        // Asignar IDs a los botones de la vista de detalle para los listeners
        if (editClassDetailBtn) editClassDetailBtn.dataset.id = course.id;
        if (deleteClassDetailBtn) deleteClassDetailBtn.dataset.id = course.id;
    };

    const resetForm = () => {
        if (classForm) classForm.reset();
        if (imagePreview) {
            imagePreview.style.backgroundImage = 'none';
            imagePreview.classList.remove('has-image');
            imagePreview.querySelector('i').style.display = 'block';
            imagePreview.querySelector('span').style.display = 'block';
        }
        if (imageNameInput) imageNameInput.value = ''; // Limpiar el input file
        imageBase64 = null;
        currentEditingClassId = null;
        courseIdInput.value = ''; // Limpiar el ID oculto
        if (formTitle) formTitle.textContent = 'Añadir una nueva clase';
    };

    const populateFormForEdit = (courseId) => {
        const course = allCoursesData.find(c => c.id === courseId);
        if (!course || !classForm) return;

        resetForm(); // Limpiar primero
        currentEditingClassId = course.id;
        courseIdInput.value = course.id; // Establecer el ID en el campo oculto

        classForm.querySelector('[name="nombre"]').value = course.nombre || '';
        classForm.querySelector('[name="horario"]').value = course.horario || '';
        classForm.querySelector('[name="lugar"]').value = course.lugar || '';
        classForm.querySelector('[name="instructor"]').value = course.instructor || '';
        classForm.querySelector('[name="contacto"]').value = course.contacto || '';
        // Asumiendo que el backend envía 'asesoria' si se implementa
        if (classForm.querySelector('[name="asesoria"]')) {
            classForm.querySelector('[name="asesoria"]').value = course.asesoria || '';
        }

        if (course.imagen && imagePreview) {
            imagePreview.style.backgroundImage = `url('${course.imagen}')`;
            imagePreview.classList.add('has-image');
            imagePreview.querySelector('i').style.display = 'none';
            imagePreview.querySelector('span').style.display = 'none';
            imageBase64 = course.imagen; // Guardar la imagen existente (Base64)
        }
        
        if (formTitle) formTitle.textContent = 'Editar Clase';
        showView(addFormView);
    };

    // --- MANEJO DE EVENTOS ---
    if (imagePreview && imageNameInput) {
        imagePreview.addEventListener('click', () => imageNameInput.click());
        imageNameInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (imagePreview) {
                        imagePreview.style.backgroundImage = `url('${e.target.result}')`;
                        imagePreview.classList.add('has-image');
                        imagePreview.querySelector('i').style.display = 'none';
                        imagePreview.querySelector('span').style.display = 'none';
                    }
                    imageBase64 = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    const openAddForm = () => {
        resetForm();
        showView(addFormView);
    };
    const closeAndResetForm = () => {
        resetForm();
        showView(coursesView);
    };

    if (mainAddClassBtn) mainAddClassBtn.addEventListener('click', openAddForm);
    if (classForm) classForm.addEventListener('submit', saveCourse);
    if (cancelFormBtn) cancelFormBtn.addEventListener('click', closeAndResetForm);
    if (closeFormIconBtn) closeFormIconBtn.addEventListener('click', closeAndResetForm);

    const openDetailView = (courseId) => {
        renderClassDetail(courseId);
        showView(classDetailView);
    };

    if (backToCoursesBtn) {
        backToCoursesBtn.addEventListener('click', () => showView(coursesView));
    }
    if (editClassDetailBtn) {
        editClassDetailBtn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            if (id) populateFormForEdit(id);
        });
    }
    if (deleteClassDetailBtn) {
        deleteClassDetailBtn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            if (id) openDeleteModal(id);
        });
    }
    
    const openDeleteModal = (courseId) => {
        classToDeleteId = courseId;
        if (deleteModal) deleteModal.classList.add('active');
    };
    const closeDeleteModal = () => {
        classToDeleteId = null;
        if (deleteModal) deleteModal.classList.remove('active');
    };

    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', handleDeleteCourse);


    // --- INICIALIZACIÓN ---
    fetchCourses();
    showView(coursesView); // Asegurar que la vista inicial sea la lista de cursos
});