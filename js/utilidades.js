
import { salones } from "../constantes/salones.js";

export function obtenerUsuarioLocalStorage() {
  return JSON.parse(localStorage.getItem("usuario")) || null;
}

function inicializarLocalStorage() {
  const yaExiste = localStorage.getItem('salonesInfantiles')
  if (!yaExiste) {
    localStorage.setItem('salonesInfantiles', JSON.stringify(salones))

  }
}

inicializarLocalStorage();
