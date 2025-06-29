
import { salones } from "../constantes/salones.js";
import { servicios } from "../constantes/servicios.js";

export function obtenerUsuarioSessionStorage() {
  return JSON.parse(sessionStorage.getItem("usuario")) || null;
}

export function getSalones() {
  return JSON.parse (localStorage.getItem("salonesInfantiles")) || null;
}

export function guardarUsuarioSessionStorage ({usuario, accessToken}) {
  const existeUsuario = sessionStorage.getItem('usuario')
  if(existeUsuario) {
    alert('Ya existe un usuario logueado')
    if (existeUsuario.role = 'admin') {
      window.location = 'altaSalones.html'
    } else {
      window.location = 'index.html'
    }
  }

  sessionStorage.setItem('usuario', JSON.stringify(usuario))
  sessionStorage.setItem('accessToken', JSON.stringify(accessToken))
}

export function borrarSessionStorage () {
  sessionStorage.clear()
}

function inicializarLocalStorage() {
  const yaExiste = localStorage.getItem('salonesInfantiles')
  if (!yaExiste) {
    localStorage.setItem('salonesInfantiles', JSON.stringify(salones))
  }
  const yaExisteServicios = localStorage.getItem('servicios')
  if (!yaExisteServicios) {
    localStorage.setItem('servicios', JSON.stringify(servicios))
  }
}

inicializarLocalStorage();

export async function authUser ({ usuario, contrasenia }) {

  try {

    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({username: usuario, password: contrasenia})
      
    })

    if(!response.ok) {
      alert('Usuario no encontrado')
      window.location.reload()
      return false
    }
    
    const existeUsuario = await response.json()
    const token = existeUsuario.accessToken
    const tokenResponse = await fetch('https://dummyjson.com/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const tokenData = await tokenResponse.json()
    const roleUser = tokenData.role
    existeUsuario.role = roleUser
    return existeUsuario  
    
  } catch (err) {
    console.log(err)
    throw new Error ('Error al iniciar sesión')
  }

}

export async function obtenerUsuarios (){

  try {
    const response = await fetch('https://dummyjson.com/users')
    const data = await response.json()
    const { users } = data
    return users
  } catch (err){
    console.log(err)
    throw new Error ('Error al obtener usuarios')
  }
  
}

export function obtenerServicios () {
  return JSON.parse(localStorage.getItem("servicios")) || null;
}

export const getSalonId = (id) => {
  const salones = getSalones()
  const salon = salones.find(sal => parseInt(sal.id) === parseInt(id))
  return salon
}

export function obtenerPresupuestoLocalStorage(){
  return JSON.parse(localStorage.getItem("presupuesto")) || null
}

export function guardarPresupuestoLocalStorage(presupuesto){
  const presupuestoExistente = obtenerPresupuestoLocalStorage()
  const presupuestoArreglo = []
  if(!presupuestoExistente){
    presupuestoArreglo.push(presupuesto)
  }else{
    presupuestoArreglo.push(...presupuestoExistente, presupuesto)
  }
  localStorage.setItem("presupuesto", JSON.stringify(presupuestoArreglo))
}

export const guardarSalonLocalStorage = (salonParam) => {
  const salonesExistentes = getSalones()
  const nuevosSalones = salonesExistentes.filter(sal => sal.id !== salonParam.id)
  console.log(nuevosSalones)  
  nuevosSalones.push(salonParam)
  localStorage.setItem('salonesInfantiles', JSON.stringify(nuevosSalones))
}