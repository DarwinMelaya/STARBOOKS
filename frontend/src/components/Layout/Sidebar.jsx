import { useNavigate } from "react-router-dom";

const menuItems = [
  { id: "map", label: "Map" },
  { id: "add", label: "Add Starbooks" },
  { id: "add-projects", label: "Add Projects" },
  { id: "report", label: "Report" },
];

const Sidebar = ({ active = "map", onSelect, isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    onSelect?.(id);

    if (id === "map") {
      navigate("/map");
    } else if (id === "add") {
      navigate("/add");
    } else if (id === "add-projects") {
      navigate("/add-projects");
    } else if (id === "report") {
      navigate("/report");
    }

    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      onClose?.();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-50 w-72 md:w-60 text-slate-100 h-screen transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.16),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.12),transparent_30%)] blur-3xl" />
        <div className="absolute inset-0 border border-slate-800/80 rounded-none shadow-2xl shadow-black/50" />

        <div className="relative flex flex-col h-full backdrop-blur-xl">
          <div className="px-5 py-6 border-b border-slate-800/70">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-800/40 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Project Monitoring Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.32em] text-indigo-200/80">
                  DOST - Project Monitoring
                </p>
                <h2 className="text-lg font-semibold text-white leading-tight">
                  Science and Technology Atlas
                </h2>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-100/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live map access
            </div>
          </div>

          <nav className="relative flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleClick(item.id)}
                  className={`group w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border backdrop-blur ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500/25 via-purple-600/25 to-cyan-400/25 border-indigo-400/50 text-white shadow-lg shadow-indigo-800/40"
                      : "bg-slate-900/60 border-slate-800/70 text-slate-200 hover:border-indigo-400/40 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-indigo-900/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <span
                      className={`h-2 w-2 rounded-full transition ${
                        isActive
                          ? "bg-emerald-400 shadow-[0_0_0_4px] shadow-emerald-400/30"
                          : "bg-slate-600 group-hover:bg-indigo-400"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="relative px-5 py-5 border-t border-slate-800/70 text-xs text-slate-300/80">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-900/40">
                D
              </div>
              <div>
                <p className="font-semibold text-white">
                  Department of Science and Technology
                </p>
                <p className="text-[0.7rem] text-slate-400">Philippines</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

// Burger Menu Button Component
export const BurgerMenu = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed top-4 left-4 z-[60] w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 rounded-xl shadow-2xl shadow-indigo-900/50 border border-white/10 backdrop-blur-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300"
      aria-label="Toggle menu"
    >
      <div className="relative w-6 h-6">
        <span
          className={`absolute top-0 left-0 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
            isOpen ? "rotate-45 top-2.5" : ""
          }`}
        />
        <span
          className={`absolute top-2.5 left-0 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute top-5 left-0 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
            isOpen ? "-rotate-45 top-2.5" : ""
          }`}
        />
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse ring-2 ring-blue-400/50"></div>
    </button>
  );
};

export default Sidebar;
