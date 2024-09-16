// Obtener elementos del DOM
const financeForm = document.getElementById('financeForm');
const financeList = document.getElementById('financeList');
let emailrec = document.getElementById('emailrec').value;


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

// Enviar correo electrónico usando EmailJS
function sendEmail(message) {
    console.log('Sending email with message:', message); // Agregar para depuración
    emailjs.send('service_rhnx8i2', 'template_w8sfgeh', message)
    .then((response) => {
        console.log('Email sent successfully:', response);
    }, (error) => {
        console.error('Error sending email:', error);
    });
}

financeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const type = document.getElementById('type').value;
    const date = document.getElementById('date').value;
    const recipientEmail = emailrec.value;

    const newFinance = {
        description,
        amount,
        type,
        date
    };

    finances.push(newFinance);
    localStorage.setItem('finances', JSON.stringify(finances));
    renderFinances();
    financeForm.reset();

    // Enviar un correo con la nueva transacción
    const emailMessage = {
        to_email: recipientEmail, // Cambia esto al correo electrónico del destinatario
        to_name: 'Rosa',
        from_name: 'Finance App',
        description: description,
        amount: amount,
        type: type,
        date: date
    };

    sendEmail(emailMessage);
});

// Eliminar una entrada financiera
function deleteFinance(index) {
    finances.splice(index, 1);
    localStorage.setItem('finances', JSON.stringify(finances));
    renderFinances();
}

// Verificar recordatorios
function checkReminders() {
    const today = new Date().toISOString().split('T')[0];
    finances.forEach((finance) => {
        if (finance.date === today) {
            const emailMessage = {
                to_name: 'Rosa',  // Cambia esto al nombre adecuado
                from_name: 'Finance App',
                message: `Recordatorio: La fecha de una transacción ha llegado:
                           Descripción: ${finance.description}
                           Monto: ${finance.amount}
                           Tipo: ${finance.type}`
            };
            sendEmail(emailMessage);
        }
    });
}

// Inicializar la lista y verificar recordatorios
renderFinances();
checkReminders();
