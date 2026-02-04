import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const limit = 5;

  useEffect(() => {
    fetchStudents();
  }, [page, search]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:1010/student/students?search=${search}&page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(res.data.students || []);
      setPages(res.data.pages);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await axios.delete(`http://localhost:1010/student/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Student deleted successfully");
      fetchStudents(); // refresh list
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  return (
   <div id="student-list-container">
  <h2 id="student-list-title">Student List</h2>

  {/* Search */}
  <div id="student-search">
    <input
      id="student-search-input"
      type="text"
      placeholder="Search by name or email"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <button
      id="student-search-btn"
      onClick={() => { setPage(1); fetchStudents(); }}
    >
      Search
    </button>
  </div>

  {loading ? (
    <p id="student-loading">Loading...</p>
  ) : students.length === 0 ? (
    <p id="student-no-data">No students found</p>
  ) : (
    <table id="student-table" border="1">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Age</th>
          <th>Course</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s._id}>
            <td>{s.name}</td>
            <td>{s.email}</td>
            <td>{s.age}</td>
            <td>{s.course}</td>
            <td>{s.status}</td>
            <td>
              <button
                id={`view-btn-${s._id}`}
                onClick={() => navigate(`/students/${s._id}`)}
              >
                View
              </button>
              <button
                id={`edit-btn-${s._id}`}
                onClick={() => navigate(`/students/edit/${s._id}`)}
              >
                Edit
              </button>
              <button
                id={`delete-btn-${s._id}`}
                onClick={() => handleDelete(s._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}

  {/* Pagination */}
  <div id="student-pagination" style={{ marginTop: "10px" }}>
    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
      <button
        key={p}
        onClick={() => setPage(p)}
        disabled={p === page}
        className={p === page ? "active-page" : ""}
      >
        {p}
      </button>
    ))}
  </div>
</div>

  );
};

export default StudentList;
