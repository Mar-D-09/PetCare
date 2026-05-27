document.addEventListener("DOMContentLoaded", () => {

  // ---------- Elementos del DOM ----------
  const listaMascotasEl = document.getElementById("listaMascotas");
  const infoMascotaEl = document.getElementById("infoMascota");
  const panelAccionesEl = document.getElementById("panelAcciones");

  const btnAgregarMascota = document.getElementById("btnAgregarMascota");
  const modalMascota = document.getElementById("modalMascota");
  const guardarMascota = document.getElementById("guardarMascota");

  const btnAgregarCita = document.getElementById("btnAgregarCita");
  const modalCita = document.getElementById("modalCita");
  const guardarCita = document.getElementById("guardarCita");

  const btnRecordatorio = document.getElementById("btnRecordatorio");
  const modalRecordatorio = document.getElementById("modalRecordatorio");
  const guardarRecordatorio = document.getElementById("guardarRecordatorio");

  const btnCarnetVacunas = document.getElementById("btnCarnetVacunas");

  // ---------- Keys en localStorage ----------
  const keyMascotas = "mascotas";
  const keyCitas = "citas";
  const keyRec = "recordatorios";
  const keySel = "mascotaSeleccionadaId";

  // ---------- Helpers storage ----------
  const obtener = (k) => JSON.parse(localStorage.getItem(k)) || [];
  const guardar = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  // ---------- Navegación carnet ----------
  if (btnCarnetVacunas) {
    btnCarnetVacunas.addEventListener("click", () => {
      const selectedId = localStorage.getItem(keySel);
      if (selectedId) {
        window.location.href = `carnet.html?id=${selectedId}`;
      } else {
        alert("Por favor, selecciona una mascota en el panel izquierdo primero.");
      }
    });
  }

  // ---------- Seleccionar mascota (una sola definición) ----------
  function seleccionarMascota(id) {
    localStorage.setItem(keySel, String(id));
    renderInfoMascota();
    renderAcciones();
  }

  // ---------- Render: lista de mascotas (izquierda) ----------
  function renderizarMascotas() {
    const mascotas = obtener(keyMascotas);
    listaMascotasEl.innerHTML = "";

    if (!mascotas.length) {
      listaMascotasEl.innerHTML = `<p>No hay mascotas. Agrega una :)</p>`;
      return;
    }

    mascotas.forEach((m) => {
      const card = document.createElement("div");
      card.className = "mascota-card";
      card.dataset.id = m.id;
      card.innerHTML = `
        <span>${m.nombre}</span>
        <button class="btn-eliminar" title="Eliminar mascota">🗑️</button>
      `;

      // seleccionar mascota (si no se clickea el boton eliminar)
      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-eliminar")) return;
        seleccionarMascota(m.id);
      });

      // eliminar mascota
      const btnEliminar = card.querySelector(".btn-eliminar");
      if (btnEliminar) {
        btnEliminar.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!confirm(`¿Eliminar a ${m.nombre}?`)) return;
          eliminarMascota(m.id);
        });
      }

      listaMascotasEl.appendChild(card);
    });

    // seleccionar la anteriormente seleccionada (si existe)
    const idPrevia = localStorage.getItem(keySel);
    if (idPrevia) seleccionarMascota(idPrevia);
  }

  // ---------- Render info mascota (centro) ----------
  function renderInfoMascota() {
    const sel = localStorage.getItem(keySel);
    if (!sel) {
      infoMascotaEl.innerHTML = `<p>Selecciona una mascota para ver su información.</p>`;
      return;
    }

    const mascotas = obtener(keyMascotas);
    const m = mascotas.find(x => String(x.id) === String(sel));
    if (!m) {
      infoMascotaEl.innerHTML = `<p>La mascota seleccionada no existe.</p>`;
      return;
    }

    infoMascotaEl.innerHTML = `
      <div class="detalle-mascota">
        <h3>${m.nombre}</h3>
        <p><strong>Especie:</strong> ${m.tipo || "-"}</p>
        <p><strong>Edad:</strong> ${m.edad || "-"}</p>
        <div id="info-mas-detalles"></div>
      </div>
      <hr>
      <div id="lista-citas-central"></div>
      <div id="lista-record-central"></div>
    `;

    renderCitasCentral();
    renderRecordCentral();
  }

  // ---------- Render acciones (derecha) ----------
  function renderAcciones() {
    const sel = localStorage.getItem(keySel);
    if (!sel) {
      panelAccionesEl.innerHTML = `<p>Selecciona una mascota para ver acciones.</p>`;
      return;
    }

    const mascotas = obtener(keyMascotas);
    const m = mascotas.find(x => String(x.id) === String(sel));
    if (!m) {
      panelAccionesEl.innerHTML = `<p>Selecciona una mascota válida.</p>`;
      return;
    }

    panelAccionesEl.innerHTML = `
      <p><strong>Acciones para:</strong> ${m.nombre}</p>
      <button id="accion-agregar-cita" class="btn-petcare w-100">➕ Agregar cita</button>
      <button id="accion-recordatorio" class="btn-petcare w-100">📌 Nuevo recordatorio</button>
      <button id="accion-carnet" class="btn-petcare w-100">💉 Abrir carnet</button>
    `;

    const aCita = document.getElementById("accion-agregar-cita");
    const aRec = document.getElementById("accion-recordatorio");
    const aCarnet = document.getElementById("accion-carnet");

    if (aCita) aCita.addEventListener("click", () => abrirModalCita());
    if (aRec) aRec.addEventListener("click", () => abrirModalRecordatorio());
    if (aCarnet) aCarnet.addEventListener("click", () => abrirCarnet());
  }

  // ---------- CRUD mascota ----------
  function eliminarMascota(id) {
    const ms = obtener(keyMascotas).filter(m => String(m.id) !== String(id));
    guardar(keyMascotas, ms);

    // Eliminar citas y recordatorios relacionados
    guardar(keyCitas, obtener(keyCitas).filter(c => String(c.mascotaId) !== String(id)));
    guardar(keyRec, obtener(keyRec).filter(r => String(r.mascotaId) !== String(id)));

    // Si era la seleccionada, quitar seleccion
    if (localStorage.getItem(keySel) === String(id)) {
      localStorage.removeItem(keySel);
      infoMascotaEl.innerHTML = `<p>Selecciona una mascota para ver su información.</p>`;
      panelAccionesEl.innerHTML = `<p>Selecciona una mascota para ver acciones.</p>`;
    }

    renderizarMascotas();
  }

  // ---------- Modales abrir/cerrar ----------
  function abrirModalMascota() { modalMascota && modalMascota.classList.remove("oculto"); }
  function abrirModalCita() { modalCita && modalCita.classList.remove("oculto"); }
  function abrirModalRecordatorio() { modalRecordatorio && modalRecordatorio.classList.remove("oculto"); }
  function cerrarModales() {
    modalMascota && modalMascota.classList.add("oculto");
    modalCita && modalCita.classList.add("oculto");
    modalRecordatorio && modalRecordatorio.classList.add("oculto");
  }
  window.cerrarModales = cerrarModales;

  // abrir carnet (nueva página)
  function abrirCarnet() {
    const sel = localStorage.getItem(keySel);
    if (!sel) return alert("Selecciona una mascota primero");
    window.location.href = `carnet.html?id=${sel}`;
  }
  window.abrirCarnet = abrirCarnet;

  // ---------- Guardar mascota ----------
  if (btnAgregarMascota) btnAgregarMascota.addEventListener("click", (e) => { e.preventDefault(); abrirModalMascota(); });

  if (guardarMascota) {
    guardarMascota.addEventListener("click", (e) => {
      e.preventDefault();
      const nombre = (document.getElementById("mascota-nombre") || {}).value || "";
      const tipo = (document.getElementById("mascota-tipo") || {}).value || "";
      const edad = (document.getElementById("mascota-edad") || {}).value || "";

      if (!nombre || !tipo || !edad) return alert("Completa todos los campos de la mascota");

      const nueva = { id: Date.now(), nombre, tipo, edad };
      const ms = obtener(keyMascotas);
      ms.push(nueva);
      guardar(keyMascotas, ms);

      cerrarModales();
      renderizarMascotas();
      seleccionarMascota(nueva.id);
    });
  }

  // ---------- Guardar cita ----------
  if (btnAgregarCita) btnAgregarCita.addEventListener("click", (e) => { e.preventDefault(); abrirModalCita(); });

  if (guardarCita) {
    guardarCita.addEventListener("click", (e) => {
      e.preventDefault();
      const motivo = (document.getElementById("cita-motivo") || {}).value || "";
      const fecha = (document.getElementById("cita-fecha") || {}).value || "";
      const hora = (document.getElementById("cita-hora") || {}).value || "";

      if (!motivo || !fecha) return alert("Completa motivo y fecha de la cita");

      const sel = localStorage.getItem(keySel);
      if (!sel) return alert("Selecciona una mascota primero");

      const citas = obtener(keyCitas);
      citas.push({ id: Date.now(), mascotaId: sel, motivo, fecha, hora });
      guardar(keyCitas, citas);

      cerrarModales();
      renderCitasCentral();
      renderizarMascotas();
      alert("Cita guardada ✅");
    });
  }

  // ---------- Guardar recordatorio ----------
  if (btnRecordatorio) btnRecordatorio.addEventListener("click", (e) => { e.preventDefault(); abrirModalRecordatorio(); });

  if (guardarRecordatorio) {
    guardarRecordatorio.addEventListener("click", (e) => {
      e.preventDefault();
      const tipo = (document.getElementById("recordatorio-tipo") || {}).value || "";
      const fecha = (document.getElementById("recordatorio-fecha") || {}).value || "";
      const hora = (document.getElementById("recordatorio-hora") || {}).value || "";

      if (!tipo || !fecha) return alert("Completa tipo y fecha");

      const sel = localStorage.getItem(keySel);
      if (!sel) return alert("Selecciona una mascota primero");

      const recs = obtener(keyRec);
      recs.push({ id: Date.now(), mascotaId: sel, tipo, fecha, hora });
      guardar(keyRec, recs);

      cerrarModales();
      renderRecordCentral();
      alert("Recordatorio guardado");
    });
  }

  // ---------- Render Citas y Recordatorios en la columna central ----------
  function renderCitasCentral() {
    const sel = localStorage.getItem(keySel);
    const cont = document.getElementById("lista-citas-central");
    if (!cont) return;
    const citas = obtener(keyCitas).filter(c => String(c.mascotaId) === String(sel));
    if (!citas.length) {
      cont.innerHTML = "<p>No hay citas registradas para esta mascota.</p>";
      return;
    }
    cont.innerHTML = "";
    citas.forEach(c => {
      const div = document.createElement("div");
      div.className = "tarjeta tarjeta-cita";
      div.innerHTML = `<strong>${c.motivo}</strong><br>${c.fecha} ${c.hora || ""} <button class="elimina-cita" data-id="${c.id}">🗑️</button>`;
      cont.appendChild(div);
    });
    cont.querySelectorAll(".elimina-cita").forEach(b => {
      b.addEventListener("click", () => {
        const id = b.dataset.id;
        guardar(keyCitas, obtener(keyCitas).filter(x => String(x.id) !== String(id)));
        renderCitasCentral();
      });
    });
  }

  function renderRecordCentral() {
    const sel = localStorage.getItem(keySel);
    const cont = document.getElementById("lista-record-central");
    if (!cont) return;
    const recs = obtener(keyRec).filter(r => String(r.mascotaId) === String(sel));
    if (!recs.length) {
      cont.innerHTML = "<p>No hay recordatorios para esta mascota.</p>";
      return;
    }
    cont.innerHTML = "";
    recs.forEach(r => {
      const div = document.createElement("div");
      div.className = "tarjeta tarjeta-record";
      div.innerHTML = `<strong>${r.tipo}</strong><br>${r.fecha} ${r.hora || ""} <button class="elimina-rec" data-id="${r.id}">🗑️</button>`;
      cont.appendChild(div);
    });
    cont.querySelectorAll(".elimina-rec").forEach(b => {
      b.addEventListener("click", () => {
        const id = b.dataset.id;
        guardar(keyRec, obtener(keyRec).filter(x => String(x.id) !== String(id)));
        renderRecordCentral();
      });
    });
  }

  // ---------- Inicialización ----------
  renderizarMascotas();
  renderInfoMascota();
  renderAcciones();

}); // DOMContentLoaded
