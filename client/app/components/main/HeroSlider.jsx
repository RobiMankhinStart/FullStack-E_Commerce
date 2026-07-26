"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=2071&auto=format&fit=crop",
    title: "The New Standard",
    subtitle:
      "An intentional collection of architectural essentials, curated for the modern minimalist.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop",
    title: "Architectural Form",
    subtitle:
      "Elevated environments designed for daily rituals and quiet contemplation.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    title: "Modern Utility",
    subtitle:
      "Functional objects that blend seamless utility with refined editorial aesthetic.",
  },
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <Image
            fill
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />{" "}
          {/* Overlay for text readability */}
        </motion.div>
      </AnimatePresence>

      {/* Text Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 p-8">
        <motion.div
          key={`text-${currentIndex}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-white max-w-2xl text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="block">
              {slides[currentIndex].title.split(" ").slice(0, -1).join(" ")}
            </span>
            <span className="text-indigo-400">
              {slides[currentIndex].title.split(" ").pop()}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 font-light">
            {slides[currentIndex].subtitle}
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-black font-medium hover:bg-slate-200 transition-colors">
              Explore Collection
            </button>
            <button className="px-8 py-3 border border-white text-white font-medium hover:bg-white/10 transition-colors">
              Watch Film
            </button>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-12 right-12 flex items-center gap-6 z-20">
        <div className="flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? "bg-indigo-400 w-12" : "bg-white/50 w-6 hover:bg-white"}`}
            />
          ))}
        </div>
        <div className="flex gap-3 ml-2">
          <button
            onClick={prevSlide}
            className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
