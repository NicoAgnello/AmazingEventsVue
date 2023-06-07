const { createApp } = Vue;

createApp({
  data() {
    return {
      events: [],
      categories: [],
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

    filterByURL(eventsData) {
      const site = document.URL.split("/").pop().split(".").shift();
      if (site === "index" || site === "") {
        this.events = [].concat(eventsData.events);
      } else if (site === "upcoming") {
        this.events = eventsData.events.filter((event) => event.date > eventsData.currentDate);
      } else if (site === "past") {
        this.events = eventsData.events.filter((event) => event.date < eventsData.currentDate);
      }
    },

    searchByText () {
      let filterEvents = this.events.filter((evento) =>
        evento.name.toLowerCase().includes(this.serchValue.toLowerCase())
      );
      return filterEvents;
    },

    searchByCheckbox (eventsToFilter) {
      let appliedFilters = [];
      for (let input of this.checked) {
        appliedFilters.push(input.toLowerCase());
      }
      if (appliedFilters.length === 0) {
        return eventsToFilter;
      }
      let filterCheckbox = eventsToFilter.filter((event) => appliedFilters.includes(event.category.toLowerCase()));
      return filterCheckbox;
    },

    crossFilter () {
      let filterEventsBySerch = this.searchByText();
      let filterEventsByCkeck = this.searchByCheckbox(filterEventsBySerch);
      if (filterEventsByCkeck.length === 0) {
        this.filterEvents = null;
      } else {
        this.filterEvents = filterEventsByCkeck;
      }
    },
  },
}).mount("#app");
