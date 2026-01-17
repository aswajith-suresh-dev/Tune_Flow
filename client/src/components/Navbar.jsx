import { Link, useLocation } from "react-router-dom";
import "../css/navbar.css";

function Navbar({ role, onLogout }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">EchoPlay</div>

      {/* CENTER */}
      <div className="nav-center">
        {/* NOT LOGGED IN */}
        {!role && (
          <>
            <Link to="/">Home</Link>

            {/* Show Login only if NOT already on login page */}
            {currentPath !== "/login" && <Link to="/login">Login</Link>}

            {/* Show Signup only if NOT already on signup page */}
            {currentPath !== "/signup" && <Link to="/signup">Signup</Link>}
          </>
        )}

        {/* USER */}
        {role === "user" && (
          <>
            <Link to="/home">Home</Link>
            <Link to="/library">My Library</Link>
          </>
        )}

        {/* ADMIN */}
        {role === "admin" && <>{/* Admin has no nav links */}</>}
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        {role && <button onClick={onLogout}>Logout</button>}
      </div>
    </nav>
  );
}

export default Navbar;
