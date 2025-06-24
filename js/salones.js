
import {
  obtenerUsuarioSessionStorage
} from './utilidades.js'

const usuario = obtenerUsuarioSessionStorage()

if (!usuario) {
  window.location.href = './index.html'
}

const LS_KEY = "salonesInfantiles";
let salones = [];
let proximoId = 1;
import {salonesCards } from './salonesCard.js'
const formularioSalon = document.getElementById("formularioSalon");
const inputIdSalon = document.getElementById("idSalon");
const inputNombreSalon = document.getElementById("nombreSalon");
const inputDireccionSalon = document.getElementById("direccionSalon");
const inputDescripcionSalon = document.getElementById("descripcionSalon");
const inputUrlsImagenSalon = document.getElementById("urlsImagenSalon");
const cuerpoTablaSalones = document.getElementById("cuerpoTablaSalones");
const tituloFormulario = document.getElementById("etiquetaModalAgregarSalon");
const inputBusquedaSalon = document.getElementById("inputBusquedaSalon");
const botonLimpiarBusqueda = document.getElementById("botonLimpiarBusqueda");
const contenedorAlerta = document.getElementById("contenedorAlerta");
const mensajeSinSalones = document.getElementById("mensajeSinSalones");

const modalAgregarSalon = new bootstrap.Modal(
  document.getElementById("modalAgregarSalon")
);

const botonCancelarModal = document.getElementById("botonCancelarModal");

function mostrarAlerta(mensaje, tipo = "success") {
  const htmlAlerta = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
  contenedorAlerta.innerHTML = htmlAlerta;
  setTimeout(() => {
    const elementoAlerta = contenedorAlerta.querySelector(".alert");
    if (elementoAlerta) {
      bootstrap.Alert.getInstance(elementoAlerta)?.close();
    }
  }, 5000);
}

function cargarSalonesDesdeLocalStorage() {
  const data = localStorage.getItem(LS_KEY);
  if (data) {
    salones = JSON.parse(data);
    if (salones.length > 0) {
      proximoId = Math.max(...salones.map((s) => s.id)) + 1;
    }
  } else {
    salones = [];
    proximoId = 1;
  }
}

function guardarSalonesEnLocalStorage() {
  localStorage.setItem(LS_KEY, JSON.stringify(salones));
}

function limpiarFormulario() {
  inputIdSalon.value = "";
  inputNombreSalon.value = "";
  inputDireccionSalon.value = "";
  inputDescripcionSalon.value = "";
  inputUrlsImagenSalon.value = "";
}

function mostrarSalones(salonesFiltrados = salones) {
  cuerpoTablaSalones.innerHTML = "";
  if (salonesFiltrados.length === 0) {
    mensajeSinSalones.style.display = "block";
    return;
  }
  mensajeSinSalones.style.display = "none";

  salonesFiltrados.forEach((salon) => {
    const fila = document.createElement("tr");
    const urlsImagen = salon.imageUrls
      ? salon.imageUrls.split(",").map((url) => url.trim())
      : [];
    const primeraUrlImagen = urlsImagen.length > 0 ? urlsImagen[0] : "";

    fila.innerHTML = `
            <td data-label="ID:">${salon.id}</td>
            <td data-label="Nombre:">${salon.name}</td>
            <td data-label="Dirección:">${salon.address}</td>
            <td data-label="Imagen:">
                ${
                  primeraUrlImagen
                    ? `<img src="${primeraUrlImagen}" alt="Imagen de ${salon.name}" class="img-thumbnail-table">`
                    : "Sin imagen"
                }
            </td>
            <td class="actions-cell" data-label="Acciones:">
                <div>
                    <button type="button" class="btn btn-link btn-sm text-decoration-none" onclick="editarSalon(${
                      salon.id
                    })" title="Editar Salón">
                        <i class="bi bi-pencil-square"></i> <span class="d-none d-md-inline">Editar</span>
                    </button>
                    <button type="button" class="btn btn-link btn-sm text-danger text-decoration-none" onclick="eliminarSalon(${
                      salon.id
                    })" title="Eliminar Salón">
                        <i class="bi bi-trash"></i> <span class="d-none d-md-inline">Eliminar</span>
                    </button>
                </div>
            </td>
        `;
    cuerpoTablaSalones.appendChild(fila);
  });
}

