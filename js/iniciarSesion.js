import { obtenerUsuarioLocalStorage } from "./utilidades.js";

let usuario = obtenerUsuarioLocalStorage();

if (!usuario) {
  document.getElementById("form-login").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const contraseña = document.getElementById("contraseña").value;

    console.log(email.value);
    console.log(contraseña.value);

    usuario = {
      email,
      contraseña,
    };
    localStorage.setItem("usuario", JSON.stringify(usuario));

    window.location = "/altaSalones.html";
  });
}
