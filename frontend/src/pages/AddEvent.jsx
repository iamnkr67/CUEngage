import React, { useState } from "react";
import axios from "axios";

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: "",
    venue: "",
    attachments: null,
    poster: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setEventData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("eventName", eventData.eventName);
    formData.append("eventDescription", eventData.eventDescription);
    formData.append("eventDate", eventData.eventDate);
    formData.append("venue", eventData.venue);
    if (eventData.attachments)
      formData.append("attachments", eventData.attachments);
    if (eventData.poster) formData.append("poster", eventData.poster);

    try {
      const response = await axios.post(
        "http://localhost:3002/event/",
        formData,
      );
      alert("Event added successfully!");
    } catch (error) {
      console.error(
        "Error adding event:",
        error?.response?.data || error.message,
      );
      alert("Failed to add event. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Add Event</h2>
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
            type="file"
            name="attachments"
            onChange={handleFileChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          <input
            type="file"
            name="poster"
            onChange={handleFileChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 rounded transition duration-300"
          >
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
