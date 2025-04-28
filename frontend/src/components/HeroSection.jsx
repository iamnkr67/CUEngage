import React, { useState } from "react";
import bgvideo from "../assets/videoplayback.mp4";
import ApplyPerformance from "../pages/ApplyPerformance"; // Import ApplyPerformance component

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state here

  const openModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src={bgvideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <h1 className="text-4xl sm:text-6xl lg:text-6xl text-center tracking-wide">
        Organize, Collaborate, Participate
        <br></br>
        <span className="bg-gradient-to-r from-red-500 to-red-600 text-transparent  bg-clip-text">
          {"  "}
          Explore Your Potential
          <br></br>
        </span>
        <span className="relative text-5xl font-extrabold bg-gradient-to-r from-red-500 to-red-600 text-transparent bg-clip-text animate-pulse drop-shadow-[0_0_10px_rgba(255,0,0,0.7)]">
          Chitkara University
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
        Streamline event management with CUEngage – from registration to
        highlights!
      </p>
      <div className="flex justify-center my-10">
        <a
          href="/book-seat"
          className="bg-gradient-to-r from-red-500 to-blue-790 py-3 px-4 mx-3 rounded-md border opacity-100 hover:opacity-100 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Reserve Your Seat
        </a>
        <a
          onClick={openModal} // Open the modal on click
          className="bg-gradient-to-r from-pink-600 to-purple-790 py-3 px-4 mx-3 rounded-md border opacity-100 hover:opacity-100 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Apply for Performance
        </a>
      </div>

      {/* Modal Component */}
      {isModalOpen && (
        <ApplyPerformance
          isModalOpen={isModalOpen}
          closeModal={closeModal} // Pass closeModal function to ApplyPerformance
        />
      )}
    </div>
  );
};

export default HeroSection;
