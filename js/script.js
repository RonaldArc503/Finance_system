const presupuestoInput = document.getElementById('presupuesto-mensual');
const disponibleDiv = document.getElementById('disponible');
const gastadoDiv = document.getElementById('gastado');
const transaccionesDiv = document.getElementById('transacciones');
const mensajePresupuestoDiv = document.getElementById('mensaje-presupuesto');
const togglePresupuestoBtn = document.getElementById('togglePresupuestoBtn'); // El botón para ocultar/mostrar
let chartPresupuesto;

let presupuestoMensual = parseFloat(localStorage.getItem('presupuesto')) || 0; // Cargar presupuesto al iniciar
let totalGastado = 0;

// Inicializar gráfico de pastel
const inicializarGraficoPresupuesto = () => {
    const ctx = document.getElementById('chartPresupuesto').getContext('2d');
    chartPresupuesto = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Gastado', 'Disponible'],
            datasets: [{
                data: [totalGastado, presupuestoMensual - totalGastado],
                backgroundColor: ['#4c9dd6', '#77fa6a'],
                borderColor: ['#1e40af', '#77fa6a'], // Color del borde para cada segmento
                borderWidth: 1, // Ancho del borde
              
                borderRadius: 10,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 90, // Hacer el gráfico más delgado
            plugins: {
                legend: {
                    display: false, // Ocultar leyenda
                },
                datalabels: {
                    color: '#ffffff', // Color del texto
                    font: {
                        weight: 'bold', // Establecer texto en negrita
                        size: 14 // Tamaño de la fuente (ajusta según lo necesario)
                    },
                    formatter: (value, context) => {
                        const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                        const percentage = ((value / total) * 100).toFixed(2) + '%';
                        return percentage; // Mostrar porcentaje
                    }
                }
            }
        },
        plugins: [ChartDataLabels] // Agregar el plugin de etiquetas de datos
    });
};

// Función para ocultar/mostrar el input del presupuesto
const toggleInputPresupuesto = () => {
    if (presupuestoInput.style.display === 'none') {
        presupuestoInput.style.display = 'block'; // Mostrar el input
        togglePresupuestoBtn.textContent = 'Definir Presupuesto';
    } else {
        presupuestoInput.style.display = 'none'; // Ocultar el input
        togglePresupuestoBtn.textContent = 'Definir Presupuesto';
    }
};

// Actualizar gráfico
const actualizarGraficoPresupuesto = () => {
    if (chartPresupuesto) {
        chartPresupuesto.data.datasets[0].data = [totalGastado, presupuestoMensual - totalGastado];
        chartPresupuesto.update();
    }
};

const formatFecha = (fecha) => {
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
};

const agregarTransaccion = (descripcion, monto, tipo) => {
    const transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    const fecha = formatFecha(new Date());
    transacciones.push({ descripcion, monto, fecha, tipo });
    localStorage.setItem('transacciones', JSON.stringify(transacciones));

    cargarTransacciones();
    actualizarPresupuesto();
};

// Función para cargar las transacciones desde localStorage
const cargarTransacciones = () => {
    const transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    const listaTransacciones = document.getElementById('lista-transacciones');
    listaTransacciones.innerHTML = ''; // Limpiar la lista antes de cargar

    transacciones.forEach((transaccion, index) => {
        const transaccionDiv = document.createElement('div');
        transaccionDiv.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center swipeable';
        
        // Estructura de la transacción en formato de lista
        transaccionDiv.innerHTML = `
        <div class="transaccion-item">
            <div class="icono-y-texto">
                <i class="${getIconClass(transaccion.tipo)} icono-gasto"></i>
                <div class="transaccion-texto">
                    <strong>${transaccion.tipo}</strong>
                    <p>${transaccion.descripcion}</p>
                    <small>${transaccion.fecha}</small> <!-- Mover aquí la fecha -->
                </div>
            </div>
            <div class="monto-gasto">
                $${transaccion.monto}
            </div>
        </div>
    `;
    
    

        // Agregar funcionalidad de deslizamiento (swipe)
        const hammer = new Hammer(transaccionDiv);
        hammer.on('swipeleft', function () {
            eliminarTransaccion(index);
        });

        hammer.on('swiperight', function () {
            editarTransaccion(index);
        });

        listaTransacciones.appendChild(transaccionDiv);
    });
};






const editarTransaccion = (index) => {
    const transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    const transaccion = transacciones[index];
    
    // Agregar la clase para deslizar fuera
    const transaccionDiv = document.querySelectorAll('.list-group-item')[index];
    transaccionDiv.classList.add('swipe-right');

    // Esperar el tiempo de la animación antes de eliminar la transacción
    setTimeout(() => {
        // Rellenar los inputs con los detalles de la transacción actual
        document.getElementById('descripcion-gasto').value = transaccion.descripcion;
        document.getElementById('monto-gasto').value = transaccion.monto;
        document.getElementById('tipo-gasto').value = transaccion.tipo;

        // Eliminar la transacción de localStorage
        eliminarTransaccion(index);
    }, 300); // Tiempo debe coincidir con la duración de la transición CSS
};

