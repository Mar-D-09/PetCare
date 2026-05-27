// ===========================================
// CARNET DE VACUNACIÓN – PETCARE (VERSIÓN FINAL CON HTML MEJORADO)
// ===========================================

// Variable global para la mascota actual
let mascotaActual = null;

// Elementos del DOM (Asegurar que los IDs coincidan con carnet.html)
const mascotaFoto = document.getElementById("fotoMascota");
const mascotaNombre = document.getElementById("nombreMascota");
const mascotaRaza = document.getElementById("razaMascota");
const mascotaEdad = document.getElementById("edadMascota");

const listaVacunas = document.getElementById("listaVacunas");
const listaDesparasitaciones = document.getElementById("listaDesparasitaciones");

// Botones y Modales
const btnEditar = document.getElementById("btnEditar");
const btnEliminar = document.getElementById("btnEliminar");

const btnAgregarVacuna = document.getElementById("btnAgregarVacuna");
const btnAgregarDesparasitacion = document.getElementById("btnAgregarDesparasitacion");
const inputFoto = document.getElementById("subirFoto");

// Modales y sus botones de GUARDAR
const modalVacuna = document.getElementById("modalVacuna");
const guardarVacuna = document.getElementById("guardarVacuna");

const modalDesparasitacion = document.getElementById("modalDesparasitacion");
const guardarDespa = document.getElementById("guardarDespa");

const modalEditar = document.getElementById("modalEditar");
const guardarEditar = document.getElementById("guardarEditar"); 

// Inputs de los modales (IDs de carnet.html)
const inputEditarNombre = document.getElementById("editar-nombre");
const inputEditarEdad = document.getElementById("editar-edad");


// ==============================
// FUNCIONES GENERALES
// ==============================

// Función global para cerrar modales (llamada desde onclick en el HTML)
window.cerrarModales = function() {
    modalVacuna.classList.add('oculto');
    modalDesparasitacion.classList.add('oculto');
    modalEditar.classList.add('oculto');
};

function guardarCambios() {
    if (!mascotaActual) return;
    
    let mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];
    const index = mascotas.findIndex(m => String(m.id) === String(mascotaActual.id));
    
    if (index !== -1) {
        mascotas[index] = mascotaActual;
        localStorage.setItem("mascotas", JSON.stringify(mascotas));
        console.log("Cambios guardados en " + mascotaActual.nombre);
    } else {
        console.error("Error: Mascota actual no encontrada para guardar cambios.");
    }
}

function cargarDatos() {
    if (!mascotaActual) return;
    
    mascotaFoto.src = mascotaActual.foto || "img/default_pet.png";
    mascotaNombre.textContent = mascotaActual.nombre;
    mascotaRaza.textContent = mascotaActual.raza || "No especificada";
    mascotaEdad.textContent = (mascotaActual.edad ? mascotaActual.edad + " años" : "Edad no disponible");

    // Llenar inputs del modal Editar
    inputEditarNombre.value = mascotaActual.nombre || '';
    inputEditarEdad.value = mascotaActual.edad || '';

    mostrarVacunas();
    mostrarDesparasitaciones();
}

// ==============================
// CRUD Listas Dinámicas
// ==============================

function mostrarVacunas() {
    listaVacunas.innerHTML = "";
    if (!mascotaActual.vacunas) mascotaActual.vacunas = [];

    mascotaActual.vacunas.forEach((v, index) => {
        const item = document.createElement("div");
        item.className = "item-card";
        item.innerHTML = `
            <p><strong>${v.nombre}</strong></p>
            <p>Fecha aplicada: ${v.fecha}</p>
            <p>Próxima: ${v.proxima || 'N/A'}</p>
            <button class="btn-eliminar" onclick="eliminarVacuna(${index})">Eliminar</button>
        `;
        listaVacunas.appendChild(item);
    });
}

function mostrarDesparasitaciones() {
    listaDesparasitaciones.innerHTML = "";
    if (!mascotaActual.desparasitaciones) mascotaActual.desparasitaciones = [];

    mascotaActual.desparasitaciones.forEach((d, index) => {
        const item = document.createElement("div");
        item.className = "item-card";
        item.innerHTML = `
            <p><strong>${d.nombre}</strong></p>
            <p>Fecha aplicada: ${d.fecha}</p>
            <p>Próxima: ${d.proxima || 'N/A'}</p>
            <button class="btn-eliminar" onclick="eliminarDesparasitacion(${index})">Eliminar</button>
        `;
        listaDesparasitaciones.appendChild(item);
    });
}


// ==============================
// FUNCIONES GLOBALES DE ELIMINACIÓN
// ==============================

window.eliminarVacuna = function(i) {
    if (!mascotaActual || !confirm("¿Seguro que quieres eliminar esta vacuna?")) return;
    
    mascotaActual.vacunas.splice(i, 1);
    guardarCambios();
    mostrarVacunas();
}

