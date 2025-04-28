import React, { useEffect, useRef } from "react";
import "./TimelineSection.scss";
import {
  DoorOpen,
  Award,
  Gamepad,
  Mic,
  Music,
  Camera,
  Smile,
  PartyPopper,
} from "lucide-react";
import rampWalk from "../assets/rampwalk.png";
import indianCultural from "../assets/indianCultural.png"
const timelineData = [
  {
    time: "8:30am - 9:30am",
    title: "Entry Timing",
    description: "",
    icon: <DoorOpen className="w-6 h-6 text-red-500" />,
  },
  {
    time: "",
    title: "Opening Ceremony",
    description: "",
    icon: <Award className="w-6 h-6 text-red-500" />,
  },
   {
    time: "",
    title: "Cultural Program",
    description: "",
    icon: (
      <img
        src={indianCultural}
        alt="Indian Cultural Program"
        className="w-14 h-11 text-red-500"
      />
    ),
  },
  {
    time: "",
    title: "Fun & Games",
    description: "",
    icon: <Gamepad className="w-6 h-6 text-red-500" />,
  },
  {
    time: "",
    title: "Ramp Walk",
    description: "",
    icon: (
      <img
        src={rampWalk}
        alt="Ramp Walk Icon"
        className="w-11 h-11 text-red-500"
      />
    ),
  },
  {
    time: "",
    title: "Performance",
    description: "",
    icon: (
      <div className="flex space-x-2">
        <Mic className="w-6 h-6 text-red-500" />
        <Music className="w-6 h-6 text-blue-500" />
      </div>
    ),
  },
  {
    time: "",
    title: "Photo Session",
    description: "",
    icon: <Camera className="w-6 h-6 text-orange-500" />,
  },
  {
    time: "",
    title: "Self Enjoyment",
    description: "",
    icon: (
      <div className="flex space-x-2">
        <PartyPopper className="w-6 h-6 text-red-500" />
        <Smile className="w-6 h-6 text-blue-500" />
      </div>
    ),
  },
];

const InteractiveTimeline = () => {
  const timelineRef = useRef(null);

  useEffect(() => {
    const timelineItems = document.querySelectorAll(".timeline-item");
    const options = {
      threshold: 0.5, // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        } else {
          entry.target.classList.remove("animate"); // Remove class when out of view
        }
      });
    }, options);

    timelineItems.forEach((item) => observer.observe(item));

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []);

  return (
    <div id="timeline" className="timeline-container" ref={timelineRef}>
      <div className="text-center">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide">
          <span className="bg-gradient-to-r from-red-500 to-red-800 text-transparent bg-clip-text">
            Event Timeline
          </span>
        </h2>
      </div>
      <div className="timeline">
        <div className="timeline-line"></div>
        {timelineData.map((item, index) => (
          <div
            className="timeline-item"
            key={index}
            style={{ "--animation-index": index }}
          >
            <div className="timeline-content">
              <div className="timeline-icon">{item.icon}</div>
              <h2 className="timeline-time">{item.time}</h2>
              <h3 className="timeline-event">{item.title}</h3>
              <p className="timeline-description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveTimeline;
