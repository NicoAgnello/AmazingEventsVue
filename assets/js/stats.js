const { createApp } = Vue;

createApp({
  data() {
    return {
      events: null,
      eventsWithAttendance: null,
      eventsSortByCapacity: null,
      upcomingRevenueAttdc: null,
      pastRevenueAttdc: null,
    };
  },
  created() {
    fetch("https://mindhub-xj03.onrender.com/api/amazing")
      .then((resolve) => resolve.json())
      .then((data) => {
        this.events = data.events;
        this.attendance(this.events);
        this.largerCapacity(this.events);
        this.upcomingByCategory(data);
        this.pastByCategory(data);
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
    upcomingByCategory: function (eventsData) {
      const upcomingEvents = eventsData.events.filter((event) => event.date > eventsData.currentDate);
      const revenueAttendanceUpcoming = upcomingEvents.map((e) => ({
        ...e,
        revenue: (e.price * e.estimate).toLocaleString(),
        attendance: (((e.assistance ?? e.estimate) / e.capacity) * 100).toFixed(2),
      }));
      this.upcomingRevenueAttdc = revenueAttendanceUpcoming;
    },
    pastByCategory: function (eventsData) {
      const pastEvents = eventsData.events.filter((event) => event.date < eventsData.currentDate);
      const revenueAttendancePast = pastEvents.map((e) => ({
        ...e,
        revenue: (e.price * e.assistance).toLocaleString(),
        attendance: (((e.assistance ?? e.estimate) / e.capacity) * 100).toFixed(2),
      }));
      this.pastRevenueAttdc = revenueAttendancePast;
    },
  },
}).mount("#app");
