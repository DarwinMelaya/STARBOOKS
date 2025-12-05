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
        className={`fixed md:static top-0 left-0 z-50 w-64 md:w-56 bg-[#0b2545] text-white shadow-xl flex flex-col h-screen transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-4 py-6 border-b border-white/10">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-200">DOST</p>
          <h2 className="text-xl font-bold">STARBOOKS</h2>
          <p className="text-[0.7rem] text-blue-100">Monitoring Suite</p>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  isActive
                    ? "bg-blue-500/20 border-blue-400 text-white shadow-lg"
                    : "bg-white/5 border-white/10 text-blue-100 hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 text-xs text-blue-100">
          Department of Science and Technology
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
      className="md:hidden fixed top-4 left-4 z-[60] w-12 h-12 bg-gradient-to-br from-[#0b2545] to-[#0a1f3d] rounded-xl shadow-2xl border border-white/10 backdrop-blur-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300"
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
