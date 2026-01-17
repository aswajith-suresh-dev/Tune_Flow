import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authApi";
import "../css/auth.css";

function Login({ setRole }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = await loginUser(email, password);

    if (!data.token) {
      setError("Invalid email or password");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    setRole(data.user.role);

    navigate(data.user.role === "admin" ? "/admin" : "/home");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        {error && <p className="auth-message">{error}</p>}

        <div className="auth-links">
          <a href="/forgot-password">Forgot password?</a>
          <br />
          <a href="/signup">Create an account</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
