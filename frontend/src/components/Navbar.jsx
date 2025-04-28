import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.svg";
import { navItems } from "../constants";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-10 w-18 mr-2"
                src={logo}
                alt="Logo"
                draggable="false"
                onClick={handleClick}
                onContextMenu={(e) => e.preventDefault()}
              />

              {/* <h1 className="text-2xl font-bold ">CUEngage</h1> */}
            </Link>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            <a
              href="/adminlogin"
              className="bg-gradient-to-r from-red-500 to-red-800 py-2 px-3 rounded-md"
            >
              Admin Login
            </a>
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6">
              <a
                href="/adminlogin"
                className="py-2 px-3 rounded-md bg-gradient-to-r from-red-500 to-red-800"
              >
                Admin Login
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
