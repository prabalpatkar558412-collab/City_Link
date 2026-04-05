import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, memo } from "react";
import { FiMenu, FiX } from "react-icons/fi";

// Static nav items (avoid recreation)
const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Report", path: "/report" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "About", path: "/about" },
];

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 shadow-xl sticky top-0 z-50 rounded-b-3xl flex items-center justify-between">
      
      {/* Logo */}
      <Link to="/" aria-label="Go to home">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-extrabold text-2xl tracking-wide"
        >
          Civic Link
        </motion.h1>
      </Link>

      {/* Desktop Links */}
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
                    className="absolute left-0 -bottom-1 h-1 w-full bg-yellow-300 rounded-full"
                  />
                )}
              </motion.span>
            </Link>
          );
        })}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <button
          onClick={openMenu}
          className="text-3xl p-2 rounded-full hover:bg-white/20 transition"
          aria-label="Open menu"
        >
          <FiMenu />
        </button>

        <AnimatePresence>
          {open && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40"
                onClick={closeMenu}
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
                className="fixed top-0 right-0 w-3/4 max-w-xs h-full bg-blue-700 shadow-lg z-50 flex flex-col gap-6 py-10 px-6"
              >
                {/* Close */}
                <button
                  onClick={closeMenu}
                  className="self-end text-3xl mb-6 p-2 rounded-full hover:bg-white/20 transition"
                  aria-label="Close menu"
                >
                  <FiX />
                </button>

                {/* Links */}
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
      </div>
    </nav>
  );
}

export default memo(Navbar);