import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoutes from "./utils/ProtectedRoutes";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Stats from "./pages/Stats";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Landing from "./pages/Landing";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/home"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoutes>
              <Tasks />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoutes>
              <Stats />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoutes>
              <Achievements />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
