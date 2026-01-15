import { useState, useEffect } from "react";
import { resetPassword } from "../services/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/auth.css";

function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // 🔁 Auto-fill token if coming from Forgot Password
  useEffect(() => {
    if (location.state?.token) {
      setToken(location.state.token);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const data = await resetPassword(token, newPassword);

    if (data.message) {
      setMessage(data.message);
      if (data.message.toLowerCase().includes("successful")) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Reset Password</h2>
        <p className="auth-subtext">
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Reset Token"
            className="auth-input"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="New Password"
            className="auth-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button className="auth-button" type="submit">
            Reset Password
          </button>
        </form>

        {message && (
          <p
            className="auth-message"
            style={{ color: success ? "#22c55e" : "#f87171" }}
          >
            {message}
          </p>
        )}

        {success && (
          <p className="auth-subtext">
            Redirecting to login…
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;