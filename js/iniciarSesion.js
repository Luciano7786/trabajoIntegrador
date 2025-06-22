import { authUser,guardarUsuarioSessionStorage } from "./utilidades.js";


  document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const contrasenia = document.getElementById("contrasenia").value;

    if (!usuario || !contrasenia) {
      return
    }

    const existeUsuario = await authUser({usuario ,contrasenia})


    if(existeUsuario) {
      guardarUsuarioSessionStorage(existeUsuario)
      if (existeUsuario.role === 'admin') {
        window.location = 'altaSalones.html'
      } else {
        window.location = 'index.html'
      }
    } else {
      window.location.reload()
      return false
    }

  });

