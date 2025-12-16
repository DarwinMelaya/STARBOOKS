import { useEffect, useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AddProjectModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    projectTitle: "",
    location: "",
    coordinates: "",
    programType: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        projectTitle: "",
        location: "",
        coordinates: "",
        programType: "",
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.projectTitle ||
      !formData.location ||
      !formData.coordinates ||
      !formData.programType
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const coordParts = formData.coordinates.split(",").map((p) => p.trim());
    if (coordParts.length !== 2) {
      toast.error("Coordinates must be in 'lat, lng' format");
      return;
    }

    const lat = Number(coordParts[0]);
    const lng = Number(coordParts[1]);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      toast.error("Coordinates must be valid numbers");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        projectTitle: formData.projectTitle,
        location: formData.location,
        coordinates: { lat, lng },
        programType: formData.programType,
      };

      const res = await api.post("/projects", payload);

      if (res.data?.success) {
        toast.success("Project record saved");
        setFormData({
          projectTitle: "",
          location: "",
          coordinates: "",
          programType: "",
        });
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.data?.message || "Failed to save record");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to save project";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0b2545] text-blue-50 rounded-2xl shadow-2xl border border-white/10 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold">Add Project</h3>
            <p className="text-xs text-blue-100 mt-1">
              Record a new project with location and coordinates.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-3 py-1 rounded-full border border-blue-300/60 hover:bg-blue-500/20"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="projectTitle"
              className="block text-sm font-medium text-blue-100 mb-1"
            >
              Project Title
            </label>
            <input
              id="projectTitle"
              name="projectTitle"
              type="text"
              value={formData.projectTitle}
              onChange={handleChange}
              className="block w-full rounded-md border border-blue-400/40 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:ring-indigo-400 bg-white text-gray-900 placeholder-gray-400"
              placeholder="e.g. Project 1"
              required
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-blue-100 mb-1"
            >
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="block w-full rounded-md border border-blue-400/40 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:ring-indigo-400 bg-white text-gray-900 placeholder-gray-400"
              placeholder="e.g. Sta Cruz, Marinduque"
              required
            />
          </div>

          <div>
            <label
              htmlFor="programType"
              className="block text-sm font-medium text-blue-100 mb-1"
            >
              Program Type
            </label>
            <select
              id="programType"
              name="programType"
              value={formData.programType}
              onChange={handleChange}
              className="block w-full rounded-md border border-blue-400/40 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:ring-indigo-400 bg-white text-gray-900"
              required
            >
              <option value="">Select a program type</option>
              <option value="GIA: Grants-In-Aid Program">
                GIA: Grants-In-Aid Program
              </option>
              <option value="SETUP: Small Enterprise Technology Upgrading Program">
                SETUP: Small Enterprise Technology Upgrading Program
              </option>
              <option value="CEST: Community Empowerment through Science and Technology Program">
                CEST: Community Empowerment through Science and Technology
                Program
              </option>
              <option value="SSCP: Smart and Sustainable Communities Program">
                SSCP: Smart and Sustainable Communities Program
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="coordinates"
              className="block text-sm font-medium text-blue-100 mb-1"
            >
              Coordinates
            </label>
            <input
              id="coordinates"
              name="coordinates"
              type="text"
              value={formData.coordinates}
              onChange={handleChange}
              className="block w-full rounded-md border border-blue-400/40 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:ring-indigo-400 bg-white text-gray-900 placeholder-gray-400"
              placeholder="e.g. 13.503800231301934, 122.08868404262736"
              required
            />
            <p className="mt-1 text-xs text-blue-200">
              Use format: latitude, longitude
            </p>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0b2545] disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Project"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md border border-blue-300/60 px-4 py-2 text-sm font-medium text-blue-100 hover:bg-blue-500/20"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
