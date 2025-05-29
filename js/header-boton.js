import { obtenerUsuarioLocalStorage } from "./utilidades.js";

const usuario = obtenerUsuarioLocalStorage()

const ulNavbar = document.getElementById('ul-navbar')

if (!usuario) {

  const li = document.createElement('li')
  li.classList.add('av-item', 'p-2', 'm-2', 'hover-effect-list-item')
  const a = document.createElement('a')
  a.href = 'login.html'
  a.classList.add('nav-link', 'text-white', 'text-center')
  a.textContent = 'Iniciar Sesión'
  li.appendChild(a)
  ulNavbar.appendChild(li)

} else {
  const liRegistrarSalon = document.createElement('li')
  liRegistrarSalon.classList.add('av-item', 'p-2', 'm-2'  , 'hover-effect-list-item')
  const aRegistrarSalon = document.createElement('a')
  aRegistrarSalon.classList.add('nav-link', 'text-white', 'text-center')
  aRegistrarSalon.textContent = 'Registrar Salón'
  aRegistrarSalon.href = './altaSalones.html'
  liRegistrarSalon.appendChild(aRegistrarSalon)
  ulNavbar.appendChild(liRegistrarSalon)
  const li = document.createElement('li')
  li.classList.add('av-item', 'p-2', 'm-2'  , 'hover-effect-list-item')
  const boton = document.createElement('button')
  boton.classList.add('nav-link', 'text-white', 'text-center')
  boton.textContent = 'Cerrar Sesión'
  li.appendChild(boton)
  ulNavbar.appendChild(li)
  const liContacto = document.getElementById('li-contacto').remove()

  boton.addEventListener('click', () => {
    localStorage.clear()
    window.location = 'login.html'
  })
}
