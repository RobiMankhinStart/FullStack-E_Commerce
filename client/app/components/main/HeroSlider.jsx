"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    image: "/coverepic9.jpg",
    title: "New Season Essentials",
    subtitle:
      "Explore refined layers, comfort-first pieces, and elevated everyday staples for the modern wardrobe.",
    badge: "Fresh drop",
  },
  {
    image: "/coverpic10.avif",
    title: "Streetwear, Styled",
    subtitle:
      "Designed for all-day movement with cuts, textures, and silhouettes that feel as good as they look.",
    badge: "Best sellers",
  },
  {
    image: "/coverpic7.jpg",
    title: "Clean Lines. Bold Looks.",
    subtitle:
      "From laid-back essentials to standout statement pieces, your next favorite outfit starts here.",
    badge: "Trending now",
  },
  {
    image: "/coverpic6.jpg",
    title: "Wear Your Confidence",
    subtitle:
      "Premium staples crafted for everyday ease, effortless styling, and standout presence.",
    badge: "Limited edit",
  },
];

const HeroSlider = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleShopNow = () => router.push("/shop");
  const handleViewLookbook = () => {
    const section = document.getElementById("curated-edits");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push("/#curated-edits");
  };

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
          className="text-white max-w-3xl text-center"
        >
          <div className="mb-5 flex items-center justify-center">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25rem] text-white backdrop-blur-sm">
              {slides[currentIndex].badge}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tight mb-5">
            {slides[currentIndex].title}
          </h1>
          <p className="text-base md:text-xl text-slate-100 mb-8 font-light max-w-2xl mx-auto">
            {slides[currentIndex].subtitle}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              type="button"
              onClick={handleShopNow}
              className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-colors shadow-lg shadow-slate-900/20"
            >
              Shop the drop
            </button>
            <button
              type="button"
              onClick={handleViewLookbook}
              className="px-8 py-3 border border-white/60 bg-white/5 text-white font-bold rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              View lookbook
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
