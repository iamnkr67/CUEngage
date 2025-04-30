import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Paperclip, Image } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../components/ToastContainer.css";

const AddEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: "",
    venue: "",
    organizer: "",
    eFile: null,
    poster: null,
  });
  const [preview, setPreview] = useState({
    poster: null,
    eFile: null,
  });

  useEffect(() => {
    if (eventId) {
      setIsEditMode(true);
      fetchEventDetails();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(
        `https://cuengage.onrender.com/event/getID/${eventId}`,
      );
      if (response.status === 200) {
        const event = response.data.event;
        setEventData({
          eventName: event.eName || "",
          eventDescription: event.eDescript || "",
          eventDate: event.eDate ? event.eDate.slice(0, 10) : "",
          venue: event.venue || "",
          organizer: event.organizer || "",
          eFile: null,
          poster: null,
        });
        setPreview({
          poster: event.poster ? event.poster : null,
          eFile: event.eFile ? event.eFile : null,
        });
      }
    } catch (error) {
      console.error("Error fetching event details:", error?.message || error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setEventData((prev) => ({ ...prev, [name]: file }));
    if (file) {
      setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("eName", eventData.eventName);
    formData.append("eDescript", eventData.eventDescription);
    formData.append("eDate", eventData.eventDate);
    formData.append("venue", eventData.venue);
    formData.append("organizer", eventData.organizer);
    if (eventData.eFile) formData.append("eFile", eventData.eFile);
    if (eventData.poster) formData.append("poster", eventData.poster);

    try {
      const url = isEditMode
        ? `https://cuengage.onrender.com/event/update/${eventId}`
        : "https://cuengage.onrender.com/event/add";
      const method = isEditMode ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success(
          isEditMode
            ? "Event updated successfully!"
            : "Event added successfully!",
        );
        setEventData({
          eventName: "",
          eventDescription: "",
          eventDate: "",
          venue: "",
          organizer: "",
          eFile: null,
          poster: null,
        });
        setPreview({
          poster: null,
          eFile: null,
        });
        navigate("/viewevent");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(
        "Error submitting event:",
        error?.response?.data || error.message,
      );
      toast.error("Failed to submit event. Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isEditMode ? "Edit Event" : "Add Event"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="eventName"
              placeholder="Event Name"
              value={eventData.eventName}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
            <textarea
              name="eventDescription"
              placeholder="Event Description"
              value={eventData.eventDescription}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
            <input
              type="date"
              name="eventDate"
              value={eventData.eventDate}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
            <input
              type="text"
              name="venue"
              placeholder="Venue"
              value={eventData.venue}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
            <input
              type="text"
              name="organizer"
              placeholder="Organized By"
              value={eventData.organizer}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
            <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4">
              <div className="flex items-center space-x-2 p-4 border-2 border-dashed border-gray-500 rounded w-full sm:w-auto">
                <label htmlFor="eFile" className="text-sm font-medium">
                  Upload File:
                </label>
                <Paperclip className="w-5 h-5 text-gray-400" />
                <input
                  type="file"
                  id="eFile"
                  name="eFile"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                {preview.eFile && typeof preview.eFile === "string" && (
                  <a
                    href={preview.eFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View File
                  </a>
                )}
              </div>
              <div className="flex items-center space-x-2 p-4 border-2 border-dashed border-gray-500 rounded w-full sm:w-auto">
                <label htmlFor="poster" className="text-sm font-medium">
                  Upload Poster:
                </label>
                <Image className="w-5 h-5 text-gray-400" />
                <input
                  type="file"
                  id="poster"
                  name="poster"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {preview.poster && (
                  <img
                    src={preview.poster}
                    alt="Poster Preview"
                    className="w-16 h-16 rounded"
                  />
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 rounded transition duration-300"
            >
              {isEditMode ? "Update Event" : "Add Event"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEvent;
