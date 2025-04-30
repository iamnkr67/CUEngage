import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle } from "react-icons/fa";

const ApplyPerformance = ({ isModalOpen, closeModal }) => {
  const [event, setEvent] = useState([]);
  const [eventData, setEventData] = useState({
    eName: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    phone: "",
    year: "",
    program: "",
    act: "",
  });
  const [successDialog, setSuccessDialog] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          "https://cuengage.onrender.com/event/getAll",
        );
        setEvent(res.data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvent();
  }, []);

  const handleEventChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.rollNo)) {
      toast.warning("Roll number must be exactly 10 digits.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.warning("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      const response = await axios.post(
        "https://cuengage.onrender.com/contestant",
        {
          ...formData,
          eName: eventData.eName,
        },
      );
      if (
        response.data.message === "Application submitted successfully." &&
        response.status === 201
      ) {
        setFormData({
          name: "",
          rollNo: "",
          phone: "",
          year: "",
          act: "",
          program: "",
        });
        setEventData({ eName: "" });
        setSuccessDialog(true);
      }
    } catch (err) {
      if (err.response) {
        toast.error(
          err.response.data.message ||
            "An error occurred while submitting your application.",
        );
      } else if (err.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[1000]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-zinc-800 p-6 rounded-lg w-[90%] max-w-5xl flex flex-col md:flex-row gap-6">
        {!eventData.eName ? (
          <div className="w-full flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-center text-white mb-4">
              Select Event
            </h2>
            <div className="relative w-64 p-2 rounded-lg text-center font-semibold text-red-500 border">
              <select
                id="eventSelect"
                name="eName"
                value={eventData.eName}
                onChange={handleEventChange}
                required
                className="w-full bg-zinc-800 text-red-500"
              >
                <option value="" className="text-gray-500">
                  Choose an Event
                </option>
                {event.map((e) => (
                  <option key={e._id} value={e.eName}>
                    {e.eName}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={closeModal}
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-300 w-64"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="w-full">
            <h2 className="text-xl font-semibold text-center text-red-300 mb-4">
              {eventData.eName}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                className="block w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="rollNo"
                placeholder="Roll No (2xxxxxxx90)"
                required
                className="block w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
                value={formData.rollNo}
                onChange={handleChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone (10 digits)"
                required
                className="block w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                type="text"
                name="year"
                placeholder="Semester"
                required
                className="block w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
                value={formData.year}
                onChange={handleChange}
              />
              <select
                name="act"
                required
                className="block w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
                value={formData.act}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Choose Your Act
                </option>
                <option value="dance">Dance</option>
                <option value="singing">Singing</option>
                <option value="instrumental music">Instrumental Music</option>
                <option value="drama">Drama</option>
                <option value="stand-up comedy">Stand-Up Comedy</option>
                <option value="others">Others</option>
              </select>
              <select
                name="program"
                required
                className="block w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
                value={formData.program}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Department
                </option>
                <option value="BE-CSE">BE-CSE</option>
                <option value="BCA">BCA</option>
                <option value="Nursing">Nursing</option>
                <option value="Pharmacy">Pharmacy</option>
              </select>
              <div className="flex gap-4 mt-6 w-full">
                <button
                  type="submit"
                  className="w-1/2 py-3 text-white font-semibold rounded-lg shadow-md transition duration-300 bg-gradient-to-r from-red-500 to-red-800 hover:from-red-200 hover:to-red-800"
                >
                  Submit
                </button>
                <button
                  onClick={closeModal}
                  className="w-1/2 py-3 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {successDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[1050]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <FaCheckCircle className="text-red-500 text-5xl mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-700">
              Your Application Submitted Successfully
            </h3>
            <button
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-300"
              onClick={() => {
                setSuccessDialog(false);
                closeModal();
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyPerformance;
