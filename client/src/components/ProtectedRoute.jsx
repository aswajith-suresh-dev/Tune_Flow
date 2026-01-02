// import { Navigate } from "react-router-dom";

// function ProtectedRoute({ children }) {
//   const isAdmin = localStorage.getItem("isAdmin");

//   if (!isAdmin) {
//     return <Navigate to="/admin-login" replace />;
//   }

//   return children;
// }


// function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   if (role !== "admin") {
//     return <Navigate to="/" />;
//   }

//   return children;
// }


// export default ProtectedRoute;
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but not admin
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
}

export default ProtectedRoute;
