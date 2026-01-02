import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import AdminUpload from "./pages/AdminUpload";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Login from "./pages/Login";
import UserLibrary from "./pages/UserLibrary";

function App() {
  const [songs, setSongs] = useState([]);
  const [role, setRole] = useState(null);

  // 🔁 Load auth state ONCE
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole);
  }, []);

  const fetchSongs = () => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    window.location.href = "/login";
  };

  return (
    <BrowserRouter>
      {/* 🔹 NAVBAR */}
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <Link to="/">Home</Link>

        {!role && (
          <>
            {" | "}
            <Link to="/login">Login</Link>
          </>
        )}

        {role === "admin" && (
          <>
            {" | "}
            <Link to="/admin">Admin</Link>
          </>
        )}
{role === "user" && <> | <Link to="/library">My Library</Link></>}
        {role && (
          <>
            {" | "}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        
      </nav>

      {/* 🔹 ROUTES */}
      <Routes>
        <Route path="/" element={<Home songs={songs} />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminUpload
                onUploadSuccess={fetchSongs}
                songs={songs}
              />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/library" element={<UserLibrary songs={songs} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
