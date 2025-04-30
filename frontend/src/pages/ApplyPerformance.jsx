import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle } from "react-icons/fa";

const ApplyPerformance = ({ isModalOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    phone: "",
    year: "",
    program: "",
    act: "",
  });

  const [successDialog, setSuccessDialog] = useState(false);

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
        formData,
      );
      if (
        response.data.message === "Application submitted successfully." &&
        response.status === 201
      ) {
        setFormData({ name: "", rollNo: "", phone: "", year: "", act: "" });
        setSuccessDialog(true);
      }
    } catch (err) {
      console.error(err);

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
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      style={{ zIndex: 1000 }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-zinc-800 p-6 rounded-lg w-96 max-w-md">
        <h2 className="text-xl font-semibold text-center text-white">
          Apply for Performance
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              Select Program
            </option>
            <option value="becse">BE-CSE</option>
            <option value="bca">BCA</option>
            <option value="nursing">Nursing</option>
            <option value="pharmacy">Pharmacy</option>
          </select>
          <button
            type="submit"
            className="w-full py-3 mt-6 text-white font-semibold rounded-lg shadow-md transition duration-300 bg-gradient-to-r from-red-500 to-red-800 hover:from-red-200 hover:to-red-800"
          >
            Submit Application
          </button>
        </form>
        <button
          onClick={closeModal}
          className="w-full mt-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-300"
        >
          Close
        </button>
      </div>
      {successDialog && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          style={{ zIndex: 1050 }}
        >
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
