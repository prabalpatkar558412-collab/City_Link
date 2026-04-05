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

// Fix Leaflet icons (move outside component - runs once)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Click to select location
const LocationSelector = memo(({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
});

// Fly to location (proper hook usage)
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
  const [submitted, setSubmitted] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Unified input handler
  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files?.[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Image preview with cleanup (fix memory leak)
  useEffect(() => {
    if (!form.image) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(form.image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  // Location search
  const handleSearch = useCallback(async () => {
    if (!form.search.trim()) return;

    try {
      setLoadingSearch(true);

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
    } catch (err) {
      console.error(err);
      alert("Error fetching location");
    } finally {
      setLoadingSearch(false);
    }
  }, [form.search]);

  // Submit
  const handleSubmit = useCallback(() => {
    const { title, desc, location } = form;

    if (!title.trim() || !desc.trim() || !location) {
      alert("Please fill all fields and select a location!");
      return;
    }

    addIssue({
      ...form,
      image: preview,
    });

    setForm({
      title: "",
      desc: "",
      category: "Pothole",
      priority: "Medium",
      image: null,
      location: null,
      search: "",
    });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }, [form, preview, addIssue]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 pt-24">
      
      {/* MAP */}
      <div className="flex-1">
        <MapContainer
          center={[23.2599, 77.4126]}
          zoom={12}
          className="h-[400px] w-full rounded-lg shadow"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {form.location && (
            <Marker
              position={form.location}
              draggable
              eventHandlers={{
                dragend: (e) =>
                  setForm((prev) => ({
                    ...prev,
                    location: e.target.getLatLng(),
                  })),
              }}
            />
          )}

          <LocationSelector
            onSelect={(loc) =>
              setForm((prev) => ({ ...prev, location: loc }))
            }
          />
          <FlyToLocation location={form.location} />
        </MapContainer>

        {/* Search */}
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
            disabled={loadingSearch}
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingSearch ? "..." : "Search"}
          </button>
        </div>

        <p className="text-sm mt-1 text-gray-600">
          {form.location
            ? `📍 [${form.location.lat.toFixed(4)}, ${form.location.lng.toFixed(4)}]`
            : "⚠️ Click map or search location"}
        </p>
      </div>

      {/* FORM */}
      <div className="flex-1 flex flex-col relative">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          Report Issue
        </h2>

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

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        >
          <option>Pothole</option>
          <option>Water Leakage</option>
          <option>Electricity</option>
          <option>Garbage</option>
        </select>

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
          className="mb-3"
        />

        {preview && (
          <div className="relative mb-3">
            <img
              src={preview}
              alt="preview"
              className="rounded max-h-40 object-cover"
            />
            <button
              onClick={() =>
                setForm((prev) => ({ ...prev, image: null }))
              }
              className="absolute top-1 right-1 bg-red-600 text-white px-2 rounded"
            >
              ✕
            </button>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 mt-auto"
        >
          Submit Issue
        </button>

        {submitted && (
          <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-2 rounded shadow">
            ✅ Submitted!
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(IssueForm);