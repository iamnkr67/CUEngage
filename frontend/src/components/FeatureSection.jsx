import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paperclip,
  Calendar,
  MapPin,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./ToastContainer.css";
import axios from "axios";

const FeatureSection = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const cardsPerPage = 4;

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

  const truncateHTML = (htmlString, maxChars = 50) => {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    const text = div.textContent || div.innerText || "";
    return text.length > maxChars ? text.substring(0, maxChars) + "..." : text;
  };

  const handlePrev = () => {
    setCurrentStartIndex((prev) => Math.max(prev - cardsPerPage, 0));
  };

  const handleNext = () => {
    setCurrentStartIndex((prev) =>
      Math.min(prev + cardsPerPage, events.length - cardsPerPage),
    );
  };

  const visibleEvents = events.slice(
    currentStartIndex,
    currentStartIndex + cardsPerPage,
  );

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-6">
        {visibleEvents.map((event, index) => (
          <motion.div
            key={index}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col p-4 border border-neutral-700 rounded-lg bg-neutral-900 shadow-md cursor-pointer transition transform w-[300px] h-[530px]" // Fixed width and height for consistency
          >
            {event.poster && (
              <div className="w-full h-32 mb-4 overflow-hidden rounded-lg">
                <img
                  src={event.poster}
                  alt="Event Poster"
                  className="object-cover w-full h-auto rounded"
                />
              </div>
            )}
            <h2 className="text-lg font-semibold text-center min-h-[60px] flex items-center justify-center text-balance break-words px-2 w-full">
              {event.eName}
              <span className="text-red-500 ml-1">
                {new Date(event.eDate).getFullYear()}
              </span>
            </h2>

            <p
              className="text-sm p-2 mb-4 text-neutral-500 text-center min-h-[100px]"
              dangerouslySetInnerHTML={{
                __html: truncateHTML(event.eDescript, 100),
              }}
            />

            <div className="flex flex-col items-start gap-2 mt-4 w-full">
              <div className="flex items-center gap-2 text-neutral-300 w-full">
                <Users size={18} className="text-red-500" />
                <span className="text-sm text-balance break-words w-[250px]">
                  {" "}
                  {/* Fixed width for consistency */}
                  {event.organizer}
                </span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300 w-full">
                <Calendar size={18} className="text-red-500" />
                <span className="text-sm w-[250px]">
                  {" "}
                  {/* Fixed width for consistency */}
                  {new Date(event.eDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300 w-full">
                <MapPin size={18} className="text-red-500" />
                <span className="text-sm w-[250px]">
                  {" "}
                  {/* Fixed width for consistency */}
                  {event.venue}
                </span>
              </div>
            </div>

            <div className="flex-grow" />
            <button
              onClick={() => setSelectedEvent(event)}
              className="bg-gradient-to-r from-red-500 to-orange-800 py-3 px-4 mx-3 rounded-md border opacity-100 hover:opacity-100 transition duration-300 ease-in-out transform hover:scale-105"
            >
              See More
            </button>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center items-center mt-4 gap-4">
        <button
          onClick={handlePrev}
          disabled={currentStartIndex === 0}
          className={`p-2 rounded-full hover:bg-neutral-700 ${
            currentStartIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <ChevronLeft />
        </button>
        <button
          onClick={handleNext}
          disabled={currentStartIndex + cardsPerPage >= events.length}
          className={`p-2 rounded-full hover:bg-neutral-700 ${
            currentStartIndex + cardsPerPage >= events.length
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <ChevronRight />
        </button>
      </div>

      {/* Modal for full event details */}
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
              className="relative bg-neutral-800 p-8 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-1 right-1  text-red-500 hover:text-red-700 p-1 cursor-pointer transition duration-200"
              >
                <X size={20} />
              </button>

              <div className="w-full h-56 mb-6 overflow-hidden rounded-lg">
                <img
                  src={selectedEvent.poster}
                  alt="Event Poster"
                  className="object-contain w-full h-full rounded"
                />
              </div>

              <h2 className="text-3xl font-bold text-center text-white mb-4">
                {selectedEvent.eName}
              </h2>

              <div className="flex items-center gap-2 text-neutral-300 mb-4">
                <Users size={20} />
                <p className="font-semibold">Organized By:</p>
                <span className="font-bold">{selectedEvent.organizer}</span>
              </div>

              <p className="text-md text-neutral-400 mb-6 text-center">
                <span
                  className="event-description"
                  dangerouslySetInnerHTML={{
                    __html: selectedEvent.eDescript,
                  }}
                />
              </p>

              <div className="flex items-center gap-2 text-neutral-300 mb-4">
                <Calendar size={20} />
                <span>
                  {new Date(selectedEvent.eDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-neutral-300 mb-4">
                <MapPin size={20} />
                <span>{selectedEvent.venue}</span>
              </div>

              {selectedEvent.eFile && (
                <div className="flex items-center gap-2 text-neutral-300 mt-4">
                  <Paperclip size={20} />
                  <a
                    href={selectedEvent.eFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white cursor-pointer"
                  >
                    {selectedEvent.eFile
                      .split("/")
                      .pop()
                      .split("-")
                      .slice(1)
                      .join("-")}
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeatureSection;
