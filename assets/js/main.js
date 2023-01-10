let events;

fetch("https://mindhub-xj03.onrender.com/api/amazing")
  .then((resolve) => resolve.json())
  .then((datos) => {
    filterEvents(datos);
    document.getElementById("message").innerHTML = "";
    generarTemplate(events);
    generarChecks();
    botonBuscar.addEventListener("click", dobleFiltro);
    checkboxs.addEventListener("input", dobleFiltro);
  })
  .catch(
    () => (document.getElementById("message").innerHTML = `<h2 class="text-center p-4">Error trying to fetch data</h2>`)
  );

function filterEvents(eventsData) {
  const sitio = document.URL.split("/").pop().split(".").shift();
  if (sitio === "index" || sitio === "") {
    events = [].concat(eventsData.events);
  } else if (sitio === "upcoming") {
    events = eventsData.events.filter((evento) => evento.date > eventsData.currentDate);
  } else if (sitio === "past") {
    events = eventsData.events.filter((evento) => evento.date < eventsData.currentDate);
  }
}

function generarTemplate(eventsToDisplay) {
  let template = "";
  for (const event of eventsToDisplay) {
    template += `
    <div class="col p-4">
        <div class="card carta">
            <img src="${event.image}" class="card-img-top" alt="fiesta-comida">
            <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title text-center">${event.name}</h5>
                <p class="card-text text-center">${event.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="card-text">Price: ${event.price}</h6>
                    <a class="ver-mas" href="./details.html?id=${event._id}">See more...</a>
                </div>
            </div>
        </div>
    </div>
    `;
  }
  document.getElementById("sectionCards").innerHTML = template;
}

const checkboxs = document.getElementById("checkbox-js");
const buscador = document.getElementById("buscador-js");
const botonBuscar = document.getElementById("boton-buscar");

function generarChecks() {
  const categorias = new Set(events.map((evento) => evento.category));
  let template = "";
  for (const categoria of categorias) {
    template += `
    <label class="d-flex flex-column ">
          <input class="checkboxes" id="${categoria}" type="checkbox" name="${categoria}">
          ${categoria}
      </label>
    `;
  }
  checkboxs.innerHTML = template;
}

function busquedaPorTexto() {
  let eventosFiltrados = events.filter((evento) => evento.name.toLowerCase().includes(buscador.value.toLowerCase()));
  return eventosFiltrados;
}

function filtroCheckbox(eventsToFilter) {
  const checkboxes = document.querySelectorAll(".checkboxes");
  const filtrosAplicados = [];
  for (const input of checkboxes) {
    if (input.checked) {
      filtrosAplicados.push(input.name.toLowerCase());
    }
  }
  if (filtrosAplicados.length === 0) {
    return eventsToFilter;
  }
  const eventosFiltrados = eventsToFilter.filter((evento) => filtrosAplicados.includes(evento.category.toLowerCase()));
  return eventosFiltrados;
}

function dobleFiltro() {
  const eventosFiltradosPorBusqueda = busquedaPorTexto();
  const eventosFiltradosPorCheck = filtroCheckbox(eventosFiltradosPorBusqueda);
  if (eventosFiltradosPorCheck.length === 0) {
    generarError();
  } else {
    generarTemplate(eventosFiltradosPorCheck);
    document.getElementById("message").innerHTML = "";
  }
}

function generarError() {
  document.getElementById("sectionCards").innerHTML = "";
  let template = `<h2 class="text-center p-4">No matches, please change filters</h2>`;
  document.getElementById("message").innerHTML = template;
}
