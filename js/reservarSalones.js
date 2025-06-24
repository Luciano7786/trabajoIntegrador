import {getSalones} from './utilidades.js'


const formSalon = document.getElementById('formulario-reserva')
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
});


