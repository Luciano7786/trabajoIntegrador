import { getSalones, obtenerServicios, getSalonId, guardarPresupuestoLocalStorage, obtenerPresupuestoLocalStorage } from './utilidades.js'
const formSalon = document.getElementById('formulario-reserva')
const formulario = document.getElementById('contactForm')

let salonPrecio = 0
let total = 'total'
document.addEventListener('DOMContentLoaded', () => {
  function salonesCards() {
    const contenedor = document.getElementById('salones-container')
    if (!contenedor) return
    const salones = getSalones()

    console.log(salones)
    console.log(obtenerPresupuestoLocalStorage())
    salones.forEach((salon) => {  
      const card = document.createElement('div')
      card.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'card-salon')
      card.id = salon.id
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
        serviciosSeleccionados.reduce((acc, serv) => acc + Number(serv.precio), 0)


      const presupuesto = {
        id: crypto.randomUUID(),
        nombreCompleto,
        fecha: fechaEvento,
        tematica,
        valorTotal,
        servicios: serviciosSeleccionados
      }

      guardarPresupuestoLocalStorage(presupuesto)

      const modal = document.getElementById('parrafoPresupuesto')
      modal.innerHTML = `<p>
    El costo total del salón más los servicios seleccionados es de <span class='fw-bold'>$${presupuesto.valorTotal.toLocaleString(
      'es-AR'
    )}</span></p>`  

      console.log('Presupuesto generado:', presupuesto)
      const confirmModal = new bootstrap.Modal(
        document.getElementById('confirmModal')
      )
      confirmModal.show()
    })

  salonesCards()
  const cardSalon = document.getElementsByClassName('card-salon')
  for (let card of cardSalon) {
    card.addEventListener('click', () => {
      formSalon.style.display = 'block'
      const idSalon = card.id
      const salon = getSalonId(idSalon)
      salonPrecio = salon.precio
      formSalon.scrollIntoView({ behavior: 'smooth' })
      formulario.reset()
      console.log(salonPrecio)
    })
  }
  const servicios = obtenerServicios()
  formulario.innerHTML += `
          <h2>Pedinos tu presupuesto</h2>

  <div class="mb-3">
    <label for="nombreCompleto" class="form-label">Apellido y Nombre</label>
    <input type="text" class="form-control" id="nombreCompleto" required>
  </div>
  <div class="mb-3">
    <label for="fechaEvento" class="form-label">Fecha del Evento</label>
    <input type="date" class="form-control" id="fechaEvento" required>
  </div>
  <div class="mb-3">
    <label for="tematica" class="form-label">Temática</label>
    <input type="text" class="form-control" id="tematica" required>
  </div>
        `
 
  if (servicios){
     formulario.innerHTML += `
          <p>Seleccioná los servicios que desees contratar.</p>`
    servicios.forEach((serv) => {
        formulario.innerHTML += `
          <div class="form-check">
                <input class="form-check-input" type="checkbox" value=${serv.price} id="comidaLunch" name="servicios">
                <label class="form-check-label" for="comidaLunch">
                  <span class="fw-semibold" >${serv.name}: </span> ${serv.description} - $${serv.price}
                </label>
          </div>`
  })
  }

  const botonFromulario = document.createElement('button')
  botonFromulario.textContent = 'Pedir Presupuesto'
  botonFromulario.type = 'submit'
  botonFromulario.classList.add('btn', 'btn-primary', 'mt-3')
  formulario.appendChild(botonFromulario)

  // const serviciosCheckBoxes = document.querySelectorAll(
  //   'input[type="checkbox"][name="servicios"]'
  // )


  // serviciosCheckBoxes.forEach((cb) => {
  //   cb.addEventListener('change', (e) => {
  //     console.log(salonPrecio)
  //     const modal = document.getElementById('parrafoPresupuesto')
  //     modal.textContent = `
  //   El costo total del salón más los servicios seleccionados es de $${total.toLocaleString(
  //     'es-AR'
  //   )}`
  //   })
  // })
})
