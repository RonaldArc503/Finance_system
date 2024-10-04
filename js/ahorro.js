// Obtener la fecha actual
const fechaActual = new Date();

// Cargar el presupuesto y los ahorros previos desde localStorage
let presupuestoMensual = parseFloat(localStorage.getItem('presupuesto')) || 0;
let historialAhorro = JSON.parse(localStorage.getItem('historialAhorro')) || [];
let ultimaFechaAhorro = localStorage.getItem('ultimaFechaAhorro');

// Verificar si ya pasó un minuto desde el último ahorro
const haPasadoUnMinuto = (ultimaFecha) => {
    const fechaUltimoAhorro = new Date(ultimaFecha);
    const diferenciaTiempo = fechaActual - fechaUltimoAhorro;
    const minutosPasados = Math.floor(diferenciaTiempo / (1000 * 60)); 
    return minutosPasados >= 1; 

    /* const diasPasados = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24)); 
    return diasPasados >= 30; //30 dias*/ 
};

// Mostrar historial de ahorro
const mostrarHistorialAhorro = () => {
    const historialDiv = document.getElementById('historialAhorro');
    historialDiv.innerHTML = ''; // Limpiar el contenido anterior

    historialAhorro.forEach((ahorro) => {
        const ahorroDiv = document.createElement('div');
        ahorroDiv.textContent = `Ahorro del ${ahorro.fecha}: $${ahorro.cantidad}`;
        historialDiv.appendChild(ahorroDiv);
    });
};

// Sumar todos los ahorros para calcular el total acumulado
const calcularTotalAcumulado = () => {
    return historialAhorro.reduce((total, ahorro) => total + ahorro.cantidad, 0);
};

// Verificar si se debe guardar un nuevo ahorro
if (!ultimaFechaAhorro || haPasadoUnMinuto(ultimaFechaAhorro)) {
    // Obtener el monto disponible (presupuesto menos gastos)
    const totalGastado = JSON.parse(localStorage.getItem('transacciones'))?.reduce((acc, t) => acc + t.monto, 0) || 0;
    const disponible = presupuestoMensual - totalGastado;

    if (disponible > 0) {
        // Guardar el ahorro
        const nuevoAhorro = {
            fecha: fechaActual.toLocaleDateString('es-ES'),
            cantidad: disponible
        };
        historialAhorro.push(nuevoAhorro);
        localStorage.setItem('historialAhorro', JSON.stringify(historialAhorro));
        
        // Actualizar la última fecha de ahorro
        localStorage.setItem('ultimaFechaAhorro', fechaActual);
    }
}

// Mostrar el ahorro mensual más reciente
document.getElementById('ahorroMensual').textContent = historialAhorro.length > 0 
    ? `Ahorro del mes: $${historialAhorro[historialAhorro.length - 1].cantidad}` 
    : 'Ahorro del mes: $0';

// Mostrar el total acumulado
const totalAcumulado = calcularTotalAcumulado();
document.getElementById('totalAcumulado').textContent = `$${totalAcumulado}`;

// Mostrar el historial de ahorros
mostrarHistorialAhorro();




document.addEventListener('DOMContentLoaded', function() {
    const userDataString = localStorage.getItem('user');
    const usuariosString = localStorage.getItem('users');
    
    let userData;
    
    if (userDataString) {
        userData = JSON.parse(userDataString);
    } else if (usuariosString) {
        const usuarios = JSON.parse(usuariosString);
        userData = usuarios.length > 0 ? usuarios[0] : null;
    }

    if (userData) {
        document.getElementById('perfilUsername').textContent = userData.username || 'Nombre de Usuario No Disponible';
        document.getElementById('perfilEmail').textContent = `Correo: ${userData.email || 'Correo No Disponible'}`;
    }

    // Manejar el cambio de contraseña
    document.getElementById('cambiarPasswordForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const contraseñaActual = document.getElementById('contraseña_actual').value;
        const nuevaPassword = document.getElementById('nueva_password').value;
        const confirmarPassword = document.getElementById('confirmar_password').value;

        // Hash de la contraseña actual ingresada
        const hashedContraseñaActual = CryptoJS.SHA256(contraseñaActual).toString();

        // Verificar que la contraseña actual coincida
        if (hashedContraseñaActual !== userData.password) {
            alert('La contraseña actual es incorrecta.');
            return;
        }

        // Verificar que las nuevas contraseñas coincidan
        if (nuevaPassword !== confirmarPassword) {
            alert('Las nuevas contraseñas no coinciden.');
            return;
        }

        // Hash de la nueva contraseña
        const hashedPassword = CryptoJS.SHA256(nuevaPassword).toString();

        // Actualizar la contraseña en localStorage
        const usuarios = JSON.parse(usuariosString);
        const usuarioIndex = usuarios.findIndex(usuario => usuario.username === userData.username);
        
        if (usuarioIndex !== -1) {
            usuarios[usuarioIndex].password = hashedPassword; // Actualizar la contraseña
            localStorage.setItem('users', JSON.stringify(usuarios)); // Guardar los cambios
            alert('Contraseña cambiada exitosamente.');
        }

        // Limpiar el formulario
        document.getElementById('cambiarPasswordForm').reset();
    });

       // Función para cerrar sesión
       const cerrarSesion = document.getElementById('cerrarSesion');
       if (cerrarSesion) {
           cerrarSesion.addEventListener('click', function(event) {
               event.preventDefault(); // Prevenir la acción por defecto del enlace
               localStorage.removeItem('user'); // Eliminar datos del usuario
               localStorage.removeItem('users'); // Opcional, si deseas eliminar todos los usuarios
               // Redirigir a la página de inicio de sesión o inicio
               window.location.href = '/login/login.html';
           });
       }
});


