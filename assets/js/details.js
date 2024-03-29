const { createApp } = Vue;

createApp({
  data() {
    return {
      events: [],
      eventId: [],
    };
  },
  created() {
    fetch("https://mindhub-xj03.onrender.com/api/amazing")
      .then((resolve) => resolve.json())
      .then((data) => {
        this.events = data.events;
        this.generateId(this.events);
      })
      .catch((error) => console.log(error));
  },
  methods: {
    generateId: function (events) {
      let stringUrlWithID = location.search;
      let generarUrl = new URLSearchParams(stringUrlWithID);
      let id = generarUrl.get("id");
      this.eventId = events.find((evento) => evento._id == id);
    },
  },
}).mount("#app");
