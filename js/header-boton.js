import { obtenerUsuarioSessionStorage, borrarSessionStorage } from "./utilidades.js";
const usuario = obtenerUsuarioSessionStorage();

document.addEventListener("DOMContentLoaded", () => {

  const ulNavbar = document.getElementById("ul-navbar");

  if (!usuario) {
    const li = document.createElement("li");
    li.classList.add("nav-item", "p-2", "m-2", "hover-effect-list-item");
    const a = document.createElement("a");
    a.href = "login.html";
    a.classList.add("nav-link", "text-white", "text-center");
    a.textContent = "Iniciar Sesión";
    li.appendChild(a);
    ulNavbar.appendChild(li);
  } else if( usuario.role === 'admin' ){
    const liRegistrarSalon = document.createElement("li");
    liRegistrarSalon.classList.add(
      "nav-item",
      "p-2",  
      "m-2",  
      "hover-effect-list-item"  
    );
    const aRegistrarSalon = document.createElement("a");
    aRegistrarSalon.classList.add("nav-link", "text-white", "text-center");
    aRegistrarSalon.textContent = "Registrar Salón";
    aRegistrarSalon.href = "./altaSalones.html";
    liRegistrarSalon.appendChild(aRegistrarSalon);
    ulNavbar.appendChild(liRegistrarSalon);
    const li = document.createElement("li");
    li.classList.add("nav-item", "p-2", "m-2", "hover-effect-list-item");
    const boton = document.createElement("a");
    boton.textContent = "Cerrar Sesión";
    boton.classList.add("nav-link", "text-white", "text-center");
    boton.style.cursor = "pointer";
    const liContacto = document.getElementById("li-contacto").remove();

    boton.addEventListener("click", () => {
      borrarSessionStorage()
      window.location.href = "login.html";
    });
    li.appendChild(boton);
    ulNavbar.appendChild(li);
  } else if(usuario.role === 'user') {
    const liReservarSalon = document.createElement('li')
    liReservarSalon.classList.add(
      'nav-item',
      'p-2',
      'm-2',
      'hover-effect-list-item'
    )
    const aReservarSalon = document.createElement('a')
    aReservarSalon.classList.add('nav-link', 'text-white', 'text-center')
    aReservarSalon.textContent = 'Reservar Salón'
    aReservarSalon.href = './reservarSalones.html'
    liReservarSalon.appendChild(aReservarSalon)
    ulNavbar.appendChild(liReservarSalon)
    const li = document.createElement('li')
    li.classList.add('nav-item', 'p-2', 'm-2', 'hover-effect-list-item')
    const boton = document.createElement('a')
    boton.textContent = 'Cerrar Sesión'
    boton.classList.add('nav-link', 'text-white', 'text-center')
    boton.style.cursor = 'pointer'
    const liContacto = document.getElementById('li-contacto').remove()

    boton.addEventListener('click', () => {
      borrarSessionStorage()
      window.location.href = 'login.html'
    })
    li.appendChild(boton)
    ulNavbar.appendChild(li)
  }
});
