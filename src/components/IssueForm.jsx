import React, { useState, useCallback, useEffect, memo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Click selector
const LocationSelector = memo(({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
});

// Fly to location
const FlyToLocation = memo(({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 13, { duration: 1.5 });
    }
  }, [location, map]);

  return null;
});

function IssueForm({ addIssue }) {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    category: "Pothole",
    priority: "Medium",
    image: null,
    location: null,
    search: "",
  });

  const [preview, setPreview] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files?.[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  useEffect(() => {
    if (!form.image) return setPreview(null);

    const url = URL.createObjectURL(form.image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  const handleSearch = async () => {
    if (!form.search.trim()) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${form.search}`
    );
    const data = await res.json();

    if (data?.[0]) {
      setForm((prev) => ({
        ...prev,
        location: {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        },
      }));
    } else {
      alert("Location not found");
    }
  };

  return (
    // 🔥 FIX: top padding so navbar doesn’t overlap
    <div className="flex flex-col md:flex-row gap-6 p-4 pt-20">
      
      {/* MAP */}
      <div className="flex-1">
        <MapContainer
          center={[23.2599, 77.4126]}
          zoom={12}
          className="h-[400px] w-full rounded-lg shadow z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {form.location && <Marker position={form.location} />}

          <LocationSelector
            onSelect={(loc) =>
              setForm((prev) => ({ ...prev, location: loc }))
            }
          />
          <FlyToLocation location={form.location} />
        </MapContainer>

        <div className="mt-2 flex gap-2">
          <input
            name="search"
            value={form.search}
            onChange={handleChange}
            placeholder="Search location..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Search
          </button>
        </div>
      </div>

      {/* FORM */}
      <div className="flex-1">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Issue Title"
          className="w-full p-2 border rounded mb-3"
        />

        <textarea
          name="desc"
          value={form.desc}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded mb-3"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Submit Issue
        </button>
      </div>
    </div>
  );
}

export default memo(IssueForm);