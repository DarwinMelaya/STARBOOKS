import { useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const DeleteProjectModal = ({ isOpen, onClose, onSuccess, project }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!project?._id) {
      toast.error("Project information is missing");
      return;
    }

    setLoading(true);
    try {
      const res = await api.delete(`/projects/${project._id}`);

      if (res.data?.success) {
        toast.success("Project deleted successfully");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.data?.message || "Failed to delete project");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to delete project";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0b2545] text-blue-50 rounded-2xl shadow-2xl border border-white/10 max-w-md w-full mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-red-400">Delete Project</h3>
            <p className="text-xs text-blue-100 mt-1">
              This action cannot be undone.
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

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-400/50">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-red-400"
                >
                  <path
                    d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-100 mb-1">
                  Are you sure you want to delete this project?
                </p>
                <p className="text-lg font-semibold text-white">
                  {project.projectTitle}
                </p>
              </div>
            </div>

            <div className="bg-blue-900/30 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-blue-200">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-blue-400"
                >
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{project.location}</span>
              </div>
              {project.programType && (
                <div className="flex items-center gap-2 text-blue-200">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-blue-400"
                  >
                    <path
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{project.programType}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#0b2545] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                "Delete Project"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md border border-blue-300/60 px-4 py-2 text-sm font-medium text-blue-100 hover:bg-blue-500/20 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectModal;

