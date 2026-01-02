export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
const handleLogout = () => {
  localStorage.clear();
  setRole(null);
  window.location.href = "/login";
};
  window.location.href = "/login";
};
