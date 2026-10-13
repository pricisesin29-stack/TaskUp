# Organizador de tareas y clima

## Descripción
Aplicación web en español para crear, visualizar, completar y eliminar tareas. Los datos se guardan en LocalStorage. También permite consultar el clima actual de una ciudad mediante la API de OpenWeather.

## Tecnologías
- HTML
- CSS
- JavaScript
- LocalStorage
- Fetch API, async/await y try/catch
- OpenWeather API

## Cómo ejecutar
1. Abrir la carpeta del proyecto en Visual Studio Code.
2. Configurar una clave personal de OpenWeather en `script.js`, en la constante `API_KEY`.
3. Abrir `index.html` con Live Server.
4. Agregar, completar y eliminar tareas. Recargar la página para comprobar que los datos siguen guardados.
5. Consultar el clima escribiendo el nombre de una ciudad.

## Estructura
- `index.html`: estructura de la página.
- `estilos.css`: diseño visual y estilos adaptables.
- `script.js`: lógica de tareas, LocalStorage y consulta del clima.

## Nota
LocalStorage guarda los datos en el navegador y dispositivo donde se usa la aplicación. La clave de OpenWeather es personal; no la publiques en un repositorio público.
