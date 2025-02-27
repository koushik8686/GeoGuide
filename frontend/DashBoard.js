import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [freeSlots, setFreeSlots] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:4000/calendar/events", { withCredentials: true });
      setEvents(response.data);
      calculateFreeSlots(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const calculateFreeSlots = (events) => {
    let busyTimes = events.map(event => ({
      start: new Date(event.start.dateTime || event.start.date),
      end: new Date(event.end.dateTime || event.end.date),
    }));

    let freeSlots = [];
    let lastEndTime = new Date();
    lastEndTime.setHours(8, 0, 0, 0);

    busyTimes.forEach(({ start, end }) => {
      if (lastEndTime < start) {
        freeSlots.push({ start: lastEndTime, end: start });
      }
      lastEndTime = end;
    });

    let endOfDay = new Date();
    endOfDay.setHours(20, 0, 0, 0);
    if (lastEndTime < endOfDay) {
      freeSlots.push({ start: lastEndTime, end: endOfDay });
    }

    setFreeSlots(freeSlots);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Upcoming Events</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event.summary} - {new Date(event.start.dateTime || event.start.date).toLocaleString()}</li>
        ))}
      </ul>

      <h2>Available Time Slots</h2>
      <ul>
        {freeSlots.map((slot, index) => (
          <li key={index}>{slot.start.toLocaleString()} - {slot.end.toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
