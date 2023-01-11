const { createApp } = Vue;

createApp({
  data() {
    return {
      events: null,
      eventsWithAttendance: null,
      eventsSortByCapacity: null,
      pastEvents: null,
      upcomingEvents: null,
      pastCategory: null,
      upcomingCategory: null,
    };
  },
  created() {
    fetch("https://mindhub-xj03.onrender.com/api/amazing")
      .then((resolve) => resolve.json())
      .then((data) => {
        this.events = data.events;
        this.upcomingEvents = data.events.filter((event) => event.date > data.currentDate);
        this.pastEvents = data.events.filter((event) => event.date < data.currentDate);
        this.attendance(this.pastEvents);
        this.largerCapacity(this.events);
        this.eventsByCategory(this.upcomingEvents);
        this.eventsByCategory(this.pastEvents);
      })
      .catch((error) => console.log(error));
  },
  methods: {
    attendance: function (events) {
      const eventsByAttendance = events
        .map((e) => ({
          ...e,
          attendance: (((e.assistance ?? e.estimate) / e.capacity) * 100).toFixed(2),
        }))
        .sort((a, b) => b.attendance - a.attendance);
      this.eventsWithAttendance = eventsByAttendance;
    },
    largerCapacity: function (events) {
      const eventsByCapacity = events.sort((a, b) => b.capacity - a.capacity);
      this.eventsSortByCapacity = eventsByCapacity;
    },
    eventsByCategory: function (eventsData) {
      const revenueAttendanceUpcoming = eventsData.map((e) => ({
        ...e,
        revenue: (e.price * (e.estimate ?? e.assistance)).toLocaleString(),
        attendance: (((e.assistance ?? e.estimate) / e.capacity) * 100).toFixed(2),
        aux: 1,
      }));
      let upcomingObject = {};
      for (const event of revenueAttendanceUpcoming) {
        if (!Object.hasOwn(upcomingObject, event.category)) {
          upcomingObject[event.category] = { ...event };
        } else {
          upcomingObject[event.category].revenue += event.revenue;
          upcomingObject[event.category].attendance += event.attendance;
          upcomingObject[event.category].aux++;
        }
      }
      upcomingObject = Object.values(upcomingObject);
      upcomingObject.forEach((event) => {
        event.attendance /= event.aux;
      });
      if (eventsData == this.pastEvents) {
        this.pastCategory = upcomingObject;
      } else {
        this.upcomingCategory = upcomingObject;
      }
    },
  },
}).mount("#app");
