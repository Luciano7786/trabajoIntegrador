const LS_KEY = 'salonesInfantiles';
let salons = [];
let nextId = 1;

const salonForm = document.getElementById('salonForm');
const salonIdInput = document.getElementById('salonId');
const salonNameInput = document.getElementById('salonName');
const salonAddressInput = document.getElementById('salonAddress');
const salonDescriptionInput = document.getElementById('salonDescription');
const salonImageUrlsInput = document.getElementById('salonImageUrls');
const salonsTableBody = document.getElementById('salonsTableBody');
const formTitle = document.getElementById('addSalonModalLabel');
const searchSalonInput = document.getElementById('searchSalonInput');
const clearSearchButton = document.getElementById('clearSearchButton');
const alertContainer = document.getElementById('alertContainer');
const noSalonsMessage = document.getElementById('noSalonsMessage');

const addSalonModal = new bootstrap.Modal(document.getElementById('addSalonModal'));
const cancelButtonModal = document.getElementById('cancelButtonModal');

function showAlert(message, type = 'success') {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    alertContainer.innerHTML = alertHtml;
    setTimeout(() => {
        const alertElement = alertContainer.querySelector('.alert');
        if (alertElement) {
            bootstrap.Alert.getInstance(alertElement)?.close();
        }
    }, 5000);
}

function loadSalonsFromLocalStorage() {
    const data = localStorage.getItem(LS_KEY);
    if (data) {
        salons = JSON.parse(data);
        if (salons.length > 0) {
            nextId = Math.max(...salons.map(s => s.id)) + 1;
        }
    } else {
        salons = [];
        nextId = 1;
    }
}

function saveSalonsToLocalStorage() {
    localStorage.setItem(LS_KEY, JSON.stringify(salons));
}

function clearForm() {
    salonIdInput.value = '';
    salonNameInput.value = '';
    salonAddressInput.value = '';
    salonDescriptionInput.value = '';
    salonImageUrlsInput.value = '';
}

function displaySalons(filteredSalons = salons) {
    salonsTableBody.innerHTML = '';
    if (filteredSalons.length === 0) {
        noSalonsMessage.style.display = 'block';
        return;
    }
    noSalonsMessage.style.display = 'none';

    filteredSalons.forEach(salon => {
        const row = document.createElement('tr');
        const imageUrls = salon.imageUrls ? salon.imageUrls.split(',').map(url => url.trim()) : [];
        const firstImageUrl = imageUrls.length > 0 ? imageUrls[0] : '';

        row.innerHTML = `
            <td data-label="ID:">${salon.id}</td>
            <td data-label="Nombre:">${salon.name}</td>
            <td data-label="Dirección:">${salon.address}</td>
            <td data-label="Imagen:">
                ${firstImageUrl ? `<img src="${firstImageUrl}" alt="Imagen de ${salon.name}" class="img-thumbnail-table">` : 'Sin imagen'}
            </td>
            <td class="actions-cell" data-label="Acciones:">
                <div>
                    <button type="button" class="btn btn-link btn-sm text-decoration-none" onclick="editSalon(${salon.id})" title="Editar Salón">
                        <i class="bi bi-pencil-square"></i> <span class="d-none d-md-inline">Editar</span>
                    </button>
                    <button type="button" class="btn btn-link btn-sm text-danger text-decoration-none" onclick="deleteSalon(${salon.id})" title="Eliminar Salón">
                        <i class="bi bi-trash"></i> <span class="d-none d-md-inline">Eliminar</span>
                    </button>
                </div>
            </td>
        `;
        salonsTableBody.appendChild(row);
    });
}

salonForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const id = salonIdInput.value;
    const name = salonNameInput.value.trim();
    const address = salonAddressInput.value.trim();
    const description = salonDescriptionInput.value.trim();
    const imageUrls = salonImageUrlsInput.value.trim();

    if (!name || !address) {
        showAlert('El nombre y la dirección son obligatorios.', 'danger');
        return;
    }

    if (id) {
        const index = salons.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            salons[index] = { id: parseInt(id), name, address, description, imageUrls };
            showAlert('Salón actualizado exitosamente!', 'success');
        } else {
            showAlert('Error: Salón no encontrado para editar.', 'danger');
        }
    } else {
        const newSalon = {
            id: nextId++,
            name,
            address,
            description,
            imageUrls
        };
        salons.push(newSalon);
        showAlert('Salón agregado exitosamente!', 'success');
    }

    saveSalonsToLocalStorage();
    displaySalons();
    clearForm();
    addSalonModal.hide();
});

window.editSalon = function (id) {
    const salon = salons.find(s => s.id === id);
    if (salon) {
        salonIdInput.value = salon.id;
        salonNameInput.value = salon.name;
        salonAddressInput.value = salon.address;
        salonDescriptionInput.value = salon.description;
        salonImageUrlsInput.value = salon.imageUrls;
        formTitle.textContent = 'Editar Salón';
        addSalonModal.show();
    } else {
        showAlert('Salón no encontrado para edición.', 'danger');
    }
}

window.deleteSalon = function (id) {
    if (confirm('¿Estás seguro de que quieres eliminar este salón?')) {
        salons = salons.filter(salon => salon.id !== id);
        saveSalonsToLocalStorage();
        displaySalons();
        showAlert('Salón eliminado exitosamente!', 'success');
        clearForm();
    }
}

document.getElementById('addSalonModal').addEventListener('show.bs.modal', function () {
    if (salonIdInput.value === '') {
        clearForm();
        formTitle.textContent = 'Nuevo Salón';
    }
});

cancelButtonModal.addEventListener('click', () => {
    clearForm();
    showAlert('Operación cancelada.', 'info');
});

searchSalonInput.addEventListener('input', () => {
    const query = searchSalonInput.value.trim().toLowerCase();
    const filtered = salons.filter(salon =>
        salon.name.toLowerCase().includes(query) ||
        salon.address.toLowerCase().includes(query)
    );
    displaySalons(filtered);
    if (query && filtered.length === 0) {
        showAlert('No se encontraron salones que coincidan con la búsqueda.', 'info');
    }
});

clearSearchButton.addEventListener('click', () => {
    searchSalonInput.value = '';
    displaySalons();
    showAlert('Búsqueda limpiada, mostrando todos los salones.', 'info');
});

document.addEventListener('DOMContentLoaded', () => {
    loadSalonsFromLocalStorage();
    displaySalons();
});