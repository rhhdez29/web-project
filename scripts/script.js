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
document.getElementById("login-button").addEventListener("click", (e) => {
  e.preventDefault(); // evita que el formulario recargue la página

  // 1) Captura el email del input
  const emailInput = document.querySelector('.sing-in input[placeholder="Email"]');
  const email = emailInput.value.trim();
  if (!email) {
    return alert("Por favor ingresa tu correo");
  }

  // 2) Deriva un nombre de usuario desde el email
  const name = email.split("@")[0];

  // 3) Guarda email y nombre en sessionStorage
  sessionStorage.setItem("email", email);
  sessionStorage.setItem("username", name);

  // 4) Redirige al menú principal
  window.location.href = "menu.php";
});
