document.getElementById('generarPDF').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtener el nombre del usuario desde localStorage (puedes cambiar la clave si es necesario)
   // Obtener el array de usuarios del localStorage
let users = JSON.parse(localStorage.getItem('users'));

// Si el array tiene al menos un usuario, extraer el nombre de usuario
let nombreUsuario = users && users.length > 0 ? users[0].username : 'Usuario';

    

    // Estilos
    const titleColor = [0, 102, 204]; // Azul para el título
    const textColor = [51, 51, 51];   // Gris oscuro para el texto
    const lineColor = [204, 204, 204]; // Gris claro para las líneas y bordes

    // Título del PDF
    doc.setTextColor(...titleColor);
    doc.setFontSize(22);
    doc.text('Reporte de Ahorros', 105, 20, { align: 'center' });

    // Saludo con el nombre del usuario
    doc.setTextColor(...textColor);
    doc.setFontSize(16);
    doc.text(`Hola, ${nombreUsuario}!`, 20, 40);

    // Introducción
    doc.setFontSize(12);
    doc.text(`Aquí tienes un resumen de tus ahorros registrados en nuestra plataforma.`, 20, 50);

    // Línea divisoria
    doc.setDrawColor(...lineColor);
    doc.line(20, 55, 190, 55);

    // Mostrar el historial de ahorros
    let historialAhorro = JSON.parse(localStorage.getItem('historialAhorro')) || [];
    let totalAhorros = calcularTotalAcumulado(historialAhorro); // Calcula el total acumulado

    doc.setFontSize(14);
    doc.setTextColor(...titleColor);
    doc.text('Historial de Ahorros:', 20, 70);

    // Dibujar tabla
    const startY = 80;
    let yPos = startY;

    doc.setFontSize(12);
    doc.setTextColor(...textColor);

    // Agregar encabezados de la tabla
    doc.setFillColor(...lineColor);
    doc.rect(20, yPos, 170, 10, 'F');
    doc.setFontSize(12);
    doc.text('Mes', 25, yPos + 7);
    doc.text('Cantidad Ahorrada', 145, yPos + 7);

    // Agregar cada entrada del historial
    yPos += 15; // Espacio entre la cabecera y el contenido de la tabla
    historialAhorro.forEach((ahorro, index) => {
        doc.text(`${ahorro.fecha}`, 25, yPos);
        doc.text(`$${ahorro.cantidad}`, 145, yPos, { align: 'right' });
        yPos += 10;
    });

    // Línea divisoria para el total
    doc.setDrawColor(...lineColor);
    doc.line(20, yPos + 5, 190, yPos + 5);
    
    // Mostrar el total acumulado
    doc.setTextColor(...textColor);
    doc.setFontSize(14);
    doc.text(`Total acumulado: $${totalAhorros}`, 20, yPos + 15);

    // Descarga del PDF
    doc.save(`reporte_ahorros_${nombreUsuario}.pdf`);

    function calcularTotalAcumulado(historial) {
        return historial.reduce((total, ahorro) => total + parseFloat(ahorro.cantidad), 0);
    }
});
