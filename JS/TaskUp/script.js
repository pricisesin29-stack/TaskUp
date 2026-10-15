/*
  TRABAJO PRACTICO: Organizador de tareas y clima
  Conceptos utilizados:
  - Array de objetos
  - DOM y eventos
  - LocalStorage
  - API con fetch, async/await y try/catch
*/


const API_KEY = "801b6ffdf78c7f95146f99918c15206b";

// 2. SELECCIONAR ELEMENTOS DEL HTML
const formularioTarea = document.querySelector("#formulario-tarea");
const campoNombre = document.querySelector("#nombre-tarea");
const campoCategoria = document.querySelector("#categoria-tarea");
const campoPrioridad = document.querySelector("#prioridad-tarea");
const listaTareas = document.querySelector("#lista-tareas");
const contadorTareas = document.querySelector("#contador-tareas");

const formularioClima = document.querySelector("#formulario-clima");
const campoCiudad = document.querySelector("#ciudad");
const resultadoClima = document.querySelector("#resultado-clima");

// 3. RECUPERAR LOS DATOS GUARDADOS
// Si todavía no hay tareas guardadas, comenzamos con un array vacío.
let tareas = [];

try {
  const tareasGuardadas = localStorage.getItem("misTareas");
  tareas = tareasGuardadas ? JSON.parse(tareasGuardadas) : [];

  // Verificamos que los datos recuperados sean un array.
  if (!Array.isArray(tareas)) {
    tareas = [];
  }
} catch (error) {
  console.error("No se pudieron recuperar las tareas:", error);
  tareas = [];
}

// 4. GUARDAR EL ARRAY EN LOCALSTORAGE
function guardarTareas() {
  localStorage.setItem("misTareas", JSON.stringify(tareas));
}

// 5. MOSTRAR LAS TAREAS EN LA PAGINA (READ)
function mostrarTareas() {
  listaTareas.innerHTML = "";

  if (tareas.length === 0) {
    listaTareas.innerHTML = `
      <p class="mensaje-vacio">
        Todavía no agregaste tareas. ¡Usá el formulario para comenzar!
      </p>
    `;
  }

  tareas.forEach(function(tarea) {
    const tarjeta = document.createElement("article");
    tarjeta.className = tarea.completada
      ? "tarjeta-tarea completada"
      : "tarjeta-tarea";

    // Se usa textContent para mostrar el texto escrito por el usuario
    // sin interpretarlo como código HTML.
    const contenido = document.createElement("div");

    const nombre = document.createElement("h3");
    nombre.className = "nombre-tarea";
    nombre.textContent = tarea.nombre;

    const etiquetas = document.createElement("div");
    etiquetas.className = "etiquetas";

    const categoria = document.createElement("span");
    categoria.className = "etiqueta";
    categoria.textContent = tarea.categoria;

    const prioridad = document.createElement("span");
    prioridad.className = "etiqueta prioridad-" + tarea.prioridad.toLowerCase();
    prioridad.textContent = "Prioridad " + tarea.prioridad;

    etiquetas.append(categoria, prioridad);

    const estado = document.createElement("p");
    estado.className = "estado-tarea";
    estado.textContent = tarea.completada
      ? "Estado: completada"
      : "Estado: pendiente";

    contenido.append(nombre, etiquetas, estado);

    const acciones = document.createElement("div");
    acciones.className = "acciones-tarea";

    const botonEstado = document.createElement("button");
    botonEstado.type = "button";
    botonEstado.className = "boton-pequeno";
    botonEstado.dataset.accion = "cambiar-estado";
    botonEstado.dataset.id = tarea.id;
    botonEstado.textContent = tarea.completada
      ? "Marcar pendiente"
      : "Completar";

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "boton-pequeno boton-eliminar";
    botonEliminar.dataset.accion = "eliminar";
    botonEliminar.dataset.id = tarea.id;
    botonEliminar.textContent = "Eliminar";

    acciones.append(botonEstado, botonEliminar);
    tarjeta.append(contenido, acciones);
    listaTareas.append(tarjeta);
  });

  const pendientes = tareas.filter(function(tarea) {
    return !tarea.completada;
  }).length;

  contadorTareas.textContent = tareas.length + 
    (tareas.length === 1 ? " tarea" : " tareas") +
    " · " + pendientes + " pendientes";
}

