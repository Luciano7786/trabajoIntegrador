document.addEventListener('DOMContentLoaded', () => {
  // --- ELEMENTOS DEL DOM ---
  const tbody = document.getElementById('cuerpoTablaPresupuesto')
  const mensajeSinPresupuesto = document.getElementById('mensajeSinPresupuesto')
  const contenedorAlerta = document.getElementById(
    'contenedorAlertaPresupuesto'
  )

  const STORAGE_KEY = 'presupuesto'

  function obtenerPresupuestos() {
    const presupuestosGuardados = localStorage.getItem(STORAGE_KEY)
    return presupuestosGuardados ? JSON.parse(presupuestosGuardados) : []
  }

  function guardarPresupuestos(presupuestos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presupuestos))
  }

  function mostrarAlerta(mensaje, tipo = 'success') {
    contenedorAlerta.innerHTML = `
      <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `

    setTimeout(() => {
      const alertNode = contenedorAlerta.querySelector('.alert')
      if (alertNode) {
        new bootstrap.Alert(alertNode).close()
      }
    }, 4000)
  }

  function renderizarTabla() {
    tbody.innerHTML = ''
    const presupuestos = obtenerPresupuestos()

    if (presupuestos.length === 0) {
      mensajeSinPresupuesto.style.display = 'block'
    } else {
      mensajeSinPresupuesto.style.display = 'none'

      presupuestos.forEach((presupuesto) => {
        const tr = document.createElement('tr')
        tr.innerHTML = `
          <td data-label="ID">
            <span class="id-corto">${presupuesto.id.substring(0, 8)}...</span>
          </td>
          <td data-label="Nombre">${presupuesto.nombreCompleto}</td>
          <td data-label="Fecha">${new Date(
            presupuesto.fecha + 'T00:00:00'
          ).toLocaleDateString('es-AR')}</td>
          <td data-label="Precio">${presupuesto.valorTotal.toLocaleString(
            'es-AR',
            { style: 'currency', currency: 'ARS' }
          )}</td>
          <td data-label="Acciones">
            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${
              presupuesto.id
            }" title="Eliminar presupuesto">
                Eliminar
            </button>
          </td>
        `
        tbody.appendChild(tr)
      })
    }
  }

  function manejarClickTabla(event) {
    if (event.target.classList.contains('btn-eliminar')) {
      const idAEliminar = event.target.dataset.id

      if (confirm('¿Estás seguro de que deseas eliminar este presupuesto?')) {
        let presupuestos = obtenerPresupuestos()

        presupuestos = presupuestos.filter((p) => p.id !== idAEliminar)

        guardarPresupuestos(presupuestos)

        renderizarTabla()

        mostrarAlerta('Presupuesto eliminado con éxito.', 'success')
      }
    }
  }

  tbody.addEventListener('click', manejarClickTabla)
  renderizarTabla()
})
