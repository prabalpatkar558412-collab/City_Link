import { useState, useCallback, useEffect, memo } from "react";
import MapPicker from "./MapPicker";

const CATEGORIES = ["Pothole", "Water Leakage", "Electricity", "Garbage"];
const PRIORITIES = ["Low", "Medium", "High"];

function IssueForm({ addIssue }) {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    category: "Pothole",
    priority: "Medium",
    image: null,
    location: null,
  });

  const [preview, setPreview] = useState(null);

  // Handle input changes (single handler)
  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files?.[0];
      setForm((prev) => ({ ...prev, image: file }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Generate preview safely (fix memory leak)
  useEffect(() => {
    if (!form.image) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(form.image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl); // cleanup
  }, [form.image]);

  const handleSubmit = useCallback(() => {
    const { title, desc, location } = form;

    if (!title.trim() || !desc.trim() || !location) {
      alert("Please fill all required fields!");
      return;
    }

    addIssue({
      ...form,
      image: preview, // use preview URL
    });

    // Reset form
    setForm({
      title: "",
      desc: "",
      category: "Pothole",
      priority: "Medium",
      image: null,
      location: null,
    });
    setPreview(null);
  }, [form, preview, addIssue]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-600">
        Report Issue
      </h2>

      {/* Title */}
      <input
        name="title"
        className="w-full p-2 border rounded mb-3"
        placeholder="Issue Title"
        value={form.title}
        onChange={handleChange}
      />

      {/* Description */}
      <textarea
        name="desc"
        className="w-full p-2 border rounded mb-3"
        placeholder="Description"
        value={form.desc}
        onChange={handleChange}
      />

      {/* Category */}
      <select
        name="category"
        className="w-full p-2 border rounded mb-3"
        value={form.category}
        onChange={handleChange}
      >
        {CATEGORIES.map((cat) => (
          <option key={cat}>{cat}</option>
        ))}
      </select>

      {/* Priority */}
      <select
        name="priority"
        className="w-full p-2 border rounded mb-3"
        value={form.priority}
        onChange={handleChange}
      >
        {PRIORITIES.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>

      {/* Image Upload */}
      <input
        type="file"
        name="image"
        className="w-full mb-3"
        onChange={handleChange}
        accept="image/*"
      />

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mb-3 rounded max-h-48 object-cover"
        />
      )}

      {/* Map */}
      <div className="mb-3">
        <p className="text-sm mb-1">Select Location:</p>
        <MapPicker
          setLocation={(loc) =>
            setForm((prev) => ({ ...prev, location: loc }))
          }
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
      >
        Submit Issue
      </button>
    </div>
  );
}

export default memo(IssueForm);