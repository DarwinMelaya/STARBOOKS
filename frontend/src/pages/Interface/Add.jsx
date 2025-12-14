import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import api from "../../utils/api";
import toast from "react-hot-toast";
import AddImplementationModal from "../../components/Modals/AddImplementationModal";

const Add = () => {
  const [implementations, setImplementations] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toggling, setToggling] = useState({});

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

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  return (
    <Layout activeSection="add">
      <div className="h-full w-full flex flex-col bg-[#030b1a]">
        <div className="max-w-6xl w-full mx-auto my-10 px-4">
          {/* Header with Add Implementation button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-50">
                Implementations
              </h2>
              <p className="text-xs text-blue-100 mt-1">
                List of recorded STARBOOKS implementation points.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddModal}
              className="text-sm px-4 py-2 rounded-full border border-blue-300/60 bg-indigo-500 hover:bg-indigo-600 text-white font-medium"
            >
              Add Implementation
            </button>
          </div>

          {/* Implementations List */}
          <div className="bg-[#0b2545] text-blue-50 rounded-2xl shadow-2xl border border-white/10 p-6">
            {loadingList && (
              <p className="text-xs text-blue-100">Loading implementations…</p>
            )}
            {listError && <p className="text-xs text-red-300">{listError}</p>}
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                        Place
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                        Coordinates
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-300/10">
                    {implementations.map((impl) => (
                      <tr key={impl._id} className="hover:bg-blue-800/10">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                          {impl.place}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-blue-100">
                          Lat: {impl.coordinates.lat.toFixed(6)}
                          <br />
                          Lng: {impl.coordinates.lng.toFixed(6)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
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
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-blue-200">
                          {new Date(impl.createdAt).toLocaleString("en-PH", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add Implementation Modal */}
        <AddImplementationModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onSuccess={fetchImplementations}
        />
      </div>
    </Layout>
  );
};

export default Add;
