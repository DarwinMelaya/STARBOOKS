import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AddProjectModal from "../../components/Modals/AddProjectModal";
import api from "../../utils/api";

const AddProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoadingList(true);
      setListError(null);
      const res = await api.get("/projects");
      if (res.data?.success) {
        setProjects(res.data.data || []);
      } else {
        setListError(res.data?.message || "Failed to load projects");
      }
    } catch (error) {
      setListError(error.response?.data?.message || "Failed to load projects");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout activeSection="add-projects">
      <div className="h-full w-full flex flex-col bg-[#030b1a]">
        <div className="max-w-6xl w-full mx-auto my-10 px-4">
          {/* Header with Add Project button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-50">Projects</h2>
              <p className="text-xs text-blue-100 mt-1">
                List of recorded projects.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-sm px-4 py-2 rounded-full border border-blue-300/60 bg-indigo-500 hover:bg-indigo-600 text-white font-medium"
            >
              Add Project
            </button>
          </div>

          {/* Projects List */}
          <div className="bg-[#0b2545] text-blue-50 rounded-2xl shadow-2xl border border-white/10 p-6">
            {loadingList && (
              <p className="text-xs text-blue-100">Loading projects…</p>
            )}
            {listError && <p className="text-xs text-red-300">{listError}</p>}
            {!loadingList && !listError && projects.length === 0 && (
              <p className="text-xs text-blue-100">No projects recorded yet.</p>
            )}

            {!loadingList && !listError && projects.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-blue-300/20">
                  <thead className="bg-blue-900/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                        Project Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                        Coordinates
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-300/10">
                    {projects.map((project) => (
                      <tr key={project._id} className="hover:bg-blue-800/10">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                          {project.projectTitle}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-100">
                          {project.location}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-blue-100">
                          Lat: {project.coordinates.lat.toFixed(6)}
                          <br />
                          Lng: {project.coordinates.lng.toFixed(6)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-blue-200">
                          {new Date(project.createdAt).toLocaleString("en-PH", {
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

        {/* Add Project Modal */}
        <AddProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchProjects}
        />
      </div>
    </Layout>
  );
};

export default AddProjects;
