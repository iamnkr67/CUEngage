import React, { useState } from "react";
import axios from "axios";
import { Paperclip, Image } from "lucide-react";

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: "",
    venue: "",
    eFile: null, // Updated to match the backend field name
    poster: null,
  });

  const [preview, setPreview] = useState({
    poster: null,
    eFile: null, // Updated to match the backend field name
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setEventData((prev) => ({ ...prev, [name]: file }));

    // Generate preview for image or file
    if (name === "poster") {
      setPreview((prev) => ({ ...prev, poster: URL.createObjectURL(file) }));
    } else if (name === "eFile") {
      setPreview((prev) => ({ ...prev, eFile: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("eventName", eventData.eventName);
    formData.append("eventDescription", eventData.eventDescription);
    formData.append("eventDate", eventData.eventDate);
    formData.append("venue", eventData.venue);
    if (eventData.eFile) formData.append("eFile", eventData.eFile); // Updated field name
    if (eventData.poster) formData.append("poster", eventData.poster);

    try {
      const response = await axios.post(
        "http://localhost:3002/event/add", // Matches the backend route
        formData
      );
      alert("Event added successfully!");
    } catch (error) {
      console.error(
        "Error adding event:",
        error?.response?.data || error.message
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
          <div className="flex flex-wrap items-center space-x-4">
            <div className="flex items-center space-x-2 p-4 border-2 border-dashed border-gray-500 rounded">
              <label htmlFor="eFile" className="text-sm font-medium">
                Upload PDF or Other Files:
              </label>
              <Paperclip className="w-5 h-5 text-gray-400" />
              <input
                type="file"
                id="eFile"
                name="eFile" // Updated field name
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />
              {preview.eFile && (
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
            <div className="flex items-center space-x-2 p-4 border-2 border-dashed border-gray-500 rounded">
              <label htmlFor="poster" className="text-sm font-medium">
                Upload Poster (Image):
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
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
