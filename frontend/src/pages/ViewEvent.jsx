import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const handleEditClick = (eventId) => {
    navigate(`/addevent/${eventId}`);
  };

  const handleDeleteClick = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await axios.delete(
          `https://cuengage.onrender.com/event/delete/${eventId}`,
        );
        if (response.status === 200) {
          fetchEvents();
        }
      } catch (error) {
        console.error("Error deleting event:", error?.message || error);
      }
    }
  };

  const getFileName = (fullPath) => {
    const pathParts = fullPath.split("uploads\\");
    return pathParts.length > 1 ? pathParts[1] : fullPath;
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
              {event.poster && (
                <img
                  src={`https://cuengage.onrender.com/uploads/${getFileName(
                    event.poster,
                  )}`}
                  alt="Event Poster"
                  className="w-full h-64 object-cover rounded"
                />
              )}
              <h2 className="text-lg font-semibold text-center min-h-[60px] flex items-center justify-center">
                {event.eName}{" "}
                <span className="text-red-500 ml-1">
                  {new Date(event.eDate).getFullYear()}
                </span>
              </h2>

              <div className="flex gap-2">
                <Pencil
                  onClick={() => handleEditClick(event._id)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                  size={20}
                />
                <Trash2
                  onClick={() => handleDeleteClick(event._id)}
                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                  size={20}
                />
              </div>
            </div>
            <p className="text-gray-300 mb-4">{event.eDescript}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewEvents;
