function cambiarFondo() {
    const fondoSeleccionado = document.getElementById("fondo").value;
    document.querySelector(".header-icon2").src = `../assets/imagenes/${fondoSeleccionado}`;
}

function agregarNota() {
    const inputs = document.querySelectorAll("input");
    const lugar = inputs[0].value;
    const salon = inputs[1].value;
    const instructor = inputs[2].value;
    const contacto = inputs[3].value;
    const asesoria = inputs[4].value;
    const hora = document.getElementById("hora").value;

    const nota = `
        <div class="nota">
            <p><strong>Lugar:</strong> ${lugar}</p>
            <p><strong>Salón:</strong> ${salon}</p>
            <p><strong>Hora:</strong> ${hora}</p>
            <p><strong>Instructor:</strong> ${instructor}</p>
            <p><strong>Contacto:</strong> ${contacto}</p>
            <p><strong>Asesorías:</strong> ${asesoria}</p>
            <hr>
        </div>
    `;
    document.getElementById("contenedorNotas").innerHTML += nota;
}

document.addEventListener("DOMContentLoaded", () => {
    const inputApunte = document.getElementById("inputApunte");
    const listaApuntes = document.getElementById("listaApuntes");

    inputApunte.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const texto = inputApunte.value.trim();
            if (texto !== "") {
                const nota = document.createElement("div");
                nota.className = "nota-apunte";
                nota.innerHTML = `
                    ${texto}
                    <button class="eliminar">❌</button>
                `;
                listaApuntes.appendChild(nota);
                inputApunte.value = "";

                nota.querySelector(".eliminar").addEventListener("click", () => {
                    nota.remove();
                });
            }
        }
    });
});
