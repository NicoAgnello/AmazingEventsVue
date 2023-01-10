fetch("https://mindhub-xj03.onrender.com/api/amazing")
  .then((resolve) => resolve.json())
  .then((datos) => {
    document.getElementById("message").innerHTML = "";
    generarCardDetails(datos.events.find((evento) => evento._id === id));
  })
  .catch(
    () => (document.getElementById("message").innerHTML = `<h2 class="text-center p-4">Error trying to fetch data</h2>`)
  );

const stringUrlConID = location.search;

const generarUrl = new URLSearchParams(stringUrlConID);

const id = generarUrl.get("id");

const contenedorDetails = document.getElementById("contenedor-details");

function generarCardDetails(evento) {
  contenedorDetails.innerHTML = "";
  let template;
  if (evento) {
    template = `<div class="row d-flex flex-row justify-content-evenly gap-2 ">
    <img class=" col-12 col-xl-5 d-flex justify-content-center "
        src="${evento.image}" alt="imagen-details">
    <div class="card col-12 col-xl-6 box-detalles">
        <div class="card-body cuerpo-details ">
            <h5 class=" text-center ">${evento.name}</h5>
            <p class="card-text text-center ">${evento.description}</p>
            <ul class="d-flex flex-column gap-3 text-center p-0 lista-details">
                <li class="list-group-item">Category:${evento.category}</li>
                <li class="list-group-item">Place: ${evento.place}</li>
                <li class="list-group-item">Capacity: ${evento.capacity} </li>
                <li class="list-group-item">${evento.assistance ? "Assistance" : "Estimate"}: ${
      evento.assistance ? evento.assistance : evento.estimate
    }</li>
            </ul>
            <div class=" price-date-details p-2">
                <h6 class="card-title text-center">${evento.date}</h6>
                <h6 class="card-title text-center">Price: $${evento.price}</h6>
            </div>
        </div>
    </div>
</div>`;
  } else {
    template = `<h2 class="text-center p-4">No matches</h2>`;
  }
  contenedorDetails.innerHTML = template;
}
