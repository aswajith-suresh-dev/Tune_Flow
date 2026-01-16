import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Signup from "./pages/signup";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminUpload from "./pages/AdminUpload";
import UserLibrary from "./pages/UserLibrary";
import ProtectedRoute from "./components/ProtectedRoute";
import UserRoute from "./components/UserRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const [songs, setSongs] = useState([]);
  const [role, setRole] = useState(localStorage.getItem("role"));
const fetchSongs = async () => {
  try {
    const res = await fetch("/api/songs");
    const data = await res.json();
    setSongs(data);
  } catch (err) {
    console.error("Failed to fetch songs", err);
  }
};

  useEffect(() => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data));
  }, []);
useEffect(() => {
  fetchSongs();
}, []);
  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      <Navbar role={role} onLogout={handleLogout} />
    

  <div className="app-content">
    <Routes>{/* routes */}</Routes>
  </div>

      <Routes>
        {/* 🌍 Public Landing */}
        <Route path="/" element={<Landing />} />

        {/* 🎵 User Home */}
        <Route
          path="/home"
          element={
            <UserRoute>
              <Home songs={songs} />
            </UserRoute>
          }
        />

        {/* 📚 User Library */}
        <Route
          path="/library"
          element={
            <UserRoute>
              <UserLibrary songs={songs} />
            </UserRoute>
          }
        />

        {/* 🛠 Admin */}
        <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminUpload
        songs={songs}
        onUploadSuccess={fetchSongs}
      />
    </ProtectedRoute>
  }
/>
<Route path="/signup" element={<Signup />} />
        {/* 🔐 Auth */}
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;