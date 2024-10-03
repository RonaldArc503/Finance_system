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
    const minutosPasados = Math.floor(diferenciaTiempo / (1000 * 60)); // Convertir milisegundos a minutos
    return minutosPasados >= 1; // Cambiado a 1 minuto para prueba
};

// Mostrar historial de ahorro
const mostrarHistorialAhorro = () => {
    const historialDiv = document.getElementById('historialAhorro');
    historialDiv.innerHTML = ''; // Limpiar el contenido anterior

    historialAhorro.forEach((ahorro, index) => {
        const ahorroDiv = document.createElement('div');
        ahorroDiv.textContent = `Ahorro del ${ahorro.fecha}: $${ahorro.cantidad}`;
        historialDiv.appendChild(ahorroDiv);
    });
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

// Mostrar el historial de ahorros
mostrarHistorialAhorro();
