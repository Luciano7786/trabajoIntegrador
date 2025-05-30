import {salones} from "../constantes/salones.js"

export function obtenerUsuarioLocalStorage () {

  return JSON.parse(localStorage.getItem('usuario'))

}

( function inicializarLocalStorage () {
  localStorage.setItem("salonesInfantiles", JSON.stringify(salones))

})()