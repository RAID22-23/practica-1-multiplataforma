const STORAGE_KEY = "task-list";
let tareas = [];

const cargarTareas = () => {
  try {
    const datos = localStorage.getItem(STORAGE_KEY);
    tareas = datos ? JSON.parse(datos) : [];
  } catch {
    tareas = [];
  }
};

const guardarTareas = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
  } catch {}
};

const crearElementoTarea = (tarea, index) => {
  const li = document.createElement("li");
  li.className = "task-item";

  const texto = document.createElement("span");
  texto.textContent = `${index + 1}. ${tarea.descripcion}`;
  if (tarea.completada) {
    texto.classList.add("completed");
    texto.innerHTML = `<del>${texto.innerHTML}</del>`;
  }

  const acciones = document.createElement("div");
  acciones.className = "task-actions";

  const btnCompletar = document.createElement("button");
  btnCompletar.textContent = tarea.completada ? "Desmarcar" : "Completar";
  btnCompletar.className = "btn-complete";
  btnCompletar.dataset.index = index;

  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "Eliminar";
  btnEliminar.className = "btn-delete";
  btnEliminar.dataset.index = index;

  acciones.append(btnCompletar, btnEliminar);
  li.append(texto, acciones);
  return li;
};

const renderizarTareas = () => {
  const lista = document.getElementById("task-list");
  if (!lista) return;
  lista.innerHTML = "";

  if (!tareas.length) {
    const li = document.createElement("li");
    li.textContent = "No hay tareas disponibles.";
    lista.appendChild(li);
    return;
  }

  tareas.forEach((t, i) => lista.appendChild(crearElementoTarea(t, i)));
};

const agregarTarea = (descripcion) => {
  const texto = (descripcion || "").trim();
  if (!texto) {
    alert("Ingrese una descripción de tarea válida.");
    return false;
  }
  tareas.push({ descripcion: texto, completada: false });
  guardarTareas();
  renderizarTareas();
  return true;
};

const toggleCompletar = (indice) => {
  if (indice < 0 || indice >= tareas.length) return;
  tareas[indice].completada = !tareas[indice].completada;
  guardarTareas();
  renderizarTareas();
};

const eliminarTarea = (indice) => {
  if (indice < 0 || indice >= tareas.length) return;
  tareas.splice(indice, 1);
  guardarTareas();
  renderizarTareas();
};

document.addEventListener("DOMContentLoaded", () => {
  cargarTareas();
  renderizarTareas();

  document.getElementById("add-task").addEventListener("click", () => {
    const input = document.getElementById("new-task");
    if (agregarTarea(input.value)) {
      input.value = "";
      input.focus();
    }
  });

  document.getElementById("new-task").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const input = document.getElementById("new-task");
      if (agregarTarea(input.value)) {
        input.value = "";
        input.focus();
      }
    }
  });

  document.getElementById("task-list").addEventListener("click", (e) => {
    const btn = e.target;
    if (btn.classList.contains("btn-complete")) {
      toggleCompletar(parseInt(btn.dataset.index, 10));
    } else if (btn.classList.contains("btn-delete")) {
      eliminarTarea(parseInt(btn.dataset.index, 10));
    }
  });
});
