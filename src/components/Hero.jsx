import React, { memo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

function Hero({ heroImage }) {
  const navigate = useNavigate();

  const handleLearnMore = useCallback(() => {
    const aboutSection = document.getElementById("about");

    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/about");
    }
  }, [navigate]);

  return (
    <section className="min-h-[80vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-12 gap-10 bg-gray-50">
      
      {/* LEFT */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Urban Civic Engagement Portal
        </h1>

        <p className="mt-4 text-gray-600 text-lg md:text-xl">
          Report and track city issues easily. Help improve your community with just a few clicks.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          
          <Link
            to="/report"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-indigo-600 hover:scale-105 transition-transform duration-300 text-center"
          >
            Report Issue 🚀
          </Link>

          <button
            onClick={handleLearnMore}
            aria-label="Learn more about the platform"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition duration-300 text-center"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex justify-center">
        <div
          className="relative group w-full max-w-[450px] p-[2px] rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, #4f46e5, #06b6d4)",
          }}
        >
          <img
            src={heroImage}
            alt="Civic engagement illustration"
            loading="lazy"
            className="w-[350px] md:w-[450px] h-[400px] md:h-[500px] object-cover rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}

export default memo(Hero);