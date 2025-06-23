import { obtenerUsuarios } from "./utilidades.js";

const bodyUsuarios = document.getElementById("cuerpoTablaUsuarios")

const usuarios = await obtenerUsuarios()

usuarios.forEach(usuario => {
    const fila = document.createElement("tr")
    fila.innerHTML = `
        <td class='text-center'>${usuario.id}</td>
        <td class='text-center'>${usuario.firstName}</td>
        <td class='text-center'>${usuario.lastName}</td>
        <td class='text-center'>${usuario.username}</td>`
        bodyUsuarios.appendChild(fila)
})

