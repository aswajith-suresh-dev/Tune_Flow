import { useState } from "react";
import { forgotPassword } from "../services/authApi";
import { useNavigate } from "react-router-dom";
import "../css/auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setToken("");

    const data = await forgotPassword(email);
    if (data.message) setMessage(data.message);
    if (data.resetToken) setToken(data.resetToken);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Forgot Password</h2>
        <p className="auth-subtext">
          Enter your email to reset your password
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="auth-button" type="submit">
            Send Reset Link
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        {token && (
          <div className="dev-token-box">
            <p className="dev-token">{token}</p>

            <button
              className="auth-button secondary"
              type="button"
              onClick={() =>
                navigate("/reset-password", { state: { token } })
              }
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;