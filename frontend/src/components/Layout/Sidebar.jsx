import { useNavigate } from "react-router-dom";

const menuItems = [
  { id: "map", label: "Map" },
  { id: "add", label: "Add" },
  { id: "report", label: "Report" },
];

const Sidebar = ({ active = "map", onSelect }) => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    onSelect?.(id);

    if (id === "map") {
      navigate("/map");
    } else if (id === "add") {
      navigate("/add");
    } else if (id === "report") {
      navigate("/report");
    }
  };

  return (
    <aside className="w-56 bg-[#0b2545] text-white shadow-xl flex flex-col h-screen">
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
  );
};

export default Sidebar;
