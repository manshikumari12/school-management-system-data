import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../Css/File.css';
const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:1010/api/register",
        formData
      );

      setSuccess(res.data.msg);

      // Redirect to login after success
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
   <div id="signup-container">
  <h2 id="signup-title">Signup</h2>

  {error && <p id="signup-error">{error}</p>}
  {success && <p id="signup-success">{success}</p>}

  <form id="signup-form" onSubmit={handleSubmit}>
    <input
      type="text"
      id="signup-name"
      name="name"
      placeholder="Name"
      value={formData.name}
      onChange={handleChange}
      required
    />

    <input
      type="email"
      id="signup-email"
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange}
      required
    />

    <input
      type="password"
      id="signup-password"
      name="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleChange}
      required
    />

    <select id="signup-role" name="role" value={formData.role} onChange={handleChange}>
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>

    <button id="signup-button" type="submit">Register</button>
  </form>
</div>

  );
};

export default Signup;
