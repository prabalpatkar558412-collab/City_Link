import React, { useState, useMemo, useRef, useCallback, memo } from "react";
import IssueList from "../components/IssueList";
import AllIssuesMap from "../components/AllIssuesMap";

// Static filters
const CATEGORIES = ["All", "Pothole", "Water Leakage", "Electricity", "Garbage"];
const STATUSES = ["All", "Pending", "In Progress", "Resolved"];

function Dashboard({ issues = [], updateStatus }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const mapRef = useRef(null);

  // Normalize search once
  const normalizedSearch = search.trim().toLowerCase();

  // Memoized filtering
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (!issue) return false;

      const matchesFilter =
        filter === "All" ||
        issue.category === filter ||
        issue.status === filter;

      const matchesSearch =
        !normalizedSearch ||
        issue.title?.toLowerCase().includes(normalizedSearch) ||
        issue.desc?.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [issues, filter, normalizedSearch]);

  // Handlers
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  return (
    <div className="p-6 space-y-6">
      
      {/* Filters + Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Filter */}
        <select
          value={filter}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <optgroup label="Category">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </optgroup>

          <optgroup label="Status">
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </optgroup>
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search issues..."
          value={search}
          onChange={handleSearchChange}
          className="p-2 border rounded w-full md:w-64"
        />
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Issue List */}
        <div className="flex-1">
          <IssueList
            issues={filteredIssues}
            updateStatus={updateStatus}
            mapRef={mapRef}
          />
        </div>

        {/* Map */}
        <div className="flex-1 h-[500px]">
          <AllIssuesMap
            issues={filteredIssues}
            mapRef={mapRef}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(Dashboard);