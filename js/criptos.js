const cryptoListElement = document.getElementById("crypto-list");
const cryptoChartElement = document.getElementById("crypto-chart");

let chart = null; // Variable para almacenar el gráfico

async function fetchCryptoPrices() {
    const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbols=[\"BTCUSDT\",\"ETHUSDT\",\"XRPUSDT\",\"LTCUSDT\",\"ADAUSDT\"]");
    const data = await response.json();
    return data;
}

function displayCryptoPrices(cryptos) {
    cryptoListElement.innerHTML = ""; // Limpiar la lista actual
    const prices = []; // Array para almacenar los precios
    const labels = []; // Array para almacenar los nombres de las criptomonedas

    cryptos.forEach(crypto => {
        const cryptoItem = document.createElement("div");
        cryptoItem.className = "crypto-item"; // Asignar clase para el estilo

        // Crear contenido HTML para cada criptomoneda
        cryptoItem.innerHTML = `
            <h3>${crypto.symbol.replace("USDT", "")}</h3>
            <span>$${parseFloat(crypto.price).toFixed(2)} USD</span>
        `;
        
        // Añadir el div a la lista
        cryptoListElement.appendChild(cryptoItem);

        // Almacenar datos para el gráfico
        labels.push(crypto.symbol.replace("USDT", ""));
        prices.push(parseFloat(crypto.price));
    });

    // Actualizar el gráfico
    updateChart(labels, prices);
}

function updateChart(labels, prices) {
    if (chart) {
        chart.destroy(); // Destruir el gráfico anterior si existe
    }
    
    chart = new Chart(cryptoChartElement, {
        type: 'bar', // Puedes cambiar a 'line' o cualquier otro tipo de gráfico
        data: {
            labels: labels,
            datasets: [{
                label: 'Precios de Criptomonedas (USD)',
                data: prices,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Precio (USD)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Criptomonedas'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false // Para que se ajuste al contenedor
        }
    });
}

async function updateCryptoData() {
    try {
        const cryptos = await fetchCryptoPrices();
        displayCryptoPrices(cryptos);
    } catch (error) {
        console.error("Error fetching cryptocurrency prices:", error);
        cryptoListElement.innerHTML = "Error al obtener los precios de las criptomonedas.";
    }
}

// Actualiza los precios cada 2 segundos
setInterval(updateCryptoData, 2000); // Cambia a 20 segundos para pruebas más cortas
updateCryptoData(); // Llama a la función inmediatamente al cargar la página
