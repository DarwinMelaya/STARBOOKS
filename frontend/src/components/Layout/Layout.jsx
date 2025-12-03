import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({
  children,
  activeSection = "map",
  onSectionChange = () => {},
}) => {
  return (
    <div className="flex h-screen min-h-screen bg-[#030b1a] text-white overflow-hidden">
      <Sidebar active={activeSection} onSelect={onSectionChange} />

      <div className="flex-1 flex flex-col h-full min-h-0">
        <Navbar activeSection={activeSection} />

        <main className="flex-1 relative bg-gradient-to-br from-[#030b1a] via-[#041d3e] to-[#020510]">
          <div className="absolute inset-0">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
