import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Footer from "./components/Footer";
import ImageSlider from "./components/ImageSlider";
import SeatLayout from "./components/SeatLayout";
import AdminLogin from "./pages/AdminLogin";
import AdminDashBoard from "./pages/AdminDashBoard";
import AdminNavbar from "./pages/AdminNavbar";
import AddEvent from "./pages/AddEvent";
import ViewEvent from "./pages/ViewEvent";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken"),
  );

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <div className="max-w-7xl mx-auto pt-20 px-6">
                <HeroSection />
                <FeatureSection />
                <ImageSlider />
                <Footer />
              </div>
            </>
          }
        />
        <Route
          path="/book-seat"
          element={
            <>
              <Navbar />
              <div className="max-w-7xl mx-auto pt-20 px-6">
                <SeatLayout />
              </div>
              <Footer />
            </>
          }
        />
        <Route
          path="/adminlogin"
          element={<AdminLogin onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <>
                <AdminNavbar />
                <AdminDashBoard />
              </>
            ) : (
              <Navigate to="/adminlogin" />
            )
          }
        />
        <Route
          path="/addevent"
          element={
            isLoggedIn ? (
              <>
                <AdminNavbar />
                <AddEvent />
              </>
            ) : (
              <Navigate to="/adminlogin" />
            )
          }
        />
        <Route
          path="/viewevent"
          element={
            isLoggedIn ? (
              <>
                <AdminNavbar />
                <ViewEvent />
              </>
            ) : (
              <Navigate to="/adminlogin" />
            )
          }
        />
        <Route
          path="/addevent/:eventId"
          element={
            isLoggedIn ? (
              <>
                <AdminNavbar />
                <AddEvent />
              </>
            ) : (
              <Navigate to="/adminlogin" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
