const Navbar = ({ activeSection = "map" }) => {
  return (
    <header className="flex-none bg-[#051632] border-b border-white/10 px-8 py-4 flex items-center justify-between shadow-lg z-40">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-blue-300">
          DOST STARBOOKS MONITORING
        </p>
        <h1 className="text-2xl font-bold">Science and Technology Atlas</h1>
        <p className="text-sm text-blue-100">
          Monitoring and Reporting Platform
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right text-xs text-blue-100">
          <p>Active Section</p>
          <p className="text-lg font-semibold capitalize text-white">
            {activeSection}
          </p>
        </div>
        <div className="h-12 w-12 rounded-full bg-blue-500/30 border border-blue-300/40 flex items-center justify-center text-sm font-semibold">
          DOST
        </div>
      </div>
    </header>
  );
};

export default Navbar;
