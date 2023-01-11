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
    busquedaPorTexto: function () {
      let eventosFiltrados = this.events.filter((evento) =>
        evento.name.toLowerCase().includes(this.serchValue.toLowerCase())
      );
      return eventosFiltrados;
    },
    filtroCheckbox: function (eventsToFilter) {
      const filtrosAplicados = [];
      for (const input of this.checked) {
        filtrosAplicados.push(input.toLowerCase());
      }
      console.log(filtrosAplicados);
      if (filtrosAplicados.length === 0) {
        return eventsToFilter;
      }
      const eventosFiltrados = eventsToFilter.filter((evento) =>
        filtrosAplicados.includes(evento.category.toLowerCase())
      );
      return eventosFiltrados;
    },
    dobleFiltro: function () {
      const eventosFiltradosPorBusqueda = this.busquedaPorTexto();
      const eventosFiltradosPorCheck = this.filtroCheckbox(eventosFiltradosPorBusqueda);
      if (eventosFiltradosPorCheck.length === 0) {
        this.filterEvents = null;
      } else {
        this.filterEvents = eventosFiltradosPorCheck;
      }
    },
  },
}).mount("#app");
