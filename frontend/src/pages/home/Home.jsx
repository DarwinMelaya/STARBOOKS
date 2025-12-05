import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-600/25 blur-3xl"></div>
        <div className="absolute right-10 top-16 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div className="absolute left-1/3 bottom-[-6rem] h-96 w-96 rounded-full bg-purple-600/18 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Logo + intro */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-200 shadow-lg shadow-indigo-500/20">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Department of Science and Technology
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Science and Technology Atlas
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              Explore DOST projects and STARBOOKS implementations across the
              Province of Marinduque. Use the interactive map to monitor
              initiatives and view real-time deployment progress.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/map")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-800/40 transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Open Map
              </button>
              <button
                onClick={() => navigate("/auth/login")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-200 shadow-lg shadow-black/30 transition hover:border-indigo-400/50 hover:bg-slate-900/80"
              >
                Sign in
              </button>
            </div>
          </div>

          {/* Logo card */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-cyan-400/40 blur-2xl opacity-70"></div>
            <div className="relative rounded-2xl border border-slate-800/70 bg-slate-950/70 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-40 h-40 rounded-2xl overflow-hidden border border-slate-800/70 shadow-xl shadow-indigo-900/40 bg-slate-900/60">
                  <img
                    src="/logo.png"
                    alt="Project Monitoring Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.24em] text-indigo-200/80">
                    Project Monitoring
                  </p>
                  <h2 className="text-2xl font-semibold text-white">
                    Science and Technology Atlas
                  </h2>
                  <p className="text-sm text-slate-300 max-w-sm">
                    Explore DOST projects and STARBOOKS implementations across
                    the Province of Marinduque. Use the interactive map to
                    monitor initiatives and view real-time deployment progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
