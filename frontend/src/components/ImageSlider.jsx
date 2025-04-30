import React, { useState, useEffect, useRef } from "react";
import image1 from "../assets/momentsFresher/image1.jpg";
import image2 from "../assets/momentsFresher/image2.jpg";
import image3 from "../assets/momentsFresher/image3.jpg";
import image4 from "../assets/momentsFresher/image4.jpg";
import image5 from "../assets/momentsFresher/image5.jpg";
import image6 from "../assets/momentsFresher/image6.jpg";
import image7 from "../assets/momentsFresher/image7.jpg";
import image8 from "../assets/momentsFresher/image8.jpg";
import image9 from "../assets/momentsFresher/image9.jpg";
import image10 from "../assets/momentsFresher/image10.jpg";
import image11 from "../assets/momentsFresher/image11.jpg";

const ImageSlider = () => {
  const images = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
    image11,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const headingRef = useRef(null);
  const [headingVisible, setHeadingVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeadingVisible(entry.isIntersecting),
      { threshold: 0.5 },
    );
    if (headingRef.current) observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div id="gallery" className="mt-20 tracking-wide">
      <h2
        ref={headingRef}
        className={`text-3xl sm:text-5xl text-center my-10 transition-transform duration-1000 ${
          headingVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        A Day to Remember:
        <br />
        <span className="bg-gradient-to-r from-red-500 to-red-800 text-transparent bg-clip-text">
          Events Glimpses
        </span>
      </h2>
      <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full h-120 flex-shrink-0 p-2">
              <img
                src={image}
                alt={`Slide ${index}`}
                className="w-full h-120 object-cover rounded-lg shadow-md"
              />
            </div>
          ))}
        </div>
        <button
          className="absolute top-72 left-4 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          onClick={() =>
            setCurrentIndex((prev) =>
              prev === 0 ? images.length - 1 : prev - 1,
            )
          }
        >
          &#8249;
        </button>
        <button
          className="absolute top-72 right-4 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default ImageSlider;
