import { PartyPopper } from "lucide-react";
import { BatteryCharging } from "lucide-react";
import { Calendar } from "lucide-react";
import { MapPin } from "lucide-react";
import { PlugZap } from "lucide-react";
import { GlobeLock } from "lucide-react";
import React, { useState } from "react";
import { Instagram, Facebook, Twitter, Linkedin, Github } from "lucide-react";

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/#events" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Timeline", href: "/#timeline" },
  { label: "Book Seat", href: "/book-seat" },
];

export const events = [
  {
    icon: <PartyPopper />,
    text: "Chitkara Lit Fest'25",
    description: "Chitkara Lit Fest 2025",
  },
  {
    icon: <Calendar />,
    text: "Date: To be announced",
    description: "",
  },
  {
    icon: <MapPin />,
    text: "Venue:",
    description: "Auditorium, Nalanda College",
  },
];

export const testimonials = [{}];

export const socialLinks = [
  {
    href: "https://www.instagram.com/",
    icon: <Instagram size={20} className="text-pink-400" />, // Lucide Instagram icon
  },

  {
    href: "https://www.linkedin.com/",
    icon: <Linkedin size={20} className="text-blue-600" />, // Lucide LinkedIn icon
  },
  {
    href: "https://www.github.com/",
    icon: <Github size={20} className="text-white-600" />, // Lucide YouTube icon
  },
];
