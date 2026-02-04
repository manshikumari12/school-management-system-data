import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // 🔐 Protect admin route
    if (!token || role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
   <div id="admin-container">
  <h2 id="admin-title">Admin Dashboard</h2>

  <p id="admin-info">
    Logged in as: <b>{localStorage.getItem("email")}</b>
  </p>

  <hr />

  <ul id="admin-actions">
    <li>
      <button id="view-students-btn" onClick={() => navigate("/students")}>
        View Students
      </button>
    </li>

    <li>
      <button id="create-student-btn" onClick={() => navigate("/students/create")}>
        Create Student
      </button>
    </li>
  </ul>

  <br />

  <button id="logout-btn" onClick={handleLogout}>Logout</button>
</div>

  );
};

export default AdminDashboard;
