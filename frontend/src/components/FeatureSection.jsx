import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Calendar, MapPin, Users, X } from "lucide-react";
import axios from "axios";

const FeatureSection = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getFixedFileUrl = (filePath) => {
    const index = filePath.lastIndexOf("uploads\\");
    if (index !== -1) {
      return filePath.substring(index + 8); // 8 = length of "uploads\\"
    }
    // Try for Linux/Mac paths if needed
    const indexUnix = filePath.lastIndexOf("uploads/");
    if (indexUnix !== -1) {
      return filePath.substring(indexUnix + 8); // 8 = length of "uploads/"
    }
    return filePath; // fallback, if "uploads/" not found
  };

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
        {events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col p-4 border border-neutral-700 rounded-lg bg-neutral-900 shadow-md cursor-pointer transition transform min-h-[450px]" // important fix
          >
            {event.poster && (
              <div className="w-full h-32 mb-4 bg-contain overflow-hidden rounded-lg">
                <img
                  src={`https://cuengage.onrender.com/uploads/${getFixedFileUrl(
                    event.poster,
                  )}`}
                  alt="Event Poster"
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            {/* Title with fixed height */}
            <h2 className="text-lg font-semibold text-center min-h-[60px] flex items-center justify-center">
              {event.eName}{" "}
              <span className="text-red-500 ml-1">
                {new Date(event.eDate).getFullYear()}
              </span>
            </h2>

            {/* Description with fixed height */}
            <p className="text-sm p-2 mb-4 text-neutral-500 text-center min-h-[100px]">
              {event.eDescript.length > 100
                ? `${event.eDescript.substring(0, 100)}...`
                : event.eDescript}
            </p>

            {/* Details Section */}
            <div className="flex flex-col items-center gap-2 mb-4 min-h-[100px]">
              <div className="flex items-center gap-2 text-neutral-300">
                <Users size={18} />
                <p>Organized By:</p>
                <span className="text-sm">{event.oragnizer}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Calendar size={18} />
                <span className="text-sm">
                  {new Date(event.eDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <MapPin size={18} />
                <span className="text-sm">{event.venue}</span>
              </div>
            </div>

            <div className="flex-grow"></div>

            {/* See More Button */}
            <button
              onClick={() => setSelectedEvent(event)}
              className="bg-gradient-to-r from-red-500 to-blue-790 py-3 px-4 mx-3 rounded-md border opacity-100 hover:opacity-100 transition duration-300 ease-in-out transform hover:scale-105"
            >
              See More
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/60 z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative bg-neutral-800 p-8 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] overflow-y-auto scrollbar-hide" // important part
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-1 right-1 text-white text-red-500 hover:text-red-700 p-1 cursor-pointer transition duration-200"
              >
                <X size={20} /> {/* Using Lucide X Icon */}
              </button>

              {/* Event Poster */}
              <div className="w-full h-56 mb-6 bg-contain overflow-hidden rounded-lg">
                <img
                  src={`https://cuengage.onrender.com/uploads/${getFixedFileUrl(
                    selectedEvent.poster,
                  )}`}
                  alt="Event Poster"
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Event Title */}
              <h2 className="text-3xl font-bold text-center text-white mb-4">
                {selectedEvent.eName}
              </h2>

              {/* Organizer Name */}
              <div className="flex items-center gap-2 text-neutral-300 mb-4">
                <Users size={20} />
                <p className="font-semibold">Organized By:</p>
                <span>{selectedEvent.oragnizer}</span>
              </div>

              {/* Event Description */}
              <p className="text-md text-neutral-400 mb-6 text-center">
                {selectedEvent.eDescript}
              </p>

              {/* Event Date */}
              <div className="flex items-center gap-2 text-neutral-300 mb-4">
                <Calendar size={20} />
                <span>
                  {new Date(selectedEvent.eDate).toLocaleDateString()}
                </span>
              </div>

              {/* Event Venue */}
              <div className="flex items-center gap-2 text-neutral-300 mb-4">
                <MapPin size={20} />
                <span>{selectedEvent.venue}</span>
              </div>

              {/* Event File */}
              <div className="flex items-center gap-2 text-neutral-300 mt-4">
                <Paperclip size={20} />
                <a
                  href={`https://cuengage.onrender.com/uploads/${getFixedFileUrl(
                    selectedEvent.eFile,
                  )}`}
                  download
                  className="underline hover:text-white cursor-pointer"
                >
                  {selectedEvent.eFile.includes("-")
                    ? selectedEvent.eFile.split("-")[1]
                    : selectedEvent.eFile}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeatureSection;
