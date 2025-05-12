class DarkMode {
    constructor() {
        this.init();
    }

    init() {
        this.setInitialState();
        this.setupEventListeners();
        console.log('[DarkMode] Inicializado correctamente');
    }

    setInitialState() {
        const isDarkMode = this.getCurrentState();
        this.applyDarkMode(isDarkMode, false);
    }

    getCurrentState() {
        if (localStorage.getItem('darkMode') !== null) {
            return localStorage.getItem('darkMode') === 'true';
        }
        
        const cookieValue = document.cookie.split('; ')
            .find(row => row.startsWith('darkMode='))
            ?.split('=')[1];
        
        return cookieValue === 'true' || false;
    }

    setupEventListeners() {
        // Escuchar cambios en el interruptor
        document.addEventListener('change', (e) => {
            if (e.target.id === 'toggle-mode') {
                this.toggle(e.target.checked);
            }
        });

        // Escuchar cambios en el selector de tema
        document.addEventListener('change', (e) => {
            if (e.target.id === 'tema') {
                this.toggle(e.target.value === 'oscuro');
            }
        });

        // Sincronizar entre pestañas
        window.addEventListener('storage', (e) => {
            if (e.key === 'darkMode') {
                this.applyDarkMode(e.newValue === 'true', false);
            }
        });
    }

    toggle(forceState = null) {
        const newState = forceState !== null ? forceState : !document.body.classList.contains('modo-oscuro');
        this.applyDarkMode(newState, true);
    }

    applyDarkMode(isDarkMode, savePreference = true) {
        console.log(`[DarkMode] Aplicando: ${isDarkMode ? 'OSCURO' : 'CLARO'}`);
        
        // Aplicar clase al body
        document.body.classList.toggle('modo-oscuro', isDarkMode);
        
        // Sincronizar elementos UI
        this.syncUIElements(isDarkMode);
        
        // Guardar preferencia
        if (savePreference) {
            this.savePreference(isDarkMode);
        }
    }

    syncUIElements(isDarkMode) {
        // Sincronizar interruptor
        const toggleSwitch = document.getElementById('toggle-mode');
        if (toggleSwitch) {
            toggleSwitch.checked = isDarkMode;
        }
        
        // Sincronizar selector de tema
        const themeSelect = document.getElementById('tema');
        if (themeSelect) {
            themeSelect.value = isDarkMode ? 'oscuro' : 'claro';
        }
    }

    savePreference(isDarkMode) {
        // Guardar en localStorage
        localStorage.setItem('darkMode', isDarkMode);
        
        // Guardar en cookie (1 año de duración)
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `darkMode=${isDarkMode}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
        
        console.log(`[DarkMode] Preferencia guardada: ${isDarkMode}`);
    }
}

// Inicialización
if (typeof window.DarkMode === 'undefined') {
    window.DarkMode = new DarkMode();
}