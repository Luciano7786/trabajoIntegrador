import {getSalones, obtenerServicios} from './utilidades.js'
const formSalon = document.getElementById('formulario-reserva')
const formulario = document.getElementById('contactForm')
export function salonesCards() {
  const contenedor = document.getElementById('salones-container')
  if (!contenedor) return
  const salones = getSalones()  

  salones.forEach((salon) => {
    const card = document.createElement('div')
    card.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'card-salon')

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
      <p>${salon.precio}</p>
      <p class="${salon.estado === 'disponible' ? 'btn btn-success' : 'btn btn-danger'}">
          ${salon.estado.toUpperCase()}</p>
      </div>
    </div>`
    contenedor.appendChild(card)
  })
}
document.getElementById('contactForm').addEventListener('submit', function(event) 
{event.preventDefault(); 
const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
confirmModal.show();
});

document.addEventListener('DOMContentLoaded', ()=>{
    salonesCards()
    const cardSalon = document.getElementsByClassName('card-salon');
    for (let card of cardSalon) {
        card.addEventListener('click', () => {
        formSalon.style.display = 'block';
    });
    }
    
    const servicio = obtenerServicios()
    servicio.forEach(serv=>{
    formulario.innerHTML += `
      <div class="form-check">
            <input class="form-check-input" type="checkbox" value=${serv.price} id="comidaLunch" name="servicios">
            <label class="form-check-label" for="comidaLunch">
              ${serv.description} - $${serv.price}
            </label>
      </div>`
    })
    formulario.innerHTML += `
      <button type="submit" class="btn btn-primary">Pedir Presupuesto</button>`

const serviciosCheckBoxes = document.querySelectorAll('input[type="checkbox"][name="servicios"]');

serviciosCheckBoxes.forEach(cb => {
  cb.addEventListener('change', () => {
    let total = 0;
    serviciosCheckBoxes.forEach(box => {
      if (box.checked) {
        total += parseInt(box.value);
      }
    });
    const modal = document.getElementById('parrafoPresupuesto')
    modal.textContent=`
    El costo total del salón más los servicios seleccionados es de $${total.toLocaleString('es-AR')}`
  });
});
});