formularioSalon.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = inputIdSalon.value;
  const nombre = inputNombreSalon.value.trim();
  const direccion = inputDireccionSalon.value.trim();
  const descripcion = inputDescripcionSalon.value.trim();
  const urlsImagen = inputUrlsImagenSalon.value.trim() || 'img/imagen_placeholder.jpg';

  if (!nombre || !direccion) {
    mostrarAlerta("El nombre y la dirección son obligatorios.", "danger");
    return;
  }

  if (id) {
    const indice = salones.findIndex((s) => s.id === parseInt(id));
    if (indice !== -1) {
      salones[indice] = {
        id: parseInt(id),
        name: nombre,
        address: direccion,
        description: descripcion,
        imageUrls: urlsImagen,
      };
      mostrarAlerta("Salón actualizado exitosamente!", "success");
    } else {
      mostrarAlerta("Error: Salón no encontrado para editar.", "danger");
    }
  } else {
    const nuevoSalon = {
      id: proximoId++,
      name: nombre,
      address: direccion,
      description: descripcion,
      imageUrls: urlsImagen,
      estado: 'disponible'
    };
    salones.push(nuevoSalon);
    mostrarAlerta("Salón agregado exitosamente!", "success");
  }

  guardarSalonesEnLocalStorage();
  mostrarSalones();
  limpiarFormulario();
  modalAgregarSalon.hide();
  salonesCards();
});

window.editarSalon = function (id) {
  const salon = salones.find((s) => s.id === id);
  if (salon) {
    inputIdSalon.value = salon.id;
    inputNombreSalon.value = salon.name;
    inputDireccionSalon.value = salon.address;
    inputDescripcionSalon.value = salon.description;
    inputUrlsImagenSalon.value = salon.imageUrls;
    tituloFormulario.textContent = "Editar Salón";
    modalAgregarSalon.show();
  } else {
    mostrarAlerta("Salón no encontrado para edición.", "danger");
  }
};

window.eliminarSalon = function (id) {
  if (confirm("¿Estás seguro de que quieres eliminar este salón?")) {
    salones = salones.filter((salon) => salon.id !== id);
    guardarSalonesEnLocalStorage();
    mostrarSalones();
    mostrarAlerta("Salón eliminado exitosamente!", "success");
    limpiarFormulario();
  }
};

document
  .getElementById("modalAgregarSalon")
  .addEventListener("show.bs.modal", function () {
    if (inputIdSalon.value === "") {
      limpiarFormulario();
      tituloFormulario.textContent = "Nuevo Salón";
    }
  });

botonCancelarModal.addEventListener("click", () => {
  limpiarFormulario();
  mostrarAlerta("Operación cancelada.", "info");
});

inputBusquedaSalon.addEventListener("input", () => {
  const consulta = inputBusquedaSalon.value.trim().toLowerCase();
  const filtrados = salones.filter(
    (salon) =>
      salon.name.toLowerCase().includes(consulta) ||
      salon.address.toLowerCase().includes(consulta)
  );
  mostrarSalones(filtrados);
  if (consulta && filtrados.length === 0) {
    mostrarAlerta(
      "No se encontraron salones que coincidan con la búsqueda.",
      "info"
    );
  }
});

botonLimpiarBusqueda.addEventListener("click", () => {
  inputBusquedaSalon.value = "";
  mostrarSalones();
  mostrarAlerta("Búsqueda limpiada, mostrando todos los salones.", "info");
});

document.addEventListener("DOMContentLoaded", () => {
  cargarSalonesDesdeLocalStorage();
  mostrarSalones();
});

document.addEventListener("DOMContentLoaded", salonesCards);
