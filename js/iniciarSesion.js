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
      guardarUsuarioSessionStorage({usuario: existeUsuario, accessToken: existeUsuario.accessToken})
      if (existeUsuario.role === 'admin') {
        window.location = 'panelAdmin.html'
      } else {
        window.location = 'index.html'
      }
    } else {
      window.location.reload()
      return false
    }

  });

