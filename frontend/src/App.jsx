import { Routers } from "./Routers/Routers";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <AuthProvider>
      <div>
        <Routers />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
};

export default App;
