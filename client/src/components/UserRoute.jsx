import { Navigate } from "react-router-dom";

function UserRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Admin should not see user pages
  if (role !== "user") {
    return <Navigate to="/admin" replace />;
  }

  // ✅ User allowed
  return children;
}

export default UserRoute;
