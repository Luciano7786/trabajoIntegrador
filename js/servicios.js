// --- Constantes y Variables Globales para Servicios ---
const LS_KEY_SERVICIOS = "servicios"; // Clave para localStorage de servicios
let servicios = []; // Array para almacenar los servicios
let proximoIdServicio = 1; // Próximo ID disponible para un nuevo servicio

// --- Elementos del DOM para el Formulario de Servicios ---
const formularioServicio = document.getElementById("formularioServicio");
const inputIdServicio = document.getElementById("idServicio");
const inputNombreServicio = document.getElementById("nombreServicio");
const inputDescripcionServicio = document.getElementById("descripcionServicio");
const inputPrecioServicio = document.getElementById("precioServicio");

// --- Elementos del DOM para la Tabla y Búsqueda de Servicios ---
const cuerpoTablaServicios = document.getElementById("cuerpoTablaServicios");
const tituloFormularioServicio = document.getElementById("etiquetaModalAgregarServicio"); // Título del modal de servicios
// Aunque no tienes un input de búsqueda específico en el HTML proporcionado, lo mantengo por si lo agregas luego.
// Si no lo usas, puedes eliminar estas dos líneas:
// const inputBusquedaServicio = document.getElementById("inputBusquedaServicio");
// const botonLimpiarBusquedaServicio = document.getElementById("botonLimpiarBusquedaServicio");

const contenedorAlertaServicios = document.getElementById("contenedorAlertaServicios"); // Contenedor para alertas de servicios
const mensajeSinServicios = document.getElementById("mensajeSinServicios"); // Mensaje cuando no hay servicios

// --- Instancia del Modal de Bootstrap para Servicios ---
const modalAgregarServicio = new bootstrap.Modal(
    document.getElementById("modalAgregarServicio")
);

const botonCancelarModalServicio = document.getElementById("botonCancelarModalServicio");

// --- Función para mostrar alertas ---
function mostrarAlertaServicio(mensaje, tipo = "success") {
    const htmlAlerta = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    contenedorAlertaServicios.innerHTML = htmlAlerta;
    setTimeout(() => {
        const elementoAlerta = contenedorAlertaServicios.querySelector(".alert");
        if (elementoAlerta) {
            bootstrap.Alert.getInstance(elementoAlerta)?.close();
        }
    }, 5000);
}

// --- Carga de servicios desde LocalStorage ---
function cargarServiciosDesdeLocalStorage() {
    const data = localStorage.getItem(LS_KEY_SERVICIOS);
    if (data) {
        servicios = JSON.parse(data);
        if (servicios.length > 0) {
            // Asegura que proximoIdServicio sea mayor que el ID más alto existente
            proximoIdServicio = Math.max(...servicios.map((s) => s.id)) + 1;
        }
    } else {
        servicios = [];
        proximoIdServicio = 1;
    }
}

// --- Guardado de servicios en LocalStorage ---
function guardarServiciosEnLocalStorage() {
    localStorage.setItem(LS_KEY_SERVICIOS, JSON.stringify(servicios));
}

// --- Limpiar el formulario de servicios ---
function limpiarFormularioServicio() {
    inputIdServicio.value = "";
    inputNombreServicio.value = "";
    inputDescripcionServicio.value = "";
    inputPrecioServicio.value = "";
    // Restablecer la validación de Bootstrap si usas clases 'is-invalid' o 'is-valid'
    formularioServicio.classList.remove("was-validated");
}

