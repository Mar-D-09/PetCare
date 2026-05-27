document.addEventListener("DOMContentLoaded", () => {
    const btnRegistrarse = document.getElementById("btn-registrarse");
    const btnIniciarSesion = document.getElementById("btn-iniciar-sesion");
    const opcionesLogin = document.getElementById("opciones-login");
    const contenido = document.getElementById("contenido-propietario");

    btnRegistrarse.addEventListener("click", mostrarFormularioRegistro);
    btnIniciarSesion.addEventListener("click", mostrarFormularioLogin);

    // ================= FORMULARIO REGISTRO =================
    function mostrarFormularioRegistro() {
        opcionesLogin.style.display = "none";

        contenido.innerHTML = `
            <div class="card p-4 shadow-sm">
                <h2 class="text-center mb-3">Registro de Propietario</h2>
                <form id="form-propietario">
                    <div class="mb-3">
                        <label class="form-label">Nombre completo:</label>
                        <input type="text" id="nombre" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Teléfono:</label>
                        <input type="tel" id="telefono" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email:</label>
                        <input type="email" id="correo" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Contraseña:</label>
                        <input type="password" id="password" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Repetir contraseña:</label>
                        <input type="password" id="password2" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-petcare w-100">Registrarse</button>
                </form>
            </div>
        `;

        const formProp = document.getElementById("form-propietario");
        formProp.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombre = document.getElementById("nombre").value;
            const telefono = document.getElementById("telefono").value;
            const correo = document.getElementById("correo").value;
            const password = document.getElementById("password").value;
            const password2 = document.getElementById("password2").value;

            if (password !== password2) {
                alert("Las contraseñas no coinciden");
                return;
            }

            const propietario = { nombre, telefono, correo, password };
            localStorage.setItem("propietario", JSON.stringify(propietario));

            mostrarFormularioMascota();
        });
    }

    // ================= FORMULARIO LOGIN =================
    function mostrarFormularioLogin() {
        opcionesLogin.style.display = "none";

        contenido.innerHTML = `
            <div class="card p-4 shadow-sm">
                <h2 class="text-center mb-3">Iniciar Sesión</h2>
                <form id="form-login">
                    <div class="mb-3">
                        <label class="form-label">Email:</label>
                        <input type="email" id="login-correo" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Contraseña:</label>
                        <input type="password" id="login-password" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-petcare w-100">Ingresar</button>
                </form>
                <div id="mensaje-error" class="text-danger mt-2"></div>
            </div>
        `;

        const formLogin = document.getElementById("form-login");
        const mensajeError = document.getElementById("mensaje-error");

        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();

            const correo = document.getElementById("login-correo").value;
            const password = document.getElementById("login-password").value;

            const propietario = JSON.parse(localStorage.getItem("propietario"));

            if (propietario && propietario.correo === correo && propietario.password === password) {
                const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];
                if (mascotas.length > 0) {
                    window.location.href = "propietario-dashboard.html";
                } else {
                    mostrarFormularioMascota();
                }
            } else {
                mensajeError.textContent = "Correo o contraseña incorrectos.";
            }
        });
    }

    // ================= FORMULARIO MASCOTA =================
    function mostrarFormularioMascota() {
        contenido.innerHTML = `
            <div class="card p-4 shadow-sm">
                <h2 class="text-center mb-3">Registrar Mascota</h2>
                <form id="form-mascota">
                    <div class="mb-3">
                        <label class="form-label">Nombre de la mascota:</label>
                        <input type="text" id="nombreMascota" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Especie:</label>
                        <input type="text" id="especie" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Edad:</label>
                        <input type="number" id="edad" class="form-control" min="0" required>
                    </div>
                    <button type="submit" class="btn btn-petcare w-100">Guardar Mascota</button>
                </form>
            </div>
        `;

        const formMascota = document.getElementById("form-mascota");
        formMascota.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombreMascota = document.getElementById("nombreMascota").value;
            const especie = document.getElementById("especie").value;
            const edad = document.getElementById("edad").value;

            let mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];
            mascotas.push({
                id: Date.now(),
                nombre: nombreMascota,
                tipo: especie,
                edad: edad
            });

            localStorage.setItem("mascotas", JSON.stringify(mascotas));

            window.location.href = "propietario-dashboard.html";
        });
    }
});
