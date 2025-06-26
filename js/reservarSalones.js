import {
  getSalones,
  obtenerServicios,
  getSalonId,
  guardarPresupuestoLocalStorage,
  guardarSalonLocalStorage
} from './utilidades.js'
const formSalon = document.getElementById('formulario-reserva')
const formulario = document.getElementById('contactForm')
const tituloSalon = document.getElementById('titulo-salon')

let identificadorSalon = null
let presupuestoProvisorio = null
let salonPrecio = 0

document.addEventListener('DOMContentLoaded', () => {
  function salonesCards() {
    const contenedor = document.getElementById('salones-container')
    if (!contenedor) return
    const salones = getSalones()
    salones.forEach((salon) => {
      const card = document.createElement('div')
      card.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'card-salon')
      card.estado = salon.estado
      card.nombreSalon = salon.name
      card.id = salon.id
      card.precio = salon.precio
      card.innerHTML = `
    <div class="salon-placeholder d-flex flex-column align-items-center">
      <div class="img-container">
        <img
          src=${
            salon.imageUrls ? salon.imageUrls : './img/imagen_placeholder.jpg'
          }
          alt="Imagen de salón de fiestas"
          class="salon-img"
        />
      </div>
      <p class="nombre-salon">${salon.name}</p>
      <p>${salon.description}</p>
      <p>Capacidad salón: ${salon.capacidad} personas</p>
      <p class="fs-5" >$${salon.precio.toLocaleString('es-AR')}</p>
      <p class="${
        salon.estado === 'disponible' ? 'btn btn-success' : 'btn btn-danger'
      }">
          ${salon.estado.toUpperCase()}</p>
      </div>
    </div>`
      contenedor.appendChild(card)
    })
  }

  // ACA TOMAMOS EL FORMULARIO
  document
    .getElementById('contactForm')
    .addEventListener('submit', function (event) {
      event.preventDefault()
      const nombreCompleto = document.getElementById('nombreCompleto').value
      const fechaEvento = document.getElementById('fechaEvento').value
      const tematica = document.getElementById('tematica').value
      const serviciosSeleccionados = []

      const serviciosCheckBoxes = document.querySelectorAll(
        'input[type="checkbox"][name="servicios"]'
      )

      serviciosCheckBoxes.forEach((cb) => {
        if (cb.checked) {
          serviciosSeleccionados.push({
            nombre: cb.nextElementSibling.textContent.trim(),
            precio: Number(cb.value)
          })
        }
      })

      const valorTotal =
        salonPrecio +
        serviciosSeleccionados.reduce((acc, serv) => acc + serv.precio, 0)

      const presupuesto = {
        id: crypto.randomUUID(),
        nombreCompleto,
        fecha: fechaEvento,
        tematica,
        valorTotal,
        servicios: serviciosSeleccionados
      }

      if (!formulario.checkValidity()) {
        formulario.classList.add('was-validated')
        return
      }

      presupuestoProvisorio = presupuesto

      //

      const modalParrafo = document.getElementById('parrafoPresupuesto')
      modalParrafo.innerHTML = `
  <p><strong>Nombre:</strong> ${presupuesto.nombreCompleto}</p>
  <p><strong>Fecha del Evento:</strong> ${presupuesto.fecha}</p>
  <p><strong>Temática:</strong> ${presupuesto.tematica}</p>
  <p><strong>Servicios Seleccionados:</strong></p>
  <ul>
    ${presupuesto.servicios
      .map(
        (serv) => `
      <li>${serv.nombre}</li>
    `
      )
      .join('')}
  </ul>
  <p class="mt-3">
    El costo total del salón más los servicios seleccionados es de 
    <span class='fw-bold'>$${presupuesto.valorTotal.toLocaleString(
      'es-AR'
    )}</span>
  </p>
`
      const confirmModal = new bootstrap.Modal(
        document.getElementById('confirmModal')
      )
      confirmModal.show()
    })

  // ACA TOMAMOS EL BOTON PARA CONFIRMAR
  document.getElementById('confirmar-reserva').addEventListener('click', () => {
    guardarPresupuestoLocalStorage(presupuestoProvisorio)
    const salon = getSalonId(identificadorSalon)
    salon.estado = 'reservado'
    guardarSalonLocalStorage(salon)
    console.log('Presupuesto provisorio generado:', presupuestoProvisorio)
    window.location.reload()
  })

  salonesCards()
  const cardSalon = document.getElementsByClassName('card-salon')
  for (let card of cardSalon) {
    if (card.estado === 'disponible') {
      card.addEventListener('click', () => {
        tituloSalon.textContent = card.nombreSalon
        formSalon.style.display = 'block'
        identificadorSalon = card.id
        salonPrecio = card.precio
        formSalon.scrollIntoView({ behavior: 'smooth' })
        formulario.reset()
      })
    } else {
      card.addEventListener('click', () => {
        formSalon.style.display = 'none'
      })
    }
  }
  const servicios = obtenerServicios()

  function crearInput(labelText, type, id) {
    const div = document.createElement('div')
    div.className = 'mb-3'

    const label = document.createElement('label')
    label.textContent = labelText
    label.className = 'form-label'
    label.setAttribute('for', id)

    const input = document.createElement('input')
    input.className = 'form-control'
    input.type = type
    input.id = id
    input.required = true

    div.appendChild(label)
    div.appendChild(input)
    return div
  }

  formulario.appendChild(
    crearInput('Apellido y Nombre', 'text', 'nombreCompleto')
  )
  formulario.appendChild(crearInput('Fecha del Evento', 'date', 'fechaEvento'))
  formulario.appendChild(crearInput('Temática', 'text', 'tematica'))

  if (servicios) {
    const parrafo = document.createElement('p')
    parrafo.textContent = 'Seleccioná los servicios que desees contratar.'
    formulario.appendChild(parrafo)

    servicios.forEach((serv, index) => {
      const div = document.createElement('div')
      div.className = 'form-check'

      const input = document.createElement('input')
      input.className = 'form-check-input'
      input.type = 'checkbox'
      input.value = serv.price
      input.id = `servicio-${index}`
      input.name = 'servicios'

      const label = document.createElement('label')
      label.className = 'form-check-label'
      label.setAttribute('for', input.id)

      const span = document.createElement('span')
      span.className = 'fw-semibold'
      span.textContent = `${serv.name}: `

      label.appendChild(span)
      label.appendChild(
        document.createTextNode(`${serv.description} - $${serv.price}`)
      )

      div.appendChild(input)
      div.appendChild(label)
      formulario.appendChild(div)
    })
  }
  const botonFromulario = document.createElement('button')
  botonFromulario.textContent = 'Pedir Presupuesto'
  botonFromulario.type = 'submit'
  botonFromulario.classList.add('btn', 'btn-primary', 'mt-3')
  formulario.appendChild(botonFromulario)
})