// 6. AGREGAR TAREAS (CREATE)
formularioTarea.addEventListener("submit", function(evento) {
  evento.preventDefault();

  const nombre = campoNombre.value.trim();
  const categoria = campoCategoria.value;
  const prioridad = campoPrioridad.value;

  if (nombre === "" || categoria === "" || prioridad === "") {
    alert("Completá todos los campos antes de agregar la tarea.");
    return;
  }

  const nuevaTarea = {
    id: Date.now(),
    nombre: nombre,
    categoria: categoria,
    prioridad: prioridad,
    completada: false
  };

  tareas.push(nuevaTarea);
  guardarTareas();
  mostrarTareas();
  formularioTarea.reset();
  campoNombre.focus();
});

// 7. COMPLETAR O ELIMINAR TAREAS (UPDATE / DELETE)
// Escuchamos los clics en la lista y reconocemos qué botón se presionó.
listaTareas.addEventListener("click", function(evento) {
  const boton = evento.target.closest("button");

  if (!boton) {
    return;
  }

  const id = Number(boton.dataset.id);
  const accion = boton.dataset.accion;

  if (accion === "cambiar-estado") {
    tareas = tareas.map(function(tarea) {
      if (tarea.id === id) {
        return {
          ...tarea,
          completada: !tarea.completada
        };
      }

      return tarea;
    });
  }

  if (accion === "eliminar") {
    const confirmar = confirm("¿Seguro que querés eliminar esta tarea?");

    if (!confirmar) {
      return;
    }

    tareas = tareas.filter(function(tarea) {
      return tarea.id !== id;
    });
  }

  guardarTareas();
  mostrarTareas();
});

// 8. CONSULTAR EL CLIMA CON ASYNC / AWAIT
async function obtenerClima(ciudad) {
  if (!API_KEY || API_KEY === "PEGÁ_ACÁ_TU_API_KEY") {
    resultadoClima.innerHTML =
      "<p>Primero tenés que configurar tu clave personal de OpenWeather en script.js.</p>";
    return;
  }

  resultadoClima.innerHTML = "<p>Buscando el clima...</p>";

  const ciudadCodificada = encodeURIComponent(ciudad);
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" +
    ciudadCodificada + "&appid=" + API_KEY + "&units=metric&lang=es";

  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      if (respuesta.status === 404) {
        throw new Error("No encontramos esa ciudad. Revisá cómo la escribiste.");
      }

      if (respuesta.status === 401) {
        throw new Error("La clave de OpenWeather no es válida o todavía no está activa.");
      }

      throw new Error("No se pudo consultar el clima. Código: " + respuesta.status);
    }

    const datos = await respuesta.json();
    const temperatura = Math.round(datos.main.temp);
    const sensacion = Math.round(datos.main.feels_like);
    const descripcion = datos.weather[0].description;
    const nombreCiudad = datos.name;
    const pais = datos.sys.country;

    resultadoClima.innerHTML = `
      <div class="datos-clima">
        <div>
          <p><strong>${nombreCiudad}, ${pais}</strong></p>
          <p class="temperatura">${temperatura} °C</p>
        </div>
        <div>
          <p>${descripcion}</p>
          <p>Sensación térmica: ${sensacion} °C</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error al obtener el clima:", error);
    resultadoClima.textContent = error.message ||
      "No se pudo cargar el clima. Revisá tu conexión e intentá de nuevo.";
  }
}

// El formulario permite consultar el clima de la ciudad ingresada.
formularioClima.addEventListener("submit", function(evento) {
  evento.preventDefault();

  const ciudad = campoCiudad.value.trim();

  if (ciudad === "") {
    resultadoClima.textContent = "Escribí el nombre de una ciudad.";
    return;
  }

  obtenerClima(ciudad);
});

// 9. MOSTRAR LOS DATOS GUARDADOS CUANDO SE ABRE LA PAGINA
mostrarTareas();
