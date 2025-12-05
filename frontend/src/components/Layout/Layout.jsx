import { useState } from "react";
import Sidebar, { BurgerMenu } from "./Sidebar";

const Layout = ({
  children,
  activeSection = "map",
  onSectionChange = () => {},
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen min-h-screen bg-[#030b1a] text-white overflow-hidden">
      <BurgerMenu
        onClick={() => setSidebarOpen(!sidebarOpen)}
        isOpen={sidebarOpen}
      />
      <Sidebar
        active={activeSection}
        onSelect={onSectionChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full min-h-0">
        <main className="flex-1 relative bg-gradient-to-br from-[#030b1a] via-[#041d3e] to-[#020510]">
          <div className="absolute inset-0">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
