<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EPA! - Entorno de Productividad y Aprendizaje</title>
    <!-- Preconexión optimizada (sin duplicados) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <!-- Fuentes en una sola línea -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Joan&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=The+Nautigal:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/styles/style.css">
</head>
<body>
    <header>
        <nav>
            <p class="I">EPA!</p>
            <div class="D">
                <img src="assets/imagenes/icono.svg" alt="Ícono de inicio de sesión"  width="93" height="85">
                <button id="login-button">Iniciar Sesión</button>
                <label class="switch">
                    <input type="checkbox" id="toggle-mode">
                    <span class="slider">
                        <span class="icon">☀️</span>
                        <span class="icon">🌙</span>
                    </span>
                </label>
            </div>
        </nav>
        <section>
            <div class="contenedor">
                <div>
                    <svg viewBox="0 0 758 405" width="758" height="405" xmlns="http://www.w3.org/2000/svg">
                        <!-- Curva suavizada -->
                        <path id="curva" d="M50,300 C150,230 400,230 700,300"fill="transparent"/>
                        <text>
                          <textPath href="#curva" startOffset="50%" text-anchor="middle" class="texto-curvo">
                            EPA!
                          </textPath>
                        </text>
                      </svg>                               
                </div>
                <div>
                    <img class="elementoPrincipal" src="assets/imagenes/elemento.svg" alt="Logo de EPA">     
                </div>
            </div>
            <div class="contenedorComillas">
                <p class="comillas">“</p>
                <p class="texto">En un universo lleno de caos, encontraste el lugar perfecto para organizar tu genialidad.</p>
                <p class="comillas">”</p>
            </div>
        </section>
    </header>

    <main>
        <section>
            <div class="contenido-centrado">
                <h1>Sobre nosotros</h1>
                <p class="texto2">Un espacio donde estudiantes organizan su estudio y docentes comparten recursos de manera dinámica.</p>
            </div>
            <div class="contenedor1">
                <div class="icono-texto">
                    <img class="elementoSecundario" src="assets/imagenes/elemento.svg" alt="Aqui va un elemento">
                    <h2>¿Quiénes somos?</h2>
                    <p class="texto2">Somos EPA, una plataforma que ayuda a estudiantes y profesores a organizar su conocimiento de forma fácil y efectiva.</p>
                </div>
                <div class="icono-texto">
                    <img class="elementoSecundario" src="assets/imagenes/elemento.svg" alt="Aqui va un elemento">
                    <h2>¿Quién es EPA?</h2>
                    <p class="texto2">Tu herramienta digital para para crear, organizar y compartir conocimiento.</p>
                </div>
                <div class="icono-texto">
                    <img class="elementoSecundario" src="assets/imagenes/elemento.svg" alt="Aqui va un elemento">
                    <h2>Nuestro propósito</h2>
                    <p class="texto2">Simplificar el acceso y la organización del conocimiento para que aprender y enseñar sea más fácil.</p>
                </div>
            </div>
        </section>

        <section>
            <div class="contenedor1">
                <div class="contenedor-izquierda">
                    <h1>Experiencia en EPA!</h1>
                    <div class="contenido-izquierda">
                        <h2>Apuntes vivos</h2>
                        <p class="texto2">Escribe, diseña y conecta ideas con bloques multimedia (texto, imágenes, código, fórmulas...).</p>
                    </div>
                    <div class="contenido-izquierda">
                        <h2>Plantillas inteligentes</h2>
                        <p class="texto2">Olvídate de empezar desde cero. EPA! genera plantillas con solo compartirle algunos datos.</p>
                    </div>
                    <div class="contenido-izquierda">
                        <h2>Crea Tu Propio Espacio de Estudio Perfecto</h2>
                        <p class="texto2">Construye tu carpeta digital como si fuera un universo personalizado.</p>
                    </div>
                    <button>Probar ahora</button>
                </div>
                <div class="carousel">
                    <div class="carousel-track">
                        <img src="assets/imagenes/elemento.svg" alt="Imagen 1">
                        <img src="assets/imagenes/elemento.svg" alt="Imagen 2">
                        <img src="assets/imagenes/elemento.svg" alt="Imagen 3">
                    </div>
                </div>
            </div>
        </section>

        <section>
            <div class="titulo-centrado">
                <h1>Diseñado para estudiantes, educadores y autodidactas</h1>
            </div>
            <div class="contenedor">
                <video autoplay muted loop>
                    <source src="assets/videos/video.mp4" type="video/mp4">
                    Tu navegador no soporta videos HTML5.
                </video>
                <div class="contenido-izquierda">
                    <h2>¡Pruébanos!</h2>
                    <p class="texto2">Queremos que cada usuario sienta que tiene el control total de su información, sin estrés ni complicaciones. Nuestra meta es ofrecer una experiencia fluida, eficiente y amigable, donde cada idea pueda encontrar su lugar sin esfuerzo.</p>
                </div>
            </div>
        </section>
        <section>
            <div class="titulo-centrado">
                <h1>¿Estás listo?</h1>
            </div>
            <div class="contenedor-centrado">
                <div class="icono-texto">
                    <div class="contenedor-brillo">
                        <img class="elementoPrincipal" src="assets/imagenes/elemento.svg" alt="Imagen">
                    </div>
                    <h1>Organiza</h1>
                    <p class="texto2">Tus tareas, proyectos y metas en un solo lugar. </p>
                </div>
                <div class="icono-texto">
                    <div class="contenedor-brillo">
                        <img class="elementoPrincipal" src="assets/imagenes/elemento.svg" alt="Imagen">
                    </div>
                    <h1>Aprende</h1>
                    <p class="texto2">EPA! es el cuaderno que crece contigo.</p>
                </div>
                <div class="icono-texto">
                    <div class="contenedor-brillo">
                        <img class="elementoPrincipal" src="assets/imagenes/elemento.svg" alt="Imagen">
                    </div>
                    <h1>Motivate</h1>
                    <p class="texto2">Olvídate de adaptarte a herramientas rígidas. En EPA!, tu creatividad es el límite.</p>
                </div>
            </div>
        </section>
    </main>

    <div id="banner">
        <h3>¡Empieza a construir tu espacio ideal hoy!</h3>
        <button>Crear mi cuenta ahora</button>
    </div>

    <footer>
        <div class="footer-contenido">
            <!-- Sección 1: Enlaces rápidos -->
            <div class="footer-seccion">
                <p class="texto2">EPA!</h3>
                <h3 class="texto2">Conocenos</h3>
                <h3 class="texto2">¿Dónde encontrarnos?</h3>
            </div>

            <div class="footer-seccion">
                <h3 class="texto2">¿Trabajamos juntos?</h3>
                <h3 class="texto2">¡Escríbenos!</h3>
                <h3 class="texto2">info@grupoepa.com</h3>
            </div>

            <div class="footer-seccion">
                <h3 class="texto2">¿Aún con dudas?</h3>
                <h3 class="texto2">Leer sobre EPA!</h3>
            </div>

        </div>
    
        <!-- Derechos de autor -->
        <div class="footer-derechos">
            <p>© 2025 Grupo EPA - Todos los derechos reservados.</p>
        </div>
    </footer>
    <script src="scripts/index.js"></script>
</body>
</html>