import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const HoverStars = () => {
  const [stars, setStars] = useState([]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setStars((prevStars) => [...prevStars, { x: clientX, y: clientY }]);

    setTimeout(() => {
      setStars((prevStars) => prevStars.slice(1));
    }, 500);
  };

  return (
    <div
      className="relative w-full h-screen bg-transparent flex items-center justify-center text-white"
      onMouseMove={handleMouseMove}
    >
      <h1 className="text-4xl">Hover to see the stars!</h1>
      {stars.map((star, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 1, scale: 0.5 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.5 }}
          className="absolute text-white"
          style={{
            top: star.y,
            left: star.x,
            position: "absolute",
          }}
        >
          <Star size={20} fill="white" />
        </motion.div>
      ))}
    </div>
  );
};

export default HoverStars;
