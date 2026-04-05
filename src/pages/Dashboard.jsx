import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  memo,
} from "react";
import IssueList from "../components/IssueList";
import AllIssuesMap from "../components/AllIssuesMap";

const CATEGORIES = ["All", "Pothole", "Water Leakage", "Electricity", "Garbage"];
const STATUSES = ["All", "Pending", "In Progress", "Resolved"];

function Dashboard({ issues = [], updateStatus }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const mapRef = useRef(null);

  const normalizedSearch = search.trim().toLowerCase();

  // 🔥 Filter logic
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

  // 🔥 Stats
  const stats = useMemo(() => {
    return {
      total: issues.length,
      pending: issues.filter((i) => i.status === "Pending").length,
      resolved: issues.filter((i) => i.status === "Resolved").length,
    };
  }, [issues]);

  // Handlers
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const resetFilters = () => {
    setFilter("All");
    setSearch("");
  };

  return (
    <div className="mt-16 p-6 space-y-6">
      
      {/* 🔥 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h3 className="font-bold text-lg">Total Issues</h3>
          <p className="text-2xl">{stats.total}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <h3 className="font-bold text-lg">Pending</h3>
          <p className="text-2xl">{stats.pending}</p>
        </div>

        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h3 className="font-bold text-lg">Resolved</h3>
          <p className="text-2xl">{stats.resolved}</p>
        </div>
      </div>

      {/* 🔥 Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <select
          value={filter}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <optgroup label="Category">
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </optgroup>

          <optgroup label="Status">
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </optgroup>
        </select>

        <input
          type="text"
          placeholder="Search issues..."
          value={search}
          onChange={handleSearchChange}
          className="p-2 border rounded w-full md:w-64"
        />

        <button
          onClick={resetFilters}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {/* 🔥 Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Issue List */}
        <div className="flex-1 bg-white rounded-xl shadow p-4">
          {filteredIssues.length === 0 ? (
            <p className="text-gray-500 text-center">
              No issues found 🚫
            </p>
          ) : (
            <IssueList
              issues={filteredIssues}
              updateStatus={updateStatus}
              mapRef={mapRef}
            />
          )}
        </div>

        {/* Map */}
        <div className="flex-1 h-[500px] relative z-0 rounded-xl overflow-hidden shadow">
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