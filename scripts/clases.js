let showOnlyEnrolled = false; // NUEVO: controla si solo se muestran cursos inscritos

document.addEventListener('DOMContentLoaded', () => {
    // Vistas principales
    const coursesView = document.getElementById('courses-view');
    const addFormView = document.getElementById('add-form-view'); // Puede ser null si es estudiante
    const classDetailView = document.getElementById('class-detail-view');

    // Contenedores y elementos de la lista de cursos
    const coursesContainer = document.getElementById('courses-container');
    const mainAddClassBtn = document.getElementById('add-class-btn'); // Puede ser null si es estudiante

    // Elementos del formulario de añadir/editar (Maestro)
    const classForm = document.getElementById('add-class-form'); // Puede ser null
    const formViewTitle = document.getElementById('form-view-title'); // Puede ser null
    const editCourseIdInput = document.getElementById('edit-course-id'); // Puede ser null
    const courseIdFormInput = document.getElementById('course_id_form'); // Puede ser null
    const classImageInput = document.getElementById('class-image-input'); // Puede ser null
    const imagePreview = document.getElementById('image-preview'); // Puede ser null
    const classImageBase64Input = document.getElementById('class-image-base64'); // Puede ser null
    const cancelFormBtn = document.getElementById('cancel-form-btn'); // Puede ser null
    const closeFormIconBtn = document.getElementById('close-form-btn'); // Puede ser null
    const formFeedback = document.getElementById('form-feedback'); // Puede ser null

    // Elementos de la vista de detalle
    const classDetailContent = document.getElementById('class-detail-content');
    const backToCoursesBtn = document.getElementById('back-to-courses-btn');
    const editClassDetailBtn = document.getElementById('edit-class-btn'); // Puede ser null
    const deleteClassDetailBtn = document.getElementById('delete-class-btn'); // Puede ser null

    // Elementos del modal de eliminación (Maestro)
    const deleteModal = document.getElementById('delete-modal'); // Puede ser null
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn'); // Puede ser null
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn'); // Puede ser null

    // Elementos específicos del Estudiante
    const enrollByCodeSection = document.getElementById('enroll-by-code-section'); // Puede ser null
    const inputEnrollCourseId = document.getElementById('input-enroll-course-id'); // Puede ser null
    const btnEnrollByCode = document.getElementById('btn-enroll-by-code'); // Puede ser null
    const enrollByCodeMessage = document.getElementById('enroll-by-code-message'); // Puede ser null

    let currentEditingClassId = null;
    let imageBase64 = null; // Para el formulario del maestro
    let classToDeleteId = null;
    let allCoursesData = [];

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
            if (body instanceof FormData) {
                if (action && !body.has('action')) body.append('action', action);
                options.body = body;
            } else if (body) {
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify({ action, ...body });
            } else if (action) {
                 const formData = new FormData();
                 formData.append('action', action);
                 options.body = formData;
            }
        }

        try {
            const response = await fetch(url, options);
            const responseData = await response.json().catch(() => ({
                success: false, 
                message: `Respuesta no válida del servidor. Estado: ${response.status}`
            }));

            if (!response.ok) {
                throw new Error(responseData.message || `Error ${response.status} del servidor.`);
            }
            // No lanzar error si !responseData.success aquí, dejar que la función que llama lo maneje
            return responseData;
        } catch (error) {
            console.error(`Error en apiCall (action: ${action}):`, error);
            alert(`Error de conexión: ${error.message}`); // Mensaje genérico para el usuario
            throw error;
        }
    };

    const fetchCourses = async () => {
    try {
        const result = await apiCall('obtenerCursos', 'GET');
        if (result.success) {
            allCoursesData = result.data || [];
            let coursesToShow = allCoursesData;
            if (showOnlyEnrolled && currentUserRole === 'Estudiante') {
                coursesToShow = allCoursesData.filter(c => c.esta_inscrito === true);
                if (enrollByCodeSection) enrollByCodeSection.style.display = 'none';
            } else {
                if (currentUserRole === 'Estudiante' && enrollByCodeSection) {
                    enrollByCodeSection.style.display = '';
                }
            }
            renderCourses(coursesToShow);
            // Mostrar el contenedor después de renderizar
            if (coursesContainer) coursesContainer.style.visibility = 'visible';
        } else {
            if(coursesContainer) coursesContainer.innerHTML = `<div class="empty-state"><p>Error al cargar cursos: ${result.message}</p></div>`;
            if (coursesContainer) coursesContainer.style.visibility = 'visible';
        }
    } catch (error) {
        if(coursesContainer) coursesContainer.innerHTML = `<div class="empty-state"><p>No se pudieron cargar los cursos. Intenta de nuevo más tarde.</p></div>`;
        if (coursesContainer) coursesContainer.style.visibility = 'visible';
    }
};

    // --- FUNCIONES DE RENDERIZADO Y UI ---
    const generateUniqueId = () => `curso_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const renderCourses = (courses = []) => {
        if (!coursesContainer) return;
        coursesContainer.innerHTML = '';

        if (courses.length === 0) {
            let emptyMessage = "No hay cursos disponibles actualmente.";
            let buttonHTML = "";
            if (currentUserRole === 'Maestro') {
                emptyMessage = "Aún no has creado ninguna clase.";
                buttonHTML = `<button id="empty-add-class-btn" class="btn-primary"><i class='bx bx-plus'></i> Añadir una clase</button>`;
            }
            coursesContainer.innerHTML = `
                <div class="empty-state">
                    <img src="../assets/imagenes/empty-courses.svg" alt="No hay cursos">
                    <p>${emptyMessage}</p>
                    ${buttonHTML}
                </div>`;
            if (currentUserRole === 'Maestro') {
                const emptyBtn = document.getElementById('empty-add-class-btn');
                if (emptyBtn) emptyBtn.addEventListener('click', openAddForm);
            }
            return;
        }

        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';
            card.dataset.id = course.id;
            
            let studentButtonsHTML = '';
            if (currentUserRole === 'Estudiante') {
                if (course.esta_inscrito) {
                    studentButtonsHTML = `<button class="btn-unenroll btn-secondary" data-id="${course.id}"><i class='bx bx-user-minus'></i> Desinscribirse</button>`;
                } else {
                    studentButtonsHTML = `<button class="btn-enroll btn-primary" data-id="${course.id}"><i class='bx bx-user-plus'></i> Inscribirse</button>`;
                }
            }

            card.innerHTML = `
                <div class="course-image" style="background-image: url('${course.imagen || '../assets/imagenes/default-image.png'}');"></div>
                <div class="course-content">
                    <h3 class="course-title">${course.nombre}</h3>
                    <div class="course-details">
                        <p class="course-detail"><i class='bx bx-id-card'></i> ID: ${course.id}</p>
                        <p class="course-detail"><i class='bx bx-user'></i> Instructor: ${course.instructor || 'N/A'}</p>
                        ${currentUserRole === 'Estudiante' ? `<div class="student-actions">${studentButtonsHTML}</div>` : ''}
                    </div>
                </div>`;
            
            card.addEventListener('click', (e) => {
                // Evitar que el click en botones de inscripción propague al card
                if (e.target.closest('.btn-enroll') || e.target.closest('.btn-unenroll')) {
                    return;
                }
                openDetailView(course.id);
            });
            coursesContainer.appendChild(card);
        });

        if (currentUserRole === 'Estudiante') {
            coursesContainer.querySelectorAll('.btn-enroll').forEach(btn => btn.addEventListener('click', (e) => handleEnrollmentAction(e.currentTarget.dataset.id, 'inscribir')));
            coursesContainer.querySelectorAll('.btn-unenroll').forEach(btn => btn.addEventListener('click', (e) => handleEnrollmentAction(e.currentTarget.dataset.id, 'desinscribir')));
        }
    };
    
    const renderClassDetail = (courseId) => {
        const course = allCoursesData.find(c => c.id === courseId);
        if (!course || !classDetailContent) return;

        const asesoriaDetailHTML = course.asesoria ? `
            <div class="detail-item">
                <div class="detail-icon"><i class='bx bx-help-circle'></i></div>
                <div class="detail-content-inner">
                    <h4>Asesoría</h4>
                    <p>${course.asesoria}</p>
                </div>
            </div>` : '';
        
        let studentDetailButtonsHTML = '';
        if (currentUserRole === 'Estudiante') {
            if (course.esta_inscrito) {
                studentDetailButtonsHTML = `<button class="btn-unenroll-detail btn-secondary" data-id="${course.id}"><i class='bx bx-user-minus'></i> Desinscribirse de este curso</button>`;
            } else {
                studentDetailButtonsHTML = `<button class="btn-enroll-detail btn-primary" data-id="${course.id}"><i class='bx bx-user-plus'></i> Inscribirse a este curso</button>`;
            }
        }

        classDetailContent.innerHTML = `
            <div class="detail-banner ${course.imagen ? '' : 'no-image'}" style="background-image: url('${course.imagen || '../assets/imagenes/default-image.png'}');">
            </div>
            <div class="class-info">
                <div class="title-container">
                     <h2 class="class-title">${course.nombre}</h2>
                     <h4>Clave del curso:</h4>
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
                ${currentUserRole === 'Estudiante' ? `<div class="detail-student-actions">${studentDetailButtonsHTML}</div>` : ''}
            </div>`;

        const courseCodeElement = classDetailContent.querySelector('.course-code');
        if (courseCodeElement) {
            courseCodeElement.addEventListener('click', () => {
                navigator.clipboard.writeText(course.id).then(() => {
                    const originalHTML = courseCodeElement.innerHTML;
                    courseCodeElement.innerHTML = `${course.id} <i class='bx bx-check copy-icon'></i> Copiado!`;
                    courseCodeElement.classList.add('copied');
                    setTimeout(() => {
                        courseCodeElement.innerHTML = originalHTML;
                        courseCodeElement.classList.remove('copied');
                    }, 1500);
                }).catch(err => console.error('Error al copiar: ', err));
            });
        }

        if (currentUserRole === 'Maestro') {
            if (editClassDetailBtn) editClassDetailBtn.dataset.id = course.id;
            if (deleteClassDetailBtn) deleteClassDetailBtn.dataset.id = course.id;
        } else if (currentUserRole === 'Estudiante') {
            const btnEnrollDetail = classDetailContent.querySelector('.btn-enroll-detail');
            const btnUnenrollDetail = classDetailContent.querySelector('.btn-unenroll-detail');
            if (btnEnrollDetail) btnEnrollDetail.addEventListener('click', (e) => handleEnrollmentAction(e.currentTarget.dataset.id, 'inscribir'));
            if (btnUnenrollDetail) btnUnenrollDetail.addEventListener('click', (e) => handleEnrollmentAction(e.currentTarget.dataset.id, 'desinscribir'));
        }
    };
    
    // --- LÓGICA DE INSCRIPCIÓN/DESINSCRIPCIÓN PARA ESTUDIANTES ---
    async function handleEnrollmentAction(courseId, actionType) {
        const controllerAction = actionType === 'inscribir' ? 'inscribirAlumnoEnCurso' : 'desinscribirAlumnoDeCurso';
        const feedbackElement = enrollByCodeMessage || document.getElementById('generic-feedback'); // Usar el de código o uno genérico
        
        if (feedbackElement) {
            feedbackElement.textContent = 'Procesando...';
            feedbackElement.className = 'message-feedback info';
        }

        try {
            const formData = new FormData();
            formData.append('idCurso', courseId);
            const result = await apiCall(controllerAction, 'POST', formData);

            if (result.success) {
                if (feedbackElement) {
                    feedbackElement.textContent = result.message;
                    feedbackElement.className = 'message-feedback success';
                } else {
                    alert(result.message);
                }
                fetchCourses(); // Recargar la lista de cursos para actualizar el estado
                
                if (classDetailView.classList.contains('active')) {
                    const courseInDetail = allCoursesData.find(c => c.id === courseId);
                    if(courseInDetail) {
                         // Actualizar el estado localmente para la vista de detalle antes de re-renderizar
                        const updatedCourse = {...courseInDetail, esta_inscrito: (actionType === 'inscribir')};
                        const index = allCoursesData.findIndex(c => c.id === courseId);
                        if (index !== -1) allCoursesData[index] = updatedCourse;
                        renderClassDetail(courseId);
                    }
                }
                
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'updateCourseListInMenu' }, '*');
                }
            } else {
                if (feedbackElement) {
                    feedbackElement.textContent = `Error: ${result.message}`;
                    feedbackElement.className = 'message-feedback error';
                } else {
                    alert(`Error: ${result.message}`);
                }
            }
        } catch (error) {
            // El error ya se muestra por apiCall
            if (feedbackElement) {
                feedbackElement.textContent = `Error de conexión al ${actionType === 'inscribir' ? 'inscribir' : 'desinscribir'}.`;
                feedbackElement.className = 'message-feedback error';
            }
        }
        if (feedbackElement) setTimeout(() => { feedbackElement.textContent = ''; feedbackElement.className = 'message-feedback'; }, 4000);
    }

    function handleEnrollByCode() {
        if (!inputEnrollCourseId || !enrollByCodeMessage) return;
        const courseIdToEnroll = inputEnrollCourseId.value.trim();
        if (!courseIdToEnroll) {
            enrollByCodeMessage.textContent = 'Por favor, introduce un ID de curso.';
            enrollByCodeMessage.className = 'message-feedback error';
            setTimeout(() => { enrollByCodeMessage.textContent = ''; enrollByCodeMessage.className = 'message-feedback'; }, 3000);
            return;
        }
        handleEnrollmentAction(courseIdToEnroll, 'inscribir');
        inputEnrollCourseId.value = '';
    }

    // --- FUNCIONES DE MAESTRO ---
    const resetForm = () => {
        if (!classForm) return;
        classForm.reset();
        if (imagePreview) {
            imagePreview.style.backgroundImage = 'none';
            imagePreview.classList.remove('has-image');
            const icon = imagePreview.querySelector('i');
            const span = imagePreview.querySelector('span');
            if (icon) icon.style.display = 'block';
            if (span) span.style.display = 'block';
        }
        if (classImageInput) classImageInput.value = '';
        if (classImageBase64Input) classImageBase64Input.value = '';
        imageBase64 = null;
        currentEditingClassId = null;
        if (editCourseIdInput) editCourseIdInput.value = '';
        if (courseIdFormInput) courseIdFormInput.readOnly = false;
        if (formViewTitle) formViewTitle.textContent = 'Añadir una nueva clase';
        if (formFeedback) {
            formFeedback.textContent = '';
            formFeedback.className = 'message-feedback';
        }
    };

    const populateFormForEdit = (courseId) => {
        const course = allCoursesData.find(c => c.id === courseId);
        if (!course || !classForm) return;

        resetForm();
        currentEditingClassId = course.id;
        if (editCourseIdInput) editCourseIdInput.value = course.id; // Para el campo oculto de actualización
        if (courseIdFormInput) {
            courseIdFormInput.value = course.id; // Mostrar el ID
            courseIdFormInput.readOnly = true; // No se puede cambiar el ID al editar
        }
        
        classForm.querySelector('[name="nombre"]').value = course.nombre || '';
        classForm.querySelector('[name="horario"]').value = course.horario || '';
        classForm.querySelector('[name="lugar"]').value = course.lugar || '';
        classForm.querySelector('[name="instructor"]').value = course.instructor || '';
        classForm.querySelector('[name="contacto"]').value = course.contacto || '';
        if (classForm.querySelector('[name="asesoria"]')) {
            classForm.querySelector('[name="asesoria"]').value = course.asesoria || '';
        }

        if (course.imagen && imagePreview && classImageBase64Input) {
            imagePreview.style.backgroundImage = `url('${course.imagen}')`;
            imagePreview.classList.add('has-image');
            const icon = imagePreview.querySelector('i');
            const span = imagePreview.querySelector('span');
            if (icon) icon.style.display = 'none';
            if (span) span.style.display = 'none';
            imageBase64 = course.imagen; // Guardar la imagen existente (Base64)
            classImageBase64Input.value = course.imagen;
        }
        
        if (formViewTitle) formViewTitle.textContent = 'Editar Clase';
        showView(addFormView);
    };
    
    const saveCourse = async (event) => {
        event.preventDefault();
        if (!classForm || !formFeedback) return;

        const formData = new FormData(classForm);
        const action = currentEditingClassId ? 'actualizarCurso' : 'crearCurso';
        
        // Para 'crearCurso', el ID se toma del input 'course_id_form'
        // Para 'actualizarCurso', el ID se toma de 'currentEditingClassId' y se pone en 'id'
        if (currentEditingClassId) {
            formData.set('id', currentEditingClassId); // Asegurar que el ID de edición esté
        }
        // El campo 'id' del formulario (course_id_form) se enviará para creación.

        // Manejo de la imagen
        if (imageBase64) { // Si se seleccionó una nueva imagen o se mantuvo la existente (ya en base64)
            formData.set('imagen', imageBase64);
        } else if (action === 'crearCurso') {
            formFeedback.textContent = "Por favor, selecciona una imagen para el curso.";
            formFeedback.className = 'message-feedback error';
            setTimeout(() => { formFeedback.textContent = ''; formFeedback.className = 'message-feedback'; }, 3000);
            return;
        }
        // Si es actualización y no hay imageBase64 (no se cambió la imagen), no se envía 'imagen'
        // y el backend no debería actualizarla.
        if (action === 'actualizarCurso' && !imageBase64 && !formData.has('imagen')) {
             // No hacer nada, el backend no tocará la imagen si no se envía.
        }


        formFeedback.textContent = 'Guardando...';
        formFeedback.className = 'message-feedback info';

        try {
            const result = await apiCall(action, 'POST', formData);
            if (result.success) {
                formFeedback.textContent = result.message || 'Curso guardado exitosamente.';
                formFeedback.className = 'message-feedback success';
                fetchCourses();
                setTimeout(() => {
                    closeAndResetForm();
                }, 1500);
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'updateCourseListInMenu' }, '*');
                }
            } else {
                formFeedback.textContent = `Error: ${result.message || 'No se pudo guardar el curso.'}`;
                formFeedback.className = 'message-feedback error';
            }
        } catch (error) {
            // El error ya se muestra por apiCall, aquí podríamos hacer algo más si es necesario
            formFeedback.textContent = `Error al guardar: ${error.message}`;
            formFeedback.className = 'message-feedback error';
        }
    };

    const handleDeleteCourse = async () => {
        if (!classToDeleteId || !deleteModal) return;
        try {
            const formData = new FormData();
            formData.append('id', classToDeleteId);
            const result = await apiCall('eliminarCurso', 'POST', formData);
            
            if (result.success) {
                alert(result.message || 'Curso eliminado exitosamente.');
                fetchCourses();
                closeDeleteModal();
                showView(coursesView);
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'updateCourseListInMenu' }, '*');
                }
            } else {
                 alert(result.message || 'No se pudo eliminar el curso.');
            }
        } catch (error) {
            // El error ya se muestra
        }
    };

    // --- MANEJO DE EVENTOS ---
    if (currentUserRole === 'Maestro') {
        if (imagePreview && classImageInput && classImageBase64Input) {
            imagePreview.addEventListener('click', () => classImageInput.click());
            classImageInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (imagePreview) {
                            imagePreview.style.backgroundImage = `url('${e.target.result}')`;
                            imagePreview.classList.add('has-image');
                            const icon = imagePreview.querySelector('i');
                            const span = imagePreview.querySelector('span');
                            if (icon) icon.style.display = 'none';
                            if (span) span.style.display = 'none';
                        }
                        imageBase64 = e.target.result;
                        classImageBase64Input.value = imageBase64; // Guardar en el input oculto
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
    } else if (currentUserRole === 'Estudiante') {
        if (btnEnrollByCode) {
            btnEnrollByCode.addEventListener('click', handleEnrollByCode);
        }
    }
    
    const openDetailView = (courseId) => {
        renderClassDetail(courseId);
        showView(classDetailView);
    };

    if (backToCoursesBtn) {
        backToCoursesBtn.addEventListener('click', () => showView(coursesView));
    }

    // --- ESCUCHAR MENSAJES DESDE EL PARENT (SIDEBAR) ---
window.addEventListener('message', function(event) {
    // Por seguridad, podrías validar event.origin aquí si lo necesitas
    if (event.data && event.data.type === 'loadClassDetail' && event.data.classId) {
        // Esperar a que los cursos estén cargados si es necesario
        const showDetail = () => {
            const courseExists = allCoursesData.some(c => c.id === event.data.classId);
            if (courseExists) {
                renderClassDetail(event.data.classId);
                showView(classDetailView);
            } else {
                // Si aún no se han cargado los cursos, esperar y volver a intentar
                setTimeout(showDetail, 200);
            }
        };
        showDetail();
    }
    // Opcional: para mostrar el formulario de añadir clase desde el menú
    if (event.data && event.data.type === 'showAddForm') {
        if (typeof openAddForm === 'function') openAddForm();
    }
        // Mostrar solo cursos inscritos (para estudiantes)
    if (event.data && event.data.type === 'showEnrolledCoursesOnly' && currentUserRole === 'Estudiante') {
        showOnlyEnrolled = true;
        // Oculta antes de cargar para evitar parpadeo
        if (coursesContainer) coursesContainer.style.visibility = 'hidden';
        if (enrollByCodeSection) enrollByCodeSection.style.display = 'none';
        fetchCourses();
    }
});

    // --- INICIALIZACIÓN ---
    fetchCourses();
    showView(coursesView);
});

