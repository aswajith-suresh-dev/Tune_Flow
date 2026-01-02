import { useState } from "react";
import { forgotPassword } from "../services/authApi";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await forgotPassword(email);
    setMessage(data.message);
    if (data.resetToken) setToken(data.resetToken);
  };

  return (
    <div>
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
      {token && <p>Reset Token (DEV): {token}</p>}
    </div>
  );
}

export default ForgotPassword;