// Function to get icon class based on expense type
const getIconClass = (tipo) => {
    switch (tipo) {
        case 'comida': return 'fas fa-utensils'; 
        case 'casa': return 'fas fa-home';
        case 'ahorro': return 'fas fa-piggy-bank';
        case 'universidad': return 'fas fa-graduation-cap';
        case 'transporte': return 'fas fa-bus';
        case 'subscripciones': return 'fas fa-bell';
        case 'gastos varios': return 'fas fa-tags';
        case 'salud': return 'fas fa-heartbeat';
        case 'agua': return 'fas fa-tint';
        case 'electricidad': return 'fas fa-bolt';
        default: return 'fas fa-money-bill';
    }
};



const eliminarTransaccion = (index) => {
    const transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    
    // Agregar la clase para deslizar fuera
    const transaccionDiv = document.querySelectorAll('.list-group-item')[index];
    transaccionDiv.classList.add('swipe-left');

    // Esperar el tiempo de la animación antes de eliminar la transacción
    setTimeout(() => {
        transacciones.splice(index, 1);
        localStorage.setItem('transacciones', JSON.stringify(transacciones));
        cargarTransacciones();
        actualizarPresupuesto();
    }, 300); // Tiempo debe coincidir con la duración de la transición CSS
};

const actualizarPresupuesto = () => {
    // Actualiza el presupuesto mensual desde el input
    presupuestoMensual = parseFloat(presupuestoInput.value) || 0;
    localStorage.setItem('presupuesto', presupuestoMensual); // Guardar presupuesto en localStorage
    
    totalGastado = 0;

    const transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    totalGastado = transacciones.reduce((acc, t) => acc + t.monto, 0); // Sumar todos los montos

    const disponible = presupuestoMensual - totalGastado;

    disponibleDiv.textContent = disponible >= 0 ? disponible : 0;
    gastadoDiv.textContent = totalGastado;

    // Mostrar presupuesto en el párrafo
    document.getElementById('presupuestoMensual').textContent = presupuestoMensual;

    // Verificar si se excedió el presupuesto
    if (totalGastado > presupuestoMensual) {
        mensajePresupuestoDiv.textContent = 'Has excedido el presupuesto';
        mensajePresupuestoDiv.style.display = 'block';
    } else {
        mensajePresupuestoDiv.style.display = 'none';
    }

    // Actualizar gráfico
    actualizarGraficoPresupuesto();
};

const agregarGasto = () => {
    const descripcionGasto = document.getElementById('descripcion-gasto').value;
    const montoGasto = parseFloat(document.getElementById('monto-gasto').value);
    const tipoGasto = document.getElementById('tipo-gasto').value;

    const disponible = presupuestoMensual - totalGastado;
    if (descripcionGasto && montoGasto && montoGasto <= disponible) {
        agregarTransaccion(descripcionGasto, montoGasto, tipoGasto);
        
        // Limpiar los inputs solo después de agregar el gasto
        document.getElementById('descripcion-gasto').value = '';
        document.getElementById('monto-gasto').value = '';
    } else {
        alert('No puedes agregar este gasto. Excede el presupuesto disponible.');
    }
};

const resetearDatos = () => {
    // Confirmar si el usuario realmente desea resetear los datos
    const confirmacion = window.confirm('¿Estás seguro de que deseas borrar todos los datos? Esto no se puede deshacer.');

    if (confirmacion) {
        // Eliminar todas las transacciones y el presupuesto del localStorage
        localStorage.removeItem('transacciones');
        localStorage.removeItem('presupuesto');

        // Reiniciar las variables
        presupuestoMensual = 0;
        totalGastado = 0;

        // Actualizar el HTML
        disponibleDiv.textContent = '0'; // Reiniciar a 0
        gastadoDiv.textContent = '0';
        transaccionesDiv.innerHTML = '';
        
        document.getElementById('presupuestoMensual').textContent = '0';
        document.getElementById('presupuesto-mensual').value = '';
        document.getElementById('descripcion-gasto').value = '';
        document.getElementById('monto-gasto').value = '';
        document.getElementById('tipo-gasto').value = '';
        
        // Ocultar el mensaje de presupuesto
        mensajePresupuestoDiv.style.display = 'none';

        // Mostrar el input del presupuesto nuevamente
        presupuestoInput.style.display = 'block'; // Mostrar el input
        togglePresupuestoBtn.textContent = 'Definir Presupuesto'; // Cambiar texto del botón

        // Actualizar gráfico
        actualizarGraficoPresupuesto();
    }
};

// Inicializar
if (presupuestoInput) {
    presupuestoInput.value = presupuestoMensual; // Inicializar el input con el presupuesto almacenado
    presupuestoInput.style.display = 'block'; // Asegurarse de que el input esté visible al iniciar
    presupuestoInput.addEventListener('input', () => {
        presupuestoMensual = parseFloat(presupuestoInput.value) || 0;
        localStorage.setItem('presupuesto', presupuestoMensual); // Guardar presupuesto en localStorage
        actualizarPresupuesto();
    });
    cargarTransacciones();
    actualizarPresupuesto();
    inicializarGraficoPresupuesto(); // Inicializar el gráfico al cargar la página

    // Agregar el evento al botón
    togglePresupuestoBtn.addEventListener('click', toggleInputPresupuesto);
}
