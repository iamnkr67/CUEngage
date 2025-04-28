import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://cuengage.onrender.com/event/getAll",
        );
        if (response.status === 200) {
          setEvents(response.data.events);
        }
      } catch (error) {
        console.error("Error fetching events:", error?.message || error);
      }
    };
    fetchEvents();
  }, []);

  const handleEditClick = (eventId) => {
    navigate(`/addevent/${eventId}`);
  };

  const getFileName = (fullPath) => {
    // Check if path includes "uploads" (to handle platform-specific paths)
    const pathParts = fullPath.split("uploads\\"); // For Windows paths
    // For Linux/Mac use: const pathParts = fullPath.split('uploads/');
    return pathParts.length > 1 ? pathParts[1] : fullPath; // Return the filename after 'uploads\'
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-8">All Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{event.eName}</h3>
              <Pencil
                onClick={() => handleEditClick(event._id)}
                className="text-gray-400 hover:text-white cursor-pointer"
                size={20}
              />
            </div>
            <p className="text-gray-300 mb-4">{event.eDescript}</p>
            {event.poster && (
              <>
                <p>Poster: {event.poster}</p> {/* Log the poster filename */}
                <img
                  src={`https://cuengage.onrender.com/uploads/${getFileName(
                    event.poster,
                  )}`} // Use the function to get only the filename
                  alt="Event Poster"
                  className="w-full h-64 object-cover rounded"
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewEvents;
