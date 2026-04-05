import React, { memo, useMemo } from "react";
import { FaRoad, FaWater, FaBolt, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Static data outside component (prevents re-creation on every render)
const FEATURE_DATA = [
  {
    key: "Potholes",
    icon: FaRoad,
    color: "from-red-400 to-red-600",
    description: "Report broken or damaged roads.",
  },
  {
    key: "Water Leakage",
    icon: FaWater,
    color: "from-blue-400 to-blue-600",
    description: "Report water pipe leaks or flooding.",
  },
  {
    key: "Electricity",
    icon: FaBolt,
    color: "from-yellow-400 to-yellow-600",
    description: "Report power outages or electrical hazards.",
  },
  {
    key: "Garbage",
    icon: FaTrash,
    color: "from-green-400 to-green-600",
    description: "Report garbage accumulation or waste issues.",
  },
];

function Features({ issues = [] }) {
  // Memoized category count
  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const issue of issues) {
      if (!issue?.category) continue;
      counts[issue.category] = (counts[issue.category] || 0) + 1;
    }
    return counts;
  }, [issues]);

  return (
    <div className="px-6 md:px-16 py-16 bg-gray-50">
      <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-blue-600">
        Civic Issues You Can Report
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {FEATURE_DATA.map((f) => {
          const Icon = f.icon;

          return (
            <Link
              key={f.key}
              to="/report"
              className="focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-400 rounded-xl"
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative p-6 rounded-xl shadow-xl bg-white overflow-hidden group flex flex-col items-center text-center transition-all duration-300"
              >
                {/* Background glow */}
                <motion.div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${f.color} opacity-10`}
                  whileHover={{ opacity: 0.25 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Icon */}
                <div
                  className={`text-5xl mb-4 bg-gradient-to-br ${f.color} bg-clip-text text-transparent`}
                >
                  <Icon />
                </div>

                {/* Title */}
                <p className="font-semibold text-xl text-gray-800">
                  {f.key}
                </p>

                {/* Count */}
                <p className="text-sm text-gray-500 mb-4">
                  {categoryCounts[f.key] ?? 0} issues reported
                </p>

                {/* Tooltip */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-full w-56 bg-gray-900 text-white text-sm rounded-md p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  {f.description}
                </div>

                {/* Button */}
                <button
                  className={`mt-auto px-6 py-2 rounded-full text-white bg-gradient-to-r ${f.color} shadow-md hover:shadow-lg transition duration-300 font-semibold`}
                >
                  Report Now
                </button>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default memo(Features);