document.addEventListener('DOMContentLoaded', function() {
    // Cargar configuraciones guardadas
    cargarConfiguraciones();
    
    // Evento para cambiar la foto de perfil
    document.getElementById('profile-upload').addEventListener('change', function(e) {
        cambiarFotoPerfil(e);
    });
    
    // Eventos de apariencia
    document.getElementById('tema').addEventListener('change', function() {
        guardarConfiguracion('tema', this.value);
        aplicarTema(this.value);
    });
    
    document.getElementById('fuente').addEventListener('change', function() {
        guardarConfiguracion('fuente', this.value);
        aplicarTamañoFuente(this.value);
    });
    
    // Eventos de notificaciones
    document.getElementById('notificaciones').addEventListener('change', function() {
        guardarConfiguracion('notificaciones', this.checked);
    });
    
    document.getElementById('notif-sonido').addEventListener('change', function() {
        guardarConfiguracion('notif-sonido', this.checked);
    });
    
    // Eventos de privacidad
    document.getElementById('perfil-publico').addEventListener('change', function() {
        guardarConfiguracion('perfil-publico', this.checked);
    });
    
    document.getElementById('cambiar-pass').addEventListener('click', function() {
        cambiarContrasena();
    });
    
    // Eventos de cuenta
    document.getElementById('exportar-datos').addEventListener('click', function() {
        exportarDatos();
    });
    
    document.getElementById('eliminar-cuenta').addEventListener('click', function() {
        confirmarEliminarCuenta();
    });
});

function cargarConfiguraciones() {
    // Cargar tema
    const tema = localStorage.getItem('tema') || 'claro';
    document.getElementById('tema').value = tema;
    aplicarTema(tema);
    
    // Cargar tamaño de fuente
    const fuente = localStorage.getItem('fuente') || 'mediana';
    document.getElementById('fuente').value = fuente;
    aplicarTamañoFuente(fuente);
    
    // Cargar notificaciones
    document.getElementById('notificaciones').checked = localStorage.getItem('notificaciones') !== 'false';
    document.getElementById('notif-sonido').checked = localStorage.getItem('notif-sonido') !== 'false';
    
    // Cargar privacidad
    document.getElementById('perfil-publico').checked = localStorage.getItem('perfil-publico') === 'true';
    
    // Cargar foto de perfil si existe
    const fotoPerfil = localStorage.getItem('foto-perfil');
    if (fotoPerfil) {
        document.getElementById('profile-picture').src = fotoPerfil;
    }
}

function guardarConfiguracion(clave, valor) {
    localStorage.setItem(clave, valor);
}

function cambiarFotoPerfil(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imagenPerfil = document.getElementById('profile-picture');
            imagenPerfil.src = e.target.result;
            
            // Guardar en localStorage
            localStorage.setItem('foto-perfil', e.target.result);
            
            // Enviar mensaje al menú principal para actualizar la foto
            if (window.parent) {
                window.parent.postMessage({
                    type: 'actualizarFotoPerfil',
                    foto: e.target.result
                }, '*');
            }
        };
        
        reader.readAsDataURL(file);
    }
}

function aplicarTema(tema) {
    document.body.classList.toggle('dark-mode', tema === 'oscuro');
    
    // Enviar mensaje al padre para que aplique el tema también
    if (window.parent) {
        window.parent.postMessage({
            type: 'cambiarTema',
            tema: tema
        }, '*');
    }
}

function aplicarTamañoFuente(tamaño) {
    let tamañoPx;
    switch(tamaño) {
        case 'pequena': tamañoPx = '14px'; break;
        case 'mediana': tamañoPx = '16px'; break;
        case 'grande': tamañoPx = '18px'; break;
        default: tamañoPx = '16px';
    }
    
    document.body.style.fontSize = tamañoPx;
    
    if (window.parent) {
        window.parent.postMessage({
            type: 'cambiarTamañoFuente',
            tamaño: tamañoPx
        }, '*');
    }
}

function cambiarContrasena() {
    // Aquí iría la lógica para cambiar la contraseña
    alert('Funcionalidad para cambiar contraseña estará disponible pronto');
}

function exportarDatos() {
    // Simular exportación de datos
    const datosUsuario = {
        nombre: document.getElementById('user-name').textContent,
        email: document.getElementById('user-email').textContent,
        rol: document.getElementById('user-rol').textContent,
        configuraciones: {
            tema: localStorage.getItem('tema'),
            notificaciones: localStorage.getItem('notificaciones')
        }
    };
    
    const blob = new Blob([JSON.stringify(datosUsuario, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mis_datos_epa.json';
    a.click();
    
    URL.revokeObjectURL(url);
}

function confirmarEliminarCuenta() {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
        alert('Funcionalidad para eliminar cuenta estará disponible pronto');
        // Aquí iría la lógica para eliminar la cuenta
    }
}