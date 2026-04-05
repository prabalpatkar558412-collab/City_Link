import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, memo } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Report", path: "/report" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "About", path: "/about" },
];

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <nav className="sticky top-0 z-50 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl rounded-b-2xl flex items-center justify-between px-6">
      
      {/* Logo */}
      <Link to="/" aria-label="Go to home">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-extrabold text-xl md:text-2xl tracking-wide"
        >
          Civic Link
        </motion.h1>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path} className="relative">
              <motion.span
                whileHover={{ scale: 1.08 }}
                className={`font-medium transition ${
                  isActive
                    ? "text-yellow-300"
                    : "hover:text-yellow-200"
                }`}
              >
                {item.name}

                {isActive && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 -bottom-1 h-[3px] w-full bg-yellow-300 rounded-full"
                  />
                )}
              </motion.span>
            </Link>
          );
        })}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-3xl p-2 rounded-full hover:bg-white/20 transition"
          aria-label="Toggle menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={closeMenu}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed top-0 right-0 w-3/4 max-w-xs h-full bg-indigo-700 z-50 flex flex-col px-6 py-8 gap-6 shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4">Menu</h2>

              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={`text-lg font-medium transition ${
                      isActive
                        ? "text-yellow-300"
                        : "hover:text-yellow-200"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default memo(Navbar);