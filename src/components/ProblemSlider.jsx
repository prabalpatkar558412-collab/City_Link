import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import { motion } from "framer-motion";

// Images
import potholeImg from "../assets/gadhe.jpeg";
import waterLeakImg from "../assets/pipeline.jpeg";
import electricityImg from "../assets/electricity.jpeg";
import garbageImg from "../assets/garbage.jpeg";
import trafficImg from "../assets/trafic.png";
import publicSafetyImg from "../assets/tattoo.jpg";

// Static data (outside component)
const SLIDES = [
  { id: 1, title: "Potholes", desc: "Report road potholes quickly.", img: potholeImg, bg: "bg-red-100" },
  { id: 2, title: "Water Leakage", desc: "Fix leaks before they cause damage.", img: waterLeakImg, bg: "bg-blue-100" },
  { id: 3, title: "Electricity", desc: "Report electrical hazards or outages.", img: electricityImg, bg: "bg-yellow-100" },
  { id: 4, title: "Garbage", desc: "Notify authorities about garbage accumulation.", img: garbageImg, bg: "bg-green-100" },
  { id: 5, title: "Traffic Issues", desc: "Report traffic jams or unsafe intersections.", img: trafficImg, bg: "bg-purple-100" },
  { id: 6, title: "Public Safety", desc: "Report unsafe areas or suspicious activities.", img: publicSafetyImg, bg: "bg-pink-100" },
];

function ProblemSlider() {
  const sliderRef = useRef(null);

  const [x, setX] = useState(0);
  const [dimensions, setDimensions] = useState({
    containerWidth: 0,
    slideWidth: 0,
  });

  // Calculate sizes (responsive)
  useEffect(() => {
    const updateSizes = () => {
      const container = sliderRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const firstSlide = container.querySelector(".slide");

      if (firstSlide) {
        const slideWidth = firstSlide.offsetWidth + 24; // gap
        setDimensions({ containerWidth, slideWidth });
      }
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);

    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  const { containerWidth, slideWidth } = dimensions;

  const visibleSlides = slideWidth
    ? Math.floor(containerWidth / slideWidth)
    : 1;

  const maxX = slideWidth
    ? -(slideWidth * (SLIDES.length - visibleSlides))
    : 0;

  // Navigation handlers (memoized)
  const handleNext = useCallback(() => {
    setX((prev) => Math.max(prev - slideWidth, maxX));
  }, [slideWidth, maxX]);

  const handlePrev = useCallback(() => {
    setX((prev) => Math.min(prev + slideWidth, 0));
  }, [slideWidth]);

  return (
    <div className="px-6 md:px-16 py-12">
      
      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-indigo-600">
        Explore Civic Issues in Your City
      </h2>

      {/* Slider */}
      <div className="relative overflow-hidden" ref={sliderRef}>
        <motion.div
          className="flex gap-6 py-6 px-4 md:px-0 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: maxX, right: 0 }}
          animate={{ x }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        >
          {SLIDES.map((slide) => (
            <motion.div
              key={slide.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className={`slide min-w-[250px] md:min-w-[300px] h-72 flex flex-col rounded-xl shadow-lg ${slide.bg} flex-shrink-0`}
            >
              {/* Image */}
              <img
                src={slide.img}
                alt={slide.title}
                loading="lazy"
                className="w-full h-36 object-cover rounded-t-xl"
              />

              {/* Content */}
              <div className="flex flex-col items-center justify-center flex-1 px-3">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 text-center">
                  {slide.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 text-center mt-2">
                  {slide.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Prev */}
        <button
          onClick={handlePrev}
          disabled={x === 0}
          aria-label="Previous slides"
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-white px-3 py-2 rounded-full shadow hover:bg-gray-100 disabled:opacity-50"
        >
          ◀
        </button>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={x === maxX}
          aria-label="Next slides"
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-white px-3 py-2 rounded-full shadow hover:bg-gray-100 disabled:opacity-50"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

export default memo(ProblemSlider);