import React, { useState } from "react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80 bg-gray-900 text-white">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img
              className="h-10 w-18 mr-2"
              src={logo}
              alt="Logo"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex space-x-8">
          <li>
            <Link to="/" className="hover:text-red-500 transition duration-200">
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="hover:text-red-500 transition duration-200"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/addevent"
              className="hover:text-red-500 transition duration-200"
            >
              Add Event
            </Link>
          </li>
          <li>
            <Link
              to="/viewevent"
              className="hover:text-red-500 transition duration-200"
            >
              View Event
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-gray-900 border-t border-neutral-700 lg:hidden flex flex-col space-y-4 py-4 px-6">
          <li>
            <Link
              to="/"
              className="block text-white hover:text-red-500 transition duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="block text-white hover:text-red-500 transition duration-200"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/addevent"
              className="block text-white hover:text-red-500 transition duration-200"
            >
              Add Event
            </Link>
          </li>
          <li>
            <Link
              to="/viewevent"
              className="block text-white hover:text-red-500 transition duration-200"
            >
              View Event
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default AdminNavbar;
