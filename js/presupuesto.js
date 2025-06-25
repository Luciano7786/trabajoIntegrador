document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTOS DEL DOM ---
  const tbody = document.getElementById("cuerpoTablaPresupuesto");
  const mensajeSinPresupuesto = document.getElementById("mensajeSinPresupuesto");
  const contenedorAlerta = document.getElementById("contenedorAlertaPresupuesto");

  // Clave que usamos para guardar los datos en localStorage.
  // Debe ser la misma que usaste al guardar el presupuesto.
  const STORAGE_KEY = "presupuesto";

  /**
   * Obtiene los presupuestos desde localStorage y los convierte a un objeto JavaScript.
   * Si no hay nada, devuelve un array vacío.
   * @returns {Array} Array de objetos de presupuesto.
   */
  function obtenerPresupuestos() {
    const presupuestosGuardados = localStorage.getItem(STORAGE_KEY);
    return presupuestosGuardados ? JSON.parse(presupuestosGuardados) : [];
  }

  /**
   * Guarda el array de presupuestos en localStorage.
   * @param {Array} presupuestos - El array de presupuestos a guardar.
   */
  function guardarPresupuestos(presupuestos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presupuestos));
  }

  /**
   * Muestra una alerta de Bootstrap temporal.
   * @param {string} mensaje - El texto a mostrar en la alerta.
   * @param {string} tipo - El tipo de alerta de Bootstrap (e.g., 'success', 'danger').
   */
  function mostrarAlerta(mensaje, tipo = "success") {
    contenedorAlerta.innerHTML = `
      <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    // Opcional: hacer que la alerta desaparezca sola después de unos segundos
    setTimeout(() => {
      const alertNode = contenedorAlerta.querySelector(".alert");
      if (alertNode) {
        new bootstrap.Alert(alertNode).close();
      }
    }, 4000);
  }

  /**
   * Renderiza la tabla con los datos de los presupuestos.
   */
  function renderizarTabla() {
    // Limpiamos el contenido anterior de la tabla
    tbody.innerHTML = "";
    const presupuestos = obtenerPresupuestos();

    if (presupuestos.length === 0) {
      // Si no hay presupuestos, mostramos el mensaje y ocultamos la tabla (implícitamente)
      mensajeSinPresupuesto.style.display = "block";
    } else {
      // Si hay presupuestos, ocultamos el mensaje y llenamos la tabla
      mensajeSinPresupuesto.style.display = "none";

      presupuestos.forEach((presupuesto) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td data-label="ID">
            <span class="id-corto">${presupuesto.id.substring(0, 8)}...</span>
          </td>
          <td data-label="Nombre">${presupuesto.nombreCompleto}</td>
          <td data-label="Fecha">${new Date(
            presupuesto.fecha + "T00:00:00"
          ).toLocaleDateString("es-AR")}</td>
          <td data-label="Precio">${presupuesto.valorTotal.toLocaleString(
            "es-AR",
            { style: "currency", currency: "ARS" }
          )}</td>
          <td data-label="Acciones">
            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${
              presupuesto.id
            }" title="Eliminar presupuesto">
                Eliminar
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  /**
   * Maneja el evento de click en la tabla para delegar la acción de eliminar.
   * @param {Event} event - El objeto del evento de click.
   */
  function manejarClickTabla(event) {
    // Verificamos si el elemento clickeado es un botón de eliminar
    if (event.target.classList.contains("btn-eliminar")) {
      const idAEliminar = event.target.dataset.id;

      // Pedimos confirmación al usuario
      if (confirm("¿Estás seguro de que deseas eliminar este presupuesto?")) {
        // Obtenemos la lista actual de presupuestos
        let presupuestos = obtenerPresupuestos();
        // Creamos una nueva lista excluyendo el que queremos eliminar
        presupuestos = presupuestos.filter((p) => p.id !== idAEliminar);
        // Guardamos la nueva lista en localStorage
        guardarPresupuestos(presupuestos);
        // Volvemos a renderizar la tabla para que se actualice la vista
        renderizarTabla();
        // Mostramos una notificación de éxito
        mostrarAlerta("Presupuesto eliminado con éxito.", "success");
      }
    }
  }

  // --- INICIALIZACIÓN ---
  // Añadimos el listener para los clicks en la tabla
  tbody.addEventListener("click", manejarClickTabla);
  // Renderizamos la tabla por primera vez al cargar la página
  renderizarTabla();
});
