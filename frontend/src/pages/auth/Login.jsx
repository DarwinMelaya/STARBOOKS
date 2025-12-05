import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/users/login", formData);

      if (response.data.success) {
        login(response.data.data.user, response.data.data.token);
        toast.success("Login successful!");
        navigate("/map");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden">
      {/* Ambient glows to match map interface theme */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-32 -top-24 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl"></div>
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl"></div>
        <div className="absolute left-1/3 bottom-[-8rem] h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Brand / hero panel */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-200 shadow-lg shadow-indigo-500/20">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Project Monitoring Platform
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 p-8 shadow-2xl shadow-indigo-900/40 backdrop-blur-xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Monitor, map, and manage every implementation.
              </h1>
              <p className="mt-4 text-slate-300 leading-relaxed">
                Access the interactive map, track project milestones, and keep
                every implementation on course with the same sleek interface you
                see across the platform.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 p-4 shadow-lg shadow-emerald-500/20">
                  <p className="text-sm text-emerald-100/90">Live status</p>
                  <p className="text-lg font-semibold text-white">
                    Projects & Implementations
                  </p>
                </div>
                <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-indigo-500/10 p-4 shadow-lg shadow-indigo-500/20">
                  <p className="text-sm text-indigo-100/90">Secure access</p>
                  <p className="text-lg font-semibold text-white">
                    Role-aware dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Login card */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-cyan-400/40 blur-2xl opacity-70"></div>
            <div className="relative rounded-2xl border border-slate-800/70 bg-slate-950/70 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40">
                    <span className="text-lg font-semibold text-white">PM</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-indigo-200/80">
                      Access Portal
                    </p>
                    <h2 className="text-2xl font-semibold text-white">
                      Sign in
                    </h2>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  Use your credentials to reach the map interface and control
                  center.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-slate-200"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      placeholder="Enter username"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-slate-200"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Enter password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-800/40 transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 transition duration-300 group-hover:opacity-10"></span>
                  {loading ? "Signing in..." : "Sign in to dashboard"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
