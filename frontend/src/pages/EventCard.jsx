import React, { useState, useEffect } from "react";
import axios from "axios";

const EventCard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hideCard, setHideCard] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://cuengage.onrender.com/event/getAll",
        );
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setHideCard(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      {!hideCard && events.length > 1 && (
        <div className="w-full max-w-md mx-auto mb-6 bg-gray-800 rounded-lg shadow-lg p-4 flex items-center justify-between space-x-4 transform transition-all duration-500 ease-in-out hover:translate-x-4 hover:shadow-2xl">
          <div className="flex flex-col space-y-2">
            <h2 className="text-2xl font-semibold">{events[0]?.eName}</h2>
            <p className="text-lg">Organizer: {events[0]?.organizer}</p>
            <p className="text-lg">Venue: {events[0]?.venue}</p>
            <p className="text-lg">Date: {events[0]?.date}</p>
          </div>
          <button
            onClick={() => handleEventClick(events[0])}
            className="bg-orange-500 text-white font-bold py-2 px-4 rounded transition duration-300 hover:bg-orange-600"
          >
            Select Event
          </button>
        </div>
      )}

      {!hideCard && events.length <= 1 && (
        <div className="w-full max-w-md mx-auto mb-6 bg-gray-800 rounded-lg shadow-lg p-4 flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-2">
            <h2 className="text-2xl font-semibold">{events[0]?.eName}</h2>
            <p className="text-lg">Organizer: {events[0]?.organizer}</p>
            <p className="text-lg">Venue: {events[0]?.venue}</p>
            <p className="text-lg">Date: {events[0]?.date}</p>
          </div>
          <button
            onClick={() => handleEventClick(events[0])}
            className="bg-orange-500 text-white font-bold py-2 px-4 rounded transition duration-300 hover:bg-orange-600"
          >
            Select Event
          </button>
        </div>
      )}

      {selectedEvent && (
        <div className="bg-gray-700 text-white p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Selected Event</h2>
          <p>Event Name: {selectedEvent.eName}</p>
          <p>Organizer: {selectedEvent.organizer}</p>
          <p>Venue: {selectedEvent.venue}</p>
          <p>Date: {selectedEvent.date}</p>
        </div>
      )}
    </div>
  );
};

export default EventCard;
