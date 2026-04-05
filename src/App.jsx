import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Footer from "./components/Footer";

function App() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("issues")) || [];
    setIssues(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("issues", JSON.stringify(issues));
  }, [issues]);

  const addIssue = (issue) => {
    setIssues([
      ...issues,
      {
        ...issue,
        status: "Pending",
        time: new Date().toLocaleString(),
      },
    ]);
  };

  const updateStatus = (index, status) => {
    const updated = [...issues];
    updated[index].status = status;
    setIssues(updated);
  };

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report addIssue={addIssue} />} />
        <Route
          path="/dashboard"
          element={<Dashboard issues={issues} updateStatus={updateStatus} />}
        />
        {/* Pass issues to About for dynamic stats */}
        <Route path="/about" element={<About issues={issues} />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;