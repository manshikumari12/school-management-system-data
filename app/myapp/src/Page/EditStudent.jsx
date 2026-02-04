import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: "",
    email: "",
    age: "",
    course: "React",
    status: "Active",
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/login");
    }

    axios
      .get(`http://localhost:1010/student/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudent(res.data));
  }, [id, navigate, token,role]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:1010/student/students/${id}`,
        student,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Student updated");
      navigate("/students");
    } catch {
      alert("Update failed");
    }
  };

  return (
  <div id="edit-student-container">
  <h2 id="edit-student-title">Edit Student</h2>

  <form id="edit-student-form" onSubmit={handleSubmit}>
    
    <div className="form-group">
      <label htmlFor="edit-student-name">Name:</label>
      <input
        id="edit-student-name"
        name="name"
        value={student.name}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="edit-student-email">Email:</label>
      <input
        id="edit-student-email"
        name="email"
        value={student.email}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="edit-student-age">Age:</label>
      <input
        id="edit-student-age"
        name="age"
        type="number"
        value={student.age}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label htmlFor="edit-student-course">Course:</label>
      <select
        id="edit-student-course"
        name="course"
        value={student.course}
        onChange={handleChange}
      >
        <option value="React">React</option>
        <option value="Node">Node</option>
        <option value="Java">Java</option>
        <option value="Python">Python</option>
      </select>
    </div>

    <div className="form-group">
      <label htmlFor="edit-student-status">Status:</label>
      <select
        id="edit-student-status"
        name="status"
        value={student.status}
        onChange={handleChange}
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>

    <br />

    <button id="update-student-btn" type="submit">Update</button>
    <button
      id="cancel-edit-btn"
      type="button"
      onClick={() => navigate("/students")}
    >
      Cancel
    </button>
  </form>
</div>
//data in built
  );
};

export default EditStudent;
