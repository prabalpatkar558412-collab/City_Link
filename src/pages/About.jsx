import { useMemo, memo } from "react";
import { FaRoad, FaWater, FaBolt, FaTrash } from "react-icons/fa";

// Static category config
const CATEGORY_CONFIG = {
  Pothole: {
    icon: FaRoad,
    color: "text-blue-600",
  },
  "Water Leakage": {
    icon: FaWater,
    color: "text-blue-400",
  },
  Electricity: {
    icon: FaBolt,
    color: "text-yellow-500",
  },
  Garbage: {
    icon: FaTrash,
    color: "text-green-500",
  },
};

function About({ issues = [] }) {
  // Memoized stats (better than useEffect + state)
  const stats = useMemo(() => {
    const total = issues.length;
    let resolved = 0;
    let pending = 0;
    const categories = {};

    for (const issue of issues) {
      if (issue.status === "Resolved") resolved++;
      if (issue.status === "Pending") pending++;

      if (issue.category) {
        categories[issue.category] =
          (categories[issue.category] || 0) + 1;
      }
    }

    return { total, resolved, pending, categories };
  }, [issues]);

  // Avoid division by zero
  const getPercentage = (value) =>
    stats.total ? (value / stats.total) * 100 : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      
      <h2 className="text-3xl font-bold text-blue-600">
        About This Platform
      </h2>

      <p className="text-gray-700">
        This platform allows citizens to report and track civic issues like
        potholes, water leaks, power outages, and garbage problems.
      </p>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 text-center">
        {Object.entries(CATEGORY_CONFIG).map(([cat, config]) => {
          const Icon = config.icon;

          return (
            <div
              key={cat}
              className="p-4 border rounded shadow hover:scale-105 transition duration-300"
            >
              <Icon
                className={`text-4xl ${config.color} mx-auto mb-2`}
              />
              <p>{cat}</p>
              <p className="text-sm text-gray-600">
                {stats.categories[cat] ?? 0} issues
              </p>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="space-y-4 mt-8">
        <h3 className="text-2xl font-semibold">
          Civic Engagement Stats
        </h3>

        <StatBar
          label="Total Issues"
          value={stats.total}
          percent={100}
          color="bg-blue-600"
        />

        <StatBar
          label="Resolved Issues"
          value={stats.resolved}
          percent={getPercentage(stats.resolved)}
          color="bg-green-500"
        />

        <StatBar
          label="Pending Issues"
          value={stats.pending}
          percent={getPercentage(stats.pending)}
          color="bg-yellow-500"
        />
      </div>
    </div>
  );
}

// Better stat bar
const StatBar = memo(({ label, value, percent, color }) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="w-full bg-gray-200 h-4 rounded">
        <div
          className={`${color} h-4 rounded transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
});

export default memo(About);