import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { memo, useMemo } from "react";
import "leaflet/dist/leaflet.css";

function AllIssuesMap({ issues = [] }) {
  // Memoize valid markers to avoid recalculating on every render
  const validIssues = useMemo(() => {
    return issues.filter(
      (issue) =>
        issue?.location?.lat != null && issue?.location?.lng != null
    );
  }, [issues]);

  return (
    <MapContainer
      center={[23.2599, 77.4126]}
      zoom={12}
      className="h-80 w-full rounded-xl mt-6"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validIssues.map((issue) => (
        <Marker
          key={issue.id || `${issue.location.lat}-${issue.location.lng}`}
          position={[issue.location.lat, issue.location.lng]}
        />
      ))}
    </MapContainer>
  );
}

// Prevent unnecessary re-renders if props don't change
export default memo(AllIssuesMap);