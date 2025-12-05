import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Login, Map, Add, AddProjects } from "../pages";
import ProtectedRoute from "../components/Security/ProtectedRoute";

export const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <Add />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-projects"
          element={
            <ProtectedRoute>
              <AddProjects />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};
