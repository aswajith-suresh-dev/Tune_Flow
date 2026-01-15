import { Link } from "react-router-dom";
import "../css/navbar.css";

function Navbar({ role, onLogout }) {
  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        Music Player
      </div>

      {/* CENTER */}
      <div className="nav-center">
        {/* Always visible */}
        <Link to="/">Home</Link>

        {/* USER */}
        {role === "user" && <Link to="/library">My Library</Link>}

        {/* ADMIN */}
        {role === "admin" && <Link to="/admin">Admin</Link>}

        {/* NOT LOGGED IN */}
        {!role && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>

      {/* RIGHT */}
      {role && (
        <div className="nav-right">
          <button onClick={onLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
// import { Link } from "react-router-dom";
// import "../css/navbar.css";

// function Navbar({ role, onLogout }) {
//   const homeLink =
//     role === "user"
//       ? "/home"
//       : role === "admin"
//       ? "/admin"
//       : "/";

//   return (
//     <nav className="navbar">
//       {/* LEFT */}
//       <div className="nav-left">Music Player</div>

//       {/* CENTER */}
//       <div className="nav-center">
//         <Link to={homeLink}>Home</Link>

//         {role === "user" && <Link to="/library">My Library</Link>}
//         {role === "admin" && <Link to="/admin">Admin</Link>}
//         {!role && <Link to="/login">Login</Link>}
//       </div>

//       {/* RIGHT */}
//       {role && (
//         <div className="nav-right">
//           <button onClick={onLogout}>Logout</button>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;