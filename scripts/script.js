// Toggle entre Login y Register
const container = document.querySelector(".container");
const btnSignIn = document.getElementById("btn-sign-in");
const btnSignUp = document.getElementById("btn-sign-up");

btnSignIn.addEventListener("click", () => {
  container.classList.remove("toggle");
});

btnSignUp.addEventListener("click", () => {
  container.classList.add("toggle");
});

document.getElementById('next-step').addEventListener('click', function () {
  document.getElementById('step-1').hidden = true;
  document.getElementById('step-2').hidden = false;
});

document.getElementById('prev-step').addEventListener('click', function () {
  document.getElementById('step-2').hidden = true;
  document.getElementById('step-1').hidden = false;
});

// Manejo del botón de Iniciar sesión
/*document.getElementById("login-button").addEventListener("click", (e) => {
  e.preventDefault(); // evita que el formulario recargue la página
}
);*/

//Muestra directamente el formulario de registro si se presiona el boton "probar" o "crear cuenta"
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.hash === "#registro") {
      document.querySelector('.container').classList.add('toggle');
  }
});
