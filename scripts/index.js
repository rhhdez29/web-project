document.addEventListener('DOMContentLoaded', () => {
  function initBrilloObserver() {
    const contenedores = document.querySelectorAll('.contenedor-brillo');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('mostrar-brillo', entry.isIntersecting);
      });
    }, { threshold: 1 });
    contenedores.forEach(cont => observer.observe(cont));
  }

  function configurarModoOscuro(toggleId = 'toggle-mode') {
    const toggleSwitch = document.getElementById(toggleId);
    const body = document.body;

    const modoOscuroActivado = localStorage.getItem('modoOscuro') === 'true';

    if (modoOscuroActivado) {
      body.classList.add('modo-oscuro');
      if (toggleSwitch) toggleSwitch.checked = true;
    }

    if (toggleSwitch) {
      toggleSwitch.addEventListener('change', () => {
        body.classList.toggle('modo-oscuro');
        const esModoOscuro = body.classList.contains('modo-oscuro');
        localStorage.setItem('modoOscuro', esModoOscuro);
      });
    }
  }

  function configurarRedireccionLogin() {
    const loginButton = document.getElementById("login-button");
    if (loginButton) {
      loginButton.addEventListener("click", (e) => {
        window.location.href = "./pages/login.html";
      });
    }
  }

  // Llamadas a las funciones
  initBrilloObserver();
  configurarModoOscuro();
  configurarRedireccionLogin();
});