window.eliminarDesparasitacion = function(i) {
    if (!mascotaActual || !confirm("¿Seguro que quieres eliminar esta desparasitación?")) return;

    mascotaActual.desparasitaciones.splice(i, 1);
    guardarCambios();
    mostrarDesparasitaciones();
}

// ==============================
// EVENT LISTENERS DE MODALES Y ACCIONES
// ==============================

// --- Ficha Principal ---
if (btnEditar) {
    btnEditar.addEventListener("click", () => {
        modalEditar.classList.remove('oculto');
    });
}

if (btnEliminar) {
    btnEliminar.addEventListener("click", () => {
        if (!confirm("ADVERTENCIA: ¿Está seguro de que desea ELIMINAR permanentemente a esta mascota y todo su historial?")) return;

        let mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];
        mascotas = mascotas.filter(m => String(m.id) !== String(mascotaActual.id));
        localStorage.setItem("mascotas", JSON.stringify(mascotas));
        
        alert("Mascota eliminada con éxito.");
        window.location.href = "propietario-dashboard.html";
    });
}

if (inputFoto) {
    inputFoto.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            mascotaActual.foto = e.target.result;
            mascotaFoto.src = mascotaActual.foto;
            guardarCambios();
        };
        reader.readAsDataURL(file);
    });
}


// --- Lógica del Modal VACUNA ---
if (btnAgregarVacuna) {
    btnAgregarVacuna.addEventListener("click", () => {
        modalVacuna.classList.remove('oculto');
    });
}

if (guardarVacuna) {
    guardarVacuna.addEventListener("click", () => {
        // LECTURA DE DATOS AHORA INCLUYE EL NUEVO CAMPO 'vacuna-proxima'
        const nombre = document.getElementById("vacuna-nombre").value;
        const fecha = document.getElementById("vacuna-fecha").value;
        const proxima = document.getElementById("vacuna-proxima").value; // <-- Campo añadido al HTML

        if (!nombre || !fecha) {
            alert("Completa el nombre y la fecha de la vacuna.");
            return;
        }

        if (!mascotaActual.vacunas) mascotaActual.vacunas = [];
        mascotaActual.vacunas.push({ nombre, fecha, proxima });

        // Limpiar inputs
        document.getElementById("vacuna-nombre").value = ''; 
        document.getElementById("vacuna-fecha").value = '';
        document.getElementById("vacuna-proxima").value = '';
        
        guardarCambios();
        mostrarVacunas();
        cerrarModales();
    });
}

// --- Lógica del Modal DESPARASITACIÓN ---
if (btnAgregarDesparasitacion) {
    btnAgregarDesparasitacion.addEventListener("click", () => {
        modalDesparasitacion.classList.remove('oculto');
    });
}

if (guardarDespa) {
    guardarDespa.addEventListener("click", () => {
        // LECTURA DE DATOS AHORA INCLUYE EL NUEVO CAMPO 'despa-proxima'
        const nombre = document.getElementById("despa-nombre").value;
        const fecha = document.getElementById("despa-fecha").value;
        const proxima = document.getElementById("despa-proxima").value; // <-- Campo añadido al HTML

        if (!nombre || !fecha) {
            alert("Completa el nombre y la fecha.");
            return;
        }

        if (!mascotaActual.desparasitaciones) mascotaActual.desparasitaciones = [];
        mascotaActual.desparasitaciones.push({ nombre, fecha, proxima });

        // Limpiar inputs
        document.getElementById("despa-nombre").value = '';
        document.getElementById("despa-fecha").value = '';
        document.getElementById("despa-proxima").value = '';
        
        guardarCambios();
        mostrarDesparasitaciones();
        cerrarModales();
    });
}

// --- Lógica del Modal EDITAR ---
if (guardarEditar) {
    guardarEditar.addEventListener("click", () => {
        const nuevoNombre = inputEditarNombre.value.trim();
        const nuevaEdad = inputEditarEdad.value.trim();

        if (nuevoNombre) {
            mascotaActual.nombre = nuevoNombre;
            mascotaActual.edad = nuevaEdad;

            guardarCambios();
            cargarDatos(); // Recarga la ficha principal con los nuevos datos
            cerrarModales();
        } else {
            alert("El nombre de la mascota no puede estar vacío.");
        }
    });
}


// ==============================
// Iniciar la Aplicación (Carga por URL)
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener la ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const mascotaId = urlParams.get('id');

    if (!mascotaId) {
        // Si no hay ID, regresa al dashboard
        window.location.href = "propietario-dashboard.html";
        return;
    }

    // 2. Buscar la mascota en la lista general
    let mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];
    mascotaActual = mascotas.find(m => String(m.id) === String(mascotaId));

    if (!mascotaActual) {
        // Si no se encuentra, regresa al dashboard
        window.location.href = "propietario-dashboard.html";
        return;
    }

    // 3. Cargar datos en la interfaz
    cargarDatos();

});