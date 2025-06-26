const LS_KEY_SERVICIOS = 'servicios'
let servicios = []
let proximoIdServicio = 1

const formularioServicio = document.getElementById('formularioServicio')
const inputIdServicio = document.getElementById('idServicio')
const inputNombreServicio = document.getElementById('nombreServicio')
const inputDescripcionServicio = document.getElementById('descripcionServicio')
const inputPrecioServicio = document.getElementById('precioServicio')

const cuerpoTablaServicios = document.getElementById('cuerpoTablaServicios')
const tituloFormularioServicio = document.getElementById(
  'etiquetaModalAgregarServicio'
)
const contenedorAlertaServicios = document.getElementById(
  'contenedorAlertaServicios'
)
const mensajeSinServicios = document.getElementById('mensajeSinServicios')

const modalAgregarServicio = new bootstrap.Modal(
  document.getElementById('modalAgregarServicio')
)

const botonCancelarModalServicio = document.getElementById(
  'botonCancelarModalServicio'
)

function mostrarAlertaServicio(mensaje, tipo = 'success') {
  const htmlAlerta = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `
  contenedorAlertaServicios.innerHTML = htmlAlerta
  setTimeout(() => {
    const elementoAlerta = contenedorAlertaServicios.querySelector('.alert')
    if (elementoAlerta) {
      bootstrap.Alert.getInstance(elementoAlerta)?.close()
    }
  }, 5000)
}

function cargarServiciosDesdeLocalStorage() {
  const data = localStorage.getItem(LS_KEY_SERVICIOS)
  if (data) {
    servicios = JSON.parse(data)
    if (servicios.length > 0) {
      proximoIdServicio = Math.max(...servicios.map((s) => s.id)) + 1
    }
  } else {
    servicios = []
    proximoIdServicio = 1
  }
}

function guardarServiciosEnLocalStorage() {
  localStorage.setItem(LS_KEY_SERVICIOS, JSON.stringify(servicios))
}

function limpiarFormularioServicio() {
  inputIdServicio.value = ''
  inputNombreServicio.value = ''
  inputDescripcionServicio.value = ''
  inputPrecioServicio.value = ''
  formularioServicio.classList.remove('was-validated')
}

function mostrarServicios(serviciosFiltrados = servicios) {
  cuerpoTablaServicios.innerHTML = ''
  if (serviciosFiltrados.length === 0) {
    mensajeSinServicios.style.display = 'block'
    return
  }
  mensajeSinServicios.style.display = 'none'

  serviciosFiltrados.forEach((servicio) => {
    const fila = document.createElement('tr')
    fila.innerHTML = `
            <td data-label="ID:">${servicio.id}</td>
            <td data-label="Nombre:">${servicio.name}</td>
            <td data-label="Descripción:">${servicio.description}</td>
            <td data-label="Precio:">$${servicio.price.toFixed(2)}</td>
            <td class="actions-cell" data-label="Acciones:">
                <div>
                    <button type="button" class="btn btn-link btn-sm text-decoration-none" onclick="editarServicio(${
                      servicio.id
                    })" title="Editar Servicio">
                        <i class="bi bi-pencil-square"></i> <span class="d-none d-md-inline">Editar</span>
                    </button>
                    <button type="button" class="btn btn-link btn-sm text-danger text-decoration-none" onclick="eliminarServicio(${
                      servicio.id
                    })" title="Eliminar Servicio">
                        <i class="bi bi-trash"></i> <span class="d-none d-md-inline">Eliminar</span>
                    </button>
                </div>
            </td>
        `
    cuerpoTablaServicios.appendChild(fila)
  })
}

formularioServicio.addEventListener('submit', (event) => {
  event.preventDefault()

  if (!formularioServicio.checkValidity()) {
    event.stopPropagation()
    formularioServicio.classList.add('was-validated')
    mostrarAlertaServicio(
      'Por favor, completa todos los campos obligatorios.',
      'danger'
    )
    return
  }

  const id = inputIdServicio.value
  const nombre = inputNombreServicio.value.trim()
  const descripcion = inputDescripcionServicio.value.trim()
  const precio = parseFloat(inputPrecioServicio.value)

  if (isNaN(precio) || precio <= 0) {
    mostrarAlertaServicio('El precio debe ser un número positivo.', 'danger')
    return
  }

  if (id) {
    const indice = servicios.findIndex((s) => s.id === parseInt(id))
    if (indice !== -1) {
      servicios[indice] = {
        id: parseInt(id),
        name: nombre,
        description: descripcion,
        price: precio
      }
      mostrarAlertaServicio('Servicio actualizado exitosamente!', 'success')
    } else {
      mostrarAlertaServicio(
        'Error: Servicio no encontrado para editar.',
        'danger'
      )
    }
  } else {
    const nuevoServicio = {
      id: proximoIdServicio++,
      name: nombre,
      description: descripcion,
      price: precio
    }
    servicios.push(nuevoServicio)
    mostrarAlertaServicio('Servicio agregado exitosamente!', 'success')
  }

  guardarServiciosEnLocalStorage()
  mostrarServicios()
  limpiarFormularioServicio()
  modalAgregarServicio.hide()
})

window.editarServicio = function (id) {
  const servicio = servicios.find((s) => s.id === id)
  if (servicio) {
    inputIdServicio.value = servicio.id
    inputNombreServicio.value = servicio.name
    inputDescripcionServicio.value = servicio.description
    inputPrecioServicio.value = servicio.price
    tituloFormularioServicio.textContent = 'Editar Servicio'
    modalAgregarServicio.show()
    formularioServicio.classList.remove('was-validated')
  } else {
    mostrarAlertaServicio('Servicio no encontrado para edición.', 'danger')
  }
}

window.eliminarServicio = function (id) {
  if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
    servicios = servicios.filter((servicio) => servicio.id !== id)
    guardarServiciosEnLocalStorage()
    mostrarServicios()
    mostrarAlertaServicio('Servicio eliminado exitosamente!', 'success')
    limpiarFormularioServicio()
  }
}

document
  .getElementById('modalAgregarServicio')
  .addEventListener('show.bs.modal', function () {
    if (inputIdServicio.value === '') {
      limpiarFormularioServicio()
      tituloFormularioServicio.textContent = 'Nuevo Servicio'
    }
    formularioServicio.classList.remove('was-validated')
  })

botonCancelarModalServicio.addEventListener('click', () => {
  limpiarFormularioServicio()
  mostrarAlertaServicio('Operación de servicio cancelada.', 'info')
})

document.addEventListener('DOMContentLoaded', () => {
  cargarServiciosDesdeLocalStorage()
  mostrarServicios()
})  
