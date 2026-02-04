import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateStudent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    course: "React",
    status: "Active",
  });

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:1010/student/students",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      navigate("/admin-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
  <div id="create-student-container">
  <h2 id="create-student-title">Create Student</h2>

  <form id="create-student-form" onSubmit={handleSubmit}>

    <div className="form-group">
      <label htmlFor="student-name">Name:</label>
      <input
        id="student-name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="student-email">Email:</label>
      <input
        id="student-email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="student-age">Age:</label>
      <input
        id="student-age"
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label htmlFor="student-course">Course:</label>
      <select
        id="student-course"
        name="course"
        value={formData.course}
        onChange={handleChange}
      >
        <option value="React">React</option>
        <option value="Node">Node</option>
        <option value="Java">Java</option>
        <option value="Python">Python</option>
      </select>
    </div>

    <div className="form-group">
      <label htmlFor="student-status">Status:</label>
      <select
        id="student-status"
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>

    <br />

    <button id="create-student-btn" type="submit">Create Student</button>
    <button
      id="cancel-student-btn"
      type="button"
      onClick={() => navigate("/admin-dashboard")}
    >
      Cancel
    </button>
  </form>
</div>

  );
};

export default CreateStudent;
