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
      const site = document.URL.split("/").pop().split(".").shift();
      if (site === "index" || site === "") {
        this.events = [].concat(eventsData.events);
      } else if (site === "upcoming") {
        this.events = eventsData.events.filter((event) => event.date > eventsData.currentDate);
      } else if (site === "past") {
        this.events = eventsData.events.filter((event) => event.date < eventsData.currentDate);
      }
    },
    searchByText: function () {
      let filterEvents = this.events.filter((evento) =>
        evento.name.toLowerCase().includes(this.serchValue.toLowerCase())
      );
      return filterEvents;
    },
    searchByCheckbox: function (eventsToFilter) {
      const appliedFilters = [];
      for (const input of this.checked) {
        appliedFilters.push(input.toLowerCase());
      }
      if (appliedFilters.length === 0) {
        return eventsToFilter;
      }
      const filterCheckbox = eventsToFilter.filter((event) => appliedFilters.includes(event.category.toLowerCase()));
      return filterCheckbox;
    },
    crossFilter: function () {
      const filterEventsBySerch = this.searchByText();
      const filterEventsByCkeck = this.searchByCheckbox(filterEventsBySerch);
      if (filterEventsByCkeck.length === 0) {
        this.filterEvents = null;
      } else {
        this.filterEvents = filterEventsByCkeck;
      }
    },
  },
}).mount("#app");
