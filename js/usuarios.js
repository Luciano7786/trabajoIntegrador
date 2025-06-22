import { obtenerUsuarios } from "./utilidades.js";

const bodyUsuarios = document.getElementById("cuerpoTablaUsuarios")

const usuarios = await obtenerUsuarios()

usuarios.forEach(usuario => {
    const fila = document.createElement("tr")
    fila.innerHTML = `
        <td>${usuario.id}</td>
        <td>${usuario.firstName}</td>
        <td>${usuario.lastName}</td>
        <td>${usuario.username}</td>`
        bodyUsuarios.appendChild(fila)
})

