import { obtenerUsuarioLocalStorage } from "./utilidades.js";
document.addEventListener('DOMContentLoaded', () => {

  const usuario = obtenerUsuarioLocalStorage()
  
  const ulNavbar = document.getElementById('ul-navbar')
  
  if (!usuario) {
  
    const li = document.createElement('li')
    li.classList.add('nav-item', 'p-2', 'm-2', 'hover-effect-list-item')
    const a = document.createElement('a')
    a.href = 'login.html'
    a.classList.add('nav-link', 'text-white', 'text-center')
    a.textContent = 'Iniciar Sesión'
    li.appendChild(a)
    ulNavbar.appendChild(li)
  
  } else {
    const liRegistrarSalon = document.createElement('li')
    liRegistrarSalon.classList.add('nav-item', 'p-2', 'm-2', 'hover-effect-list-item')
    const aRegistrarSalon = document.createElement('a')
    aRegistrarSalon.classList.add('nav-link', 'text-white', 'text-center')
    aRegistrarSalon.textContent = 'Registrar Salón'
    aRegistrarSalon.href = './altaSalones.html'
    liRegistrarSalon.appendChild(aRegistrarSalon)
    ulNavbar.appendChild(liRegistrarSalon)
    const li = document.createElement('li')
    li.classList.add('nav-item', 'p-2', 'm-2', 'hover-effect-list-item')
    const boton = document.createElement('a')
    boton.textContent = 'Cerrar Sesión'
    boton.classList.add('nav-link', 'text-white', 'text-center')
    boton.style.cursor = 'pointer'
    const liContacto = document.getElementById('li-contacto').remove()
    
    boton.addEventListener('click', () => {
      localStorage.removeItem('usuario')
      window.location.href = 'login.html'
    })
    li.appendChild(boton)
    ulNavbar.appendChild(li)
  }

})
