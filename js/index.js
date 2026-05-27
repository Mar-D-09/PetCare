document.addEventListener("DOMContentLoaded", () => {
    const bInicio = document.getElementById("b-inicio");
    const bVepro = document.getElementById("b-vete-propi");
    const bVeterinario = document.getElementById("b-veterinario");
    const bPropietario = document.getElementById("b-propietario");
    const logo = document.getElementById("logo");

    bVepro.style.display = "none"; // ocultar botones al inicio

    bInicio.addEventListener("click", () => {
        bInicio.style.display = "none";
        logo.style.display = "none";
        bVepro.style.display = "flex";
    });

    bVeterinario.addEventListener("click", () => {
        window.location.href = "veterinario.html";
    });

    bPropietario.addEventListener("click", () => {
        window.location.href = "propietario.html";
    });
});