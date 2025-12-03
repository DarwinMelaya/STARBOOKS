import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Add = () => {
  const [formData, setFormData] = useState({
    place: "",
    coordinates: "",
    implemented: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.place || !formData.coordinates) {
      toast.error("Please fill in place and coordinates");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        place: formData.place,
        coordinates: formData.coordinates,
        implemented: formData.implemented,
      };

      const res = await api.post("/implementations", payload);

      if (res.data?.success) {
        toast.success("Implementation record saved");
        setFormData({
          place: "",
          coordinates: "",
          implemented: false,
        });
      } else {
        toast.error(res.data?.message || "Failed to save record");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to save implementation";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout activeSection="add">
      <div className="h-full w-full flex flex-col bg-gray-100">
        <div className="max-w-xl w-full mx-auto my-10 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Add Implementation
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Record a STARBOOKS implementation location with coordinates and
            status.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="place"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Implementation Place
              </label>
              <input
                id="place"
                name="place"
                type="text"
                value={formData.place}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="e.g. Boac National High School"
                required
              />
            </div>

            <div>
              <label
                htmlFor="coordinates"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Coordinates
              </label>
              <input
                id="coordinates"
                name="coordinates"
                type="text"
                value={formData.coordinates}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="e.g. 13.503800231301934, 122.08868404262736"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Use format: latitude, longitude
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="implemented"
                name="implemented"
                type="checkbox"
                checked={formData.implemented}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="implemented"
                className="text-sm font-medium text-gray-700"
              >
                Already implemented
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Implementation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Add;
