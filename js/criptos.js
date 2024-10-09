const cryptoListElement = document.getElementById("crypto-list");
const cryptoChartElement = document.getElementById("crypto-chart");

let chart = null; // Variable para almacenar el gráfico

async function fetchCryptoPrices() {
    const response = await fetch("https://api.binance.com/api/v3/ticker/24hr?symbols=[\"BTCUSDT\",\"ETHUSDT\",\"XRPUSDT\",\"LTCUSDT\",\"ADAUSDT\"]");
    const data = await response.json();
    return data;
}

async function fetchHistoricalData(symbol) {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=24`);
    const data = await response.json();
    return data;
}

function displayCryptoPrices(cryptos) {
    cryptoListElement.innerHTML = ""; // Limpiar la lista actual

    cryptos.forEach(crypto => {
        const cryptoItem = document.createElement("div");
        cryptoItem.className = "crypto-item"; // Asignar clase para el estilo

        // Calcular el porcentaje de cambio
        const priceChangePercent = parseFloat(crypto.priceChangePercent).toFixed(2);
        const price = parseFloat(crypto.lastPrice).toFixed(2);
        
        // Determinar el color y el símbolo (+/-) según el cambio de precio
        const priceColor = priceChangePercent >= 0 ? 'green' : 'red';
        const sign = priceChangePercent >= 0 ? '+' : '';

        // Crear contenido HTML para cada criptomoneda
        cryptoItem.innerHTML = `
            <h3 style="cursor: pointer;" onclick="showCryptoChart('${crypto.symbol}')">${crypto.symbol.replace("USDT", "")}</h3>
            <span>$${price} USD</span>
            <span style="color: ${priceColor};">(${sign}${priceChangePercent}%)</span>
        `;
        
        // Añadir el div a la lista
        cryptoListElement.appendChild(cryptoItem);
    });
}

function updateChart(labels, prices) {
    if (chart) {
        chart.destroy(); // Destruir el gráfico anterior si existe
    }
    
    chart = new Chart(cryptoChartElement, {
        type: 'line', // Cambiar a gráfico de líneas
        data: {
            labels: labels,
            datasets: [{
                label: 'Precios de Criptomonedas (USD)',
                data: prices,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4 // Suaviza la línea
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Precio (USD)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Hora'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false // Para que se ajuste al contenedor
        }
    });
}

async function showCryptoChart(symbol) {
    const historicalData = await fetchHistoricalData(symbol);
    const labels = historicalData.map(data => new Date(data[0]).toLocaleTimeString());
    const prices = historicalData.map(data => parseFloat(data[4])); // Precio de cierre

    updateChart(labels, prices);
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
setInterval(updateCryptoData, 2000);
updateCryptoData(); // Llama a la función inmediatamente al cargar la página
