import { useMemo, memo } from "react";
import { FaRoad, FaWater, FaBolt, FaTrash } from "react-icons/fa";

const CATEGORY_CONFIG = {
  Pothole: { icon: FaRoad, color: "text-blue-600" },
  "Water Leakage": { icon: FaWater, color: "text-blue-400" },
  Electricity: { icon: FaBolt, color: "text-yellow-500" },
  Garbage: { icon: FaTrash, color: "text-green-500" },
};

function About({ issues = [] }) {
  const stats = useMemo(() => {
    const total = issues.length;
    let resolved = 0;
    let pending = 0;
    let inProgress = 0;
    const categories = {};

    for (const issue of issues) {
      if (issue.status === "Resolved") resolved++;
      else if (issue.status === "Pending") pending++;
      else if (issue.status === "In Progress") inProgress++;

      if (issue.category) {
        categories[issue.category] =
          (categories[issue.category] || 0) + 1;
      }
    }

    // 🔥 Top category
    let topCategory = "None";
    let max = 0;
    for (const [cat, count] of Object.entries(categories)) {
      if (count > max) {
        max = count;
        topCategory = cat;
      }
    }

    return {
      total,
      resolved,
      pending,
      inProgress,
      categories,
      topCategory,
      successRate: total ? Math.round((resolved / total) * 100) : 0,
    };
  }, [issues]);

  const getPercentage = (value) =>
    stats.total ? (value / stats.total) * 100 : 0;

  const recentIssues = issues.slice(-3).reverse();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10 mt-16">
      
      {/* Title */}
      <h2 className="text-4xl font-bold text-blue-600">
        About Civic Link
      </h2>

      <p className="text-gray-700">
        Civic Link empowers citizens to report and track civic issues in real time.
      </p>

      {/* 🔥 Highlight Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Total Issues" value={stats.total} />
        <Card title="Success Rate" value={`${stats.successRate}%`} />
        <Card title="Top Category" value={stats.topCategory} />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {Object.entries(CATEGORY_CONFIG).map(([cat, config]) => {
          const Icon = config.icon;

          return (
            <div
              key={cat}
              className="p-4 border rounded shadow hover:scale-105 transition"
            >
              <Icon className={`text-4xl ${config.color} mx-auto mb-2`} />
              <p>{cat}</p>
              <p className="text-sm text-gray-600">
                {stats.categories[cat] ?? 0} issues
              </p>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Civic Stats</h3>

        <StatBar
          label="Resolved"
          value={stats.resolved}
          percent={getPercentage(stats.resolved)}
          color="bg-green-500"
        />

        <StatBar
          label="Pending"
          value={stats.pending}
          percent={getPercentage(stats.pending)}
          color="bg-yellow-500"
        />

        <StatBar
          label="In Progress"
          value={stats.inProgress}
          percent={getPercentage(stats.inProgress)}
          color="bg-blue-500"
        />
      </div>

      {/* 🔥 Recent Issues */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">
          Recent Reports
        </h3>

        {recentIssues.length === 0 ? (
          <p className="text-gray-500">No recent issues</p>
        ) : (
          <div className="space-y-3">
            {recentIssues.map((issue, i) => (
              <div
                key={i}
                className="p-3 border rounded hover:bg-gray-50"
              >
                <h4 className="font-bold">{issue.title}</h4>
                <p className="text-sm text-gray-600">
                  📍 {issue.city || "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 🔥 Small reusable card
const Card = ({ title, value }) => (
  <div className="p-4 bg-white shadow rounded text-center">
    <p className="text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold text-blue-600">{value}</h3>
  </div>
);

// Stat bar
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