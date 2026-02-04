import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Email and password are required");
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:1010/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return setError(data.msg);
      }

      // ✅ Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("email", data.user.email);

      // ✅ Role based navigation
      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.user.role === "user") {
        navigate("/dashboard");
      }

    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div id="login-container">
  <h2 id="login-title">Login</h2>

  {error && <p id="login-error">{error}</p>}

  <form id="login-form" onSubmit={handleSubmit}>
    <input
      type="email"
      id="login-email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />

    <br /><br />

    <input
      type="password"
      id="login-password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <br /><br />

    <button id="login-button" type="submit" disabled={loading}>
      {loading ? "Logging in..." : "Login"}
    </button>
  </form>
</div>

  );
};

export default Login;
