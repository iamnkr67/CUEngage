import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PartyPopper, Calendar, MapPin } from "lucide-react";
import axios from "axios";

const FeatureSection = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("https://localhost:3002/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div
      id="events"
      className="relative mt-20 border-b border-neutral-800 min-h-[800px]"
    >
      <div className="text-center mb-6">
        <span className="bg-neutral-900 text-red-500 rounded-full h-6 text-sm font-medium px-2 py-1 uppercase">
          Ongoing Events
        </span>
      </div>
      <div className="flex overflow-hidden space-x-6">
        {events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            whileHover={{ x: 0 }}
            className="event-item w-72 p-6 border border-neutral-700 rounded-lg bg-neutral-900 shadow-md cursor-pointer"
          >
            <h2 className="text-2xl font-semibold text-center">
              {event.name} <span className="text-red-500">{event.year}</span>
            </h2>
            <p className="text-sm p-2 mb-4 text-neutral-500 text-center">
              {event.description.substring(0, 100)}...
            </p>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-neutral-300">
                <PartyPopper />
                <span>{event.tagline}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Calendar />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <MapPin />
                <span>{event.venue}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedEvent(event)}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded transition duration-300"
            >
              See More
            </button>
          </motion.div>
        ))}
      </div>
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-700 p-2 rounded"
            >
              ✕
            </button>
            <h2 className="text-3xl font-bold text-center mb-4">
              {selectedEvent.name}
            </h2>
            <p className="text-md text-neutral-400 text-center">
              {selectedEvent.description}
            </p>
            <div className="flex flex-col items-center gap-3 mt-4">
              <div className="flex items-center gap-2 text-neutral-300">
                <Calendar />
                <span>{selectedEvent.date}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <MapPin />
                <span>{selectedEvent.venue}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureSection;
