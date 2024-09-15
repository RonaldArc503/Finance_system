// Obtener elementos del DOM
const financeForm = document.getElementById('financeForm');
const financeList = document.getElementById('financeList');

// Almacenar datos en localStorage
let finances = JSON.parse(localStorage.getItem('finances')) || [];

// Actualizar la tabla
function renderFinances() {
    financeList.innerHTML = '';
    finances.forEach((finance, index) => {
        financeList.innerHTML += `
            <tr>
                <td>${finance.description}</td>
                <td>${finance.amount}</td>
                <td>${finance.type}</td>
                <td>
                    <button onclick="deleteFinance(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// Agregar una nueva entrada financiera
financeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const type = document.getElementById('type').value;

    const newFinance = {
        description,
        amount,
        type
    };

    finances.push(newFinance);
    localStorage.setItem('finances', JSON.stringify(finances));
    renderFinances();
    financeForm.reset();
});

// Eliminar una entrada financiera
function deleteFinance(index) {
    finances.splice(index, 1);
    localStorage.setItem('finances', JSON.stringify(finances));
    renderFinances();
}

// Inicializar la lista
renderFinances();
