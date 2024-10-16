# 📊 Sistema de Finanzas Personal

Este proyecto es un sistema de finanzas personal que permite a los usuarios gestionar sus ingresos, gastos, y realizar un seguimiento de sus finanzas, con la ventaja de guardar los datos localmente mediante Local Storage. Además, se han implementado funcionalidades adicionales como un gestor de tareas rápidas, visualización de precios de criptomonedas en tiempo real, y manejo seguro de contraseñas encriptadas.

#🚀 Funcionalidades principales
1. Gestión de Finanzas
Seguimiento de ingresos y gastos.
Sección de flujo de caja para visualizar el balance financiero.
Posibilidad de establecer un presupuesto mensual y recibir alertas cuando se excede el presupuesto.
Clasificación de gastos en diferentes categorías: comida, casa, ahorro, universidad, transporte, suscripciones, gastos varios, salud.
Los datos se guardan en Local Storage, permitiendo que las finanzas se mantengan persistentes incluso al refrescar la página.
2. Tareas Rápidas
Sección dedicada a crear y gestionar tareas rápidas con una interfaz estilo "sticky notes".
Las tareas se guardan en Local Storage, por lo que no se pierden después de cerrar el navegador.
Funcionalidad para marcar tareas completadas y eliminarlas fácilmente.
3. Criptomonedas en Tiempo Real
Visualización de los precios de criptomonedas en tiempo real con actualizaciones rápidas.
Precios de las principales criptomonedas (Bitcoin, Ethereum, etc.) sin usar CoinGecko para mejorar la velocidad de actualización.
El sistema permite ver las fluctuaciones de precios al instante para un mejor control de inversiones.
4. Manejo de Contraseñas Encriptadas
Función de gestión de contraseñas con encriptación.
Las contraseñas almacenadas en el sistema están protegidas mediante bcrypt y solo pueden ser desencriptadas con la contraseña maestra.
Las contraseñas se guardan encriptadas en Local Storage como un objeto JSON para mayor seguridad.
🛠️ Tecnologías Utilizadas
HTML5 para la estructura de la aplicación.
CSS3 para la presentación visual.
JavaScript (ES6) para la lógica y la interacción con Local Storage.
bcrypt para la encriptación de contraseñas.
API de criptomonedas en tiempo real (alternativa a CoinGecko).

#📝 Cómo usar el sistema
Clona el repositorio:

bash
Copiar código
git clone https://github.com/RonaldArc503/Finance_system.git
Abre el proyecto en tu navegador: Simplemente abre el archivo index.html en tu navegador favorito.

#📈 Mejoras Futuras
Gráficas de tendencias financieras para mostrar el rendimiento de las finanzas a lo largo del tiempo.
Sincronización en la nube para que los datos estén disponibles desde cualquier dispositivo.
Soporte para múltiples monedas en el sistema de finanzas.
Autenticación de usuarios para un acceso más seguro al sistema.
