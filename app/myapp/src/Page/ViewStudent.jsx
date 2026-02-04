import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ViewStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");

    axios
      .get(`http://localhost:1010/student/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudent(res.data))
      .catch(() => alert("Student not found"));
  }, []);

  if (!student) return <p>Loading...</p>;

  return (
   <div id="view-student-container">
  <h2 id="view-student-title">Student Details</h2>

  <div className="view-student-info">
    <p><b>Name:</b> <span id="view-student-name">{student.name}</span></p>
    <p><b>Email:</b> <span id="view-student-email">{student.email}</span></p>
    <p><b>Age:</b> <span id="view-student-age">{student.age}</span></p>
    <p><b>Course:</b> <span id="view-student-course">{student.course}</span></p>
    <p><b>Status:</b> <span id="view-student-status">{student.status}</span></p>
  </div>

  <button id="back-student-btn" onClick={() => navigate("/students")}>Back</button>
</div>

  );
};

export default ViewStudent;
