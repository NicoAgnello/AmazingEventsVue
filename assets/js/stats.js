fetch("https://mindhub-xj03.onrender.com/api/amazing")
  .then((resolve) => resolve.json())
  .then((datos) => {
    const eventsByAttendance = attendance(datos.events);
    mostAttendance(eventsByAttendance);
    lowestAttendance(eventsByAttendance);
    largerCapacity(eventsByAttendance);
    upcomingByCategory(datos);
    pastByCategory(datos);
  })
  .catch((error) => console.log(error));

function attendance(events) {
  const eventsByAttendance = events
    .map((e) => ({
      ...e,
      attendance: ((e.assistance ?? e.estimate) / e.capacity) * 100,
    }))
    .sort((a, b) => b.attendance - a.attendance);
  return eventsByAttendance;
}

function mostAttendance(events) {
  document.getElementById("highest-attendance").innerHTML = `${events[0].name} ${events[0].attendance}%`;
}

function lowestAttendance(events) {
  document.getElementById("lowest-attendance").innerHTML = `${events[events.length - 1].name}  ${events[
    events.length - 1
  ].attendance.toFixed(2)} %`;
}

function largerCapacity(events) {
  const eventsByCapacity = events.sort((a, b) => b.capacity - a.capacity);
  document.getElementById(
    "highest-capacity"
  ).innerHTML = `${eventsByCapacity[0].name} - ${eventsByCapacity[0].capacity}`;
}

function upcomingByCategory(eventsData) {
  const upcomingEvents = eventsData.events.filter((event) => event.date > eventsData.currentDate);
  const revenueAttendanceUpcoming = upcomingEvents.map((e) => ({
    ...e,
    revenue: e.price * e.estimate,
    attendance: ((e.assistance ?? e.estimate) / e.capacity) * 100,
  }));
  let template = "";
  for (const event of revenueAttendanceUpcoming) {
    template += ` <tr>
    <td>${event.category}</td>
    <td>${event.revenue.toLocaleString()}</td>
    <td>${event.attendance.toFixed(2)}%</td>
    </tr>`;
  }
  document.getElementById("upcoming-events").innerHTML = template;
}

function pastByCategory(eventsData) {
  const pastEvents = eventsData.events.filter((event) => event.date < eventsData.currentDate);
  const revenueAttendancePast = pastEvents.map((e) => ({
    ...e,
    revenue: e.price * e.assistance,
    attendance: ((e.assistance ?? e.estimate) / e.capacity) * 100,
  }));
  let template = "";
  for (const event of revenueAttendancePast) {
    template += ` <tr>
    <td>${event.category}</td>
    <td>${event.revenue.toLocaleString()}</td>
    <td>${event.attendance.toFixed(2)}%</td>
    </tr>`;
  }
  document.getElementById("past-events").innerHTML = template;
}
