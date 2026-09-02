import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const ADMIN_EMAIL = "info@elitenesting.com";
const ADMIN_PASSWORD = "Admin@123";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (
      email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      sessionStorage.setItem("eliteNestingAdmin", "true");
      navigate("/estimate");
    } else {
      setError("Invalid admin email or password.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">

        <img
          src="/logo.png"
          alt="Elite Nesting"
          className="admin-logo"
        />

        <h1>Elite Nesting</h1>
        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>

          <label>Admin Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter admin email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          {error && (
            <p className="admin-login-error">
              {error}
            </p>
          )}

          <button type="submit">
            Login
          </button>

        </form>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="back-to-site"
        >
          Back to Website
        </button>

      </div>
    </div>
  );
}