// --- Mostrar servicios en la tabla ---
function mostrarServicios(serviciosFiltrados = servicios) {
    cuerpoTablaServicios.innerHTML = ""; // Limpiar tabla antes de mostrar
    if (serviciosFiltrados.length === 0) {
        mensajeSinServicios.style.display = "block";
        return;
    }
    mensajeSinServicios.style.display = "none";

    serviciosFiltrados.forEach((servicio) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td data-label="ID:">${servicio.id}</td>
            <td data-label="Nombre:">${servicio.name}</td>
            <td data-label="Descripción:">${servicio.description}</td>
            <td data-label="Precio:">$${servicio.price.toFixed(2)}</td>
            <td class="actions-cell" data-label="Acciones:">
                <div>
                    <button type="button" class="btn btn-link btn-sm text-decoration-none" onclick="editarServicio(${
                        servicio.id
                    })" title="Editar Servicio">
                        <i class="bi bi-pencil-square"></i> <span class="d-none d-md-inline">Editar</span>
                    </button>
                    <button type="button" class="btn btn-link btn-sm text-danger text-decoration-none" onclick="eliminarServicio(${
                        servicio.id
                    })" title="Eliminar Servicio">
                        <i class="bi bi-trash"></i> <span class="d-none d-md-inline">Eliminar</span>
                    </button>
                </div>
            </td>
        `;
        cuerpoTablaServicios.appendChild(fila);
    });
}

// --- Event Listener para el envío del formulario de servicios ---
formularioServicio.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar el envío por defecto del formulario

    // Validación de Bootstrap 5
    if (!formularioServicio.checkValidity()) {
        event.stopPropagation(); // Detener la propagación del evento si el formulario no es válido
        formularioServicio.classList.add("was-validated"); // Mostrar mensajes de validación
        mostrarAlertaServicio("Por favor, completa todos los campos obligatorios.", "danger");
        return;
    }

    const id = inputIdServicio.value;
    const nombre = inputNombreServicio.value.trim();
    const descripcion = inputDescripcionServicio.value.trim();
    const precio = parseFloat(inputPrecioServicio.value); // Convertir a número flotante

    // Validaciones adicionales
    if (isNaN(precio) || precio <= 0) {
        mostrarAlertaServicio("El precio debe ser un número positivo.", "danger");
        return;
    }

    if (id) {
        // Editar servicio existente
        const indice = servicios.findIndex((s) => s.id === parseInt(id));
        if (indice !== -1) {
            servicios[indice] = {
                id: parseInt(id),
                name: nombre,
                description: descripcion,
                price: precio,
            };
            mostrarAlertaServicio("Servicio actualizado exitosamente!", "success");
        } else {
            mostrarAlertaServicio("Error: Servicio no encontrado para editar.", "danger");
        }
    } else {
        // Agregar nuevo servicio
        const nuevoServicio = {
            id: proximoIdServicio++,
            name: nombre,
            description: descripcion,
            price: precio,
        };
        servicios.push(nuevoServicio);
        mostrarAlertaServicio("Servicio agregado exitosamente!", "success");
    }

    guardarServiciosEnLocalStorage();
    mostrarServicios();
    limpiarFormularioServicio();
    modalAgregarServicio.hide(); // Ocultar el modal después de guardar
});

// --- Función global para editar un servicio ---
window.editarServicio = function (id) {
    const servicio = servicios.find((s) => s.id === id);
    if (servicio) {
        inputIdServicio.value = servicio.id;
        inputNombreServicio.value = servicio.name;
        inputDescripcionServicio.value = servicio.description;
        inputPrecioServicio.value = servicio.price; // Carga el valor del precio
        tituloFormularioServicio.textContent = "Editar Servicio"; // Cambia el título del modal
        modalAgregarServicio.show(); // Abre el modal
        formularioServicio.classList.remove("was-validated"); // Limpia la validación previa al abrir
    } else {
        mostrarAlertaServicio("Servicio no encontrado para edición.", "danger");
    }
};

// --- Función global para eliminar un servicio ---
window.eliminarServicio = function (id) {
    if (confirm("¿Estás seguro de que quieres eliminar este servicio?")) {
        servicios = servicios.filter((servicio) => servicio.id !== id);
        guardarServiciosEnLocalStorage();
        mostrarServicios();
        mostrarAlertaServicio("Servicio eliminado exitosamente!", "success");
        limpiarFormularioServicio(); // Limpia el formulario después de eliminar
    }
};

// --- Event Listener cuando se muestra el modal de servicios ---
document
    .getElementById("modalAgregarServicio")
    .addEventListener("show.bs.modal", function () {
        // Si el campo de ID está vacío, significa que es un nuevo servicio.
        // Si tiene un valor, se está editando un servicio existente y los campos ya están cargados.
        if (inputIdServicio.value === "") {
            limpiarFormularioServicio(); // Asegúrate de limpiar si es nuevo
            tituloFormularioServicio.textContent = "Nuevo Servicio"; // Restablece el título
        }
        formularioServicio.classList.remove("was-validated"); // Quita las clases de validación al abrir
    });

// --- Event Listener para el botón cancelar del modal de servicios ---
botonCancelarModalServicio.addEventListener("click", () => {
    limpiarFormularioServicio(); // Limpia el formulario al cancelar
    mostrarAlertaServicio("Operación de servicio cancelada.", "info");
});

// --- Manejo de la búsqueda (opcional, si decides añadir el input de búsqueda) ---
// if (inputBusquedaServicio && botonLimpiarBusquedaServicio) {
//     inputBusquedaServicio.addEventListener("input", () => {
//         const consulta = inputBusquedaServicio.value.trim().toLowerCase();
//         const filtrados = servicios.filter(
//             (servicio) =>
//                 servicio.name.toLowerCase().includes(consulta) ||
//                 servicio.description.toLowerCase().includes(consulta)
//         );
//         mostrarServicios(filtrados);
//         if (consulta && filtrados.length === 0) {
//             mostrarAlertaServicio(
//                 "No se encontraron servicios que coincidan con la búsqueda.",
//                 "info"
//             );
//         }
//     });

//     botonLimpiarBusquedaServicio.addEventListener("click", () => {
//         inputBusquedaServicio.value = "";
//         mostrarServicios();
//         mostrarAlertaServicio("Búsqueda de servicios limpiada, mostrando todos los servicios.", "info");
//     });
// }


// --- Cargar servicios y mostrarlos al cargar el DOM ---
document.addEventListener("DOMContentLoaded", () => {
    cargarServiciosDesdeLocalStorage();
    mostrarServicios();
});