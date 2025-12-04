import { useEffect, useState } from "react";
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
  const [implementations, setImplementations] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggling, setToggling] = useState({});

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
        // Refresh list
        fetchImplementations();
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

  const fetchImplementations = async () => {
    try {
      setLoadingList(true);
      setListError(null);
      const res = await api.get("/implementations");
      if (res.data?.success) {
        setImplementations(res.data.data || []);
      } else {
        setListError(res.data?.message || "Failed to load implementations");
      }
    } catch (error) {
      setListError(
        error.response?.data?.message || "Failed to load implementations"
      );
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchImplementations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    setToggling((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await api.patch(`/implementations/${id}`, {
        implemented: !currentStatus,
      });

      if (res.data?.success) {
        toast.success("Status updated successfully");
        fetchImplementations();
      } else {
        toast.error(res.data?.message || "Failed to update status");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update status";
      toast.error(msg);
    } finally {
      setToggling((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <Layout activeSection="add">
      <div className="h-full w-full flex flex-col bg-[#030b1a]">
        <div className="max-w-4xl w-full mx-auto my-10 flex gap-6">
          {/* Left: Form card styled like sidebar */}
          <div className="flex-1 bg-[#0b2545] text-blue-50 rounded-2xl shadow-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Add Implementation</h2>
                <p className="text-xs text-blue-100 mt-1">
                  Record a STARBOOKS implementation location.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-xs px-3 py-1 rounded-full border border-blue-300/60 bg-blue-500/20 hover:bg-blue-500/30 font-medium"
              >
                View Implementations
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="place"
                  className="block text-sm font-medium text-blue-100 mb-1"
                >
                  Implementation Place
                </label>
                <input
                  id="place"
                  name="place"
                  type="text"
                  value={formData.place}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-blue-400/40 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:ring-indigo-400 bg-white text-gray-900 placeholder-gray-400"
                  placeholder="e.g. Boac National High School"
                  required
                />
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

              <div className="flex items-center gap-2">
                <input
                  id="implemented"
                  name="implemented"
                  type="checkbox"
                  checked={formData.implemented}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-blue-300 text-indigo-400 focus:ring-indigo-400"
                />
                <label
                  htmlFor="implemented"
                  className="text-sm font-medium text-blue-50"
                >
                  Already implemented
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0b2545] disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Implementation"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal for implementations list */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#0b2545] text-blue-50 rounded-2xl shadow-2xl border border-white/10 max-w-3xl w-full mx-4 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-semibold">Implementations</h3>
                  <p className="text-xs text-blue-100">
                    List of recorded STARBOOKS implementation points.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs px-3 py-1 rounded-full border border-blue-300/60 hover:bg-blue-500/20"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {loadingList && (
                  <p className="text-xs text-blue-100">
                    Loading implementations…
                  </p>
                )}
                {listError && (
                  <p className="text-xs text-red-300">{listError}</p>
                )}
                {!loadingList && !listError && implementations.length === 0 && (
                  <p className="text-xs text-blue-100">
                    No implementations recorded yet.
                  </p>
                )}

                {!loadingList && !listError && implementations.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-blue-300/20">
                      <thead className="bg-blue-900/30">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                            Place
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                            Coordinates
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                            Created
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-300/10">
                        {implementations.map((impl) => (
                          <tr key={impl._id} className="hover:bg-blue-800/10">
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-white">
                              {impl.place}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-100">
                              Lat: {impl.coordinates.lat.toFixed(6)}
                              <br />
                              Lng: {impl.coordinates.lng.toFixed(6)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <button
                                onClick={() =>
                                  toggleStatus(impl._id, impl.implemented)
                                }
                                disabled={toggling[impl._id]}
                                className={`text-[0.7rem] px-2 py-1 rounded-full font-medium ${
                                  impl.implemented
                                    ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/60"
                                    : "bg-amber-500/20 text-amber-100 border border-amber-400/60"
                                } ${
                                  toggling[impl._id]
                                    ? "opacity-70 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              >
                                {toggling[impl._id]
                                  ? "Updating..."
                                  : impl.implemented
                                  ? "Implemented"
                                  : "Not implemented"}
                              </button>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-blue-200">
                              {new Date(impl.createdAt).toLocaleString(
                                "en-PH",
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                }
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Add;
