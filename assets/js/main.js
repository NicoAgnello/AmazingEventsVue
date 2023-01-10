const { createApp } = Vue;

createApp({
  data() {
    return {
      events: null,
      categories: null,
      serchValue: "",
      checked: [],
      filterEvents: [],
    };
  },
  created() {
    fetch("https://mindhub-xj03.onrender.com/api/amazing")
      .then((response) => response.json())
      .then((data) => {
        this.filterByURL(data);
        this.filterEvents = [...this.events];
        document.getElementById("message").innerHTML = "";
        this.categories = [...new Set(data.events.map((event) => event.category))];
      })
      .catch((error) => console.log(error));
  },
  methods: {
    filterByURL: function (eventsData) {
      const sitio = document.URL.split("/").pop().split(".").shift();
      if (sitio === "index" || sitio === "") {
        this.events = [].concat(eventsData.events);
      } else if (sitio === "upcoming") {
        this.events = eventsData.events.filter((evento) => evento.date > eventsData.currentDate);
      } else if (sitio === "past") {
        this.events = eventsData.events.filter((evento) => evento.date < eventsData.currentDate);
      }
    },
    dobleFiltro: function () {
      let eventosFiltradosPorBusqueda = this.events.filter((evento) =>
        evento.name.toLowerCase().includes(this.serchValue.toLowerCase())
      );
      if (this.checked.length === 0) {
        this.filterEvents = eventosFiltradosPorBusqueda;
      } else {
        let eventosFiltradosPorCheck = eventosFiltradosPorBusqueda.filter((event) =>
          this.checked.includes(event.category)
        );
        if (eventosFiltradosPorCheck.length === 0) {
          this.generarError();
        } else {
          document.getElementById("message").innerHTML = "";
          this.filterEvents = eventosFiltradosPorCheck;
        }
      }
    },
    generarError: function () {
      this.filterEvents = "";
      let template = `<h2 class="text-center p-4">No matches, please change filters</h2>`;
      document.getElementById("message").innerHTML = template;
    },
  },
}).mount("#app");
