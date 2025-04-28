import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    if (!username || !password) {
      setMessage({ type: "error", text: "Please fill in both fields." });
      return;
    }

    try {
      const response = await axios.post(
        "https://cuengage.onrender.com/admin/login",
        {
          username,
          password,
        },
      );

      if (response.status === 200) {
        setMessage({ type: "success", text: "Login successful!" });
        if (onLoginSuccess) onLoginSuccess();
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-gray-900 to-black">
      <div className="bg-zinc-800 rounded-2xl shadow-lg p-8 w-full max-w-md text-white">
        <h1 className="text-4xl text-center tracking-wide mb-6">
          Admin
          <span className="bg-gradient-to-r from-red-500 to-red-800 text-transparent bg-clip-text">
            {" "}
            Login
          </span>
        </h1>

        {message.text && (
          <p
            className={`text-center mb-4 font-medium ${
              message.type === "error" ? "text-red-500" : "text-green-500"
            }`}
          >
            {message.text}
          </p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="block w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="block w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-red-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-red-500 to-red-800 text-white rounded-lg hover:from-red-400 hover:to-red-700"
          >
            Login
          </button>
        </form>

        <div className="mt-8 text-center text-zinc-400">
          <p>
            Having trouble logging in?{" "}
            <a
              href="https://wa.me/+9198000000?text=admin+login+help"
              className="text-red-400 hover:text-red-500"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
