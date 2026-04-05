import React, { memo, useCallback } from "react";

const STATUS_STYLES = {
  Pending: "text-yellow-500",
  "In Progress": "text-blue-500",
  Resolved: "text-green-500",
};

function IssueList({ issues = [], updateStatus }) {
  // Memoized handler (prevents inline function recreation)
  const handleStatusChange = useCallback(
    (id, status) => {
      updateStatus(id, status);
    },
    [updateStatus]
  );

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Complaints</h2>

      {issues.length === 0 ? (
        <p className="text-gray-500">No complaints yet</p>
      ) : (
        issues.map((issue) => (
          <div
            key={issue.id || `${issue.title}-${issue.time}`}
            className="border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition"
          >
            <h3 className="font-bold text-lg">{issue.title}</h3>
            <p className="text-gray-600">{issue.desc}</p>

            {issue.time && (
              <p className="text-sm text-gray-400">{issue.time}</p>
            )}

            <p
              className={`font-semibold ${
                STATUS_STYLES[issue.status] || "text-gray-500"
              }`}
            >
              {issue.status}
            </p>

            <div className="mt-2 flex gap-2 flex-wrap">
              {issue.status !== "In Progress" && (
                <button
                  onClick={() =>
                    handleStatusChange(issue.id, "In Progress")
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  In Progress
                </button>
              )}

              {issue.status !== "Resolved" && (
                <button
                  onClick={() =>
                    handleStatusChange(issue.id, "Resolved")
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  Resolved
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default memo(IssueList);