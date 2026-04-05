import React, { useState, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

// Static data outside component
const QUICK_LINKS = [
  { name: "Home", path: "/" },
  { name: "Report", path: "/report" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "About", path: "/about" },
];

const SOCIAL_LINKS = [
  { icon: FaFacebookF, label: "Facebook", href: "#" },
  { icon: FaTwitter, label: "Twitter", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
];

function Footer() {
  const [email, setEmail] = useState("");

  // Memoized handler (prevents re-creation)
  const handleSubscribe = useCallback(() => {
    if (!email.trim()) {
      alert("Please enter a valid email.");
      return;
    }

    // TODO: Replace with API call
    alert(`Subscribed with ${email}! 🎉`);
    setEmail("");
  }, [email]);

  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center md:text-left">
        
        {/* About */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Civic Portal</h2>
          <p className="text-gray-400 text-sm">
            Empowering citizens to report and track city issues. Make your community smarter and safer.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="hover:text-blue-400 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p className="text-gray-400 text-sm">
            <a href="mailto:support@civicportal.com">
              support@civicportal.com
            </a>
          </p>
          <p className="text-gray-400 text-sm mt-1">
            <a href="tel:+1234567890">+1 234 567 890</a>
          </p>

          <div className="flex justify-center md:justify-start gap-4 mt-4">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition text-lg"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Subscribe</h3>
          <p className="text-gray-400 text-sm mb-2">
            Get updates on new features and civic news.
          </p>

          <div className="flex gap-2 mt-2">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              className="flex-1 px-3 py-2 rounded-l-lg text-gray-800 focus:outline-none"
            />
            <button
              onClick={handleSubscribe}
              className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-indigo-600 transition"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Civic Portal | All rights reserved 🚀
      </div>
    </footer>
  );
}

export default memo(Footer);