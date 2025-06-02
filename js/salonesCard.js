export function obtenerSalones() {
  return JSON.parse(localStorage.getItem('salonesInfantiles')) || []
}

export function salonesCards() {
  const contenedor = document.getElementById('salones-container')
  if (!contenedor) return
  const salones = obtenerSalones()  

  salones.forEach((salon) => {
    const card = document.createElement('div')
    card.classList.add('col-lg-3', 'col-md-4', 'col-sm-6')

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
      </div>
    </div>`
    contenedor.appendChild(card)
  })
}

document.addEventListener('DOMContentLoaded', salonesCards)
