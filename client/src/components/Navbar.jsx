import { Link } from "react-router-dom";
import "../css/navbar.css";

function Navbar({ role, onLogout }) {
  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        EchoPlay
      </div>

      {/* CENTER */}
      <div className="nav-center">
        <Link to={role ? "/home" : "/"}>Home</Link>

        {role === "user" && <Link to="/library">My Library</Link>}
        {role === "admin" && <Link to="/admin">Admin</Link>}

        {!role && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>

      {/* RIGHT — ALWAYS RENDERED */}
      <div className="nav-right">
        {role && <button onClick={onLogout}>Logout</button>}
      </div>
    </nav>
  );
}

export default Navbar;