import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserData = () => {
  const navigate = useNavigate();


  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  useEffect(() => {
  
    if (!token || (role !== "admin" && role !== "user")) {
      navigate("/login");
      return;
    }

    fetchUsers();
  }, [token, role, navigate, fetchUsers]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:1010/api/userdata", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔑 CRITICAL LINE (prevents map error)
      setUsers(res.data.users || []);
    } catch (error) {
      console.error(error);
      setUsers([]);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
  <div id="user-data-container">
  <h2 id="user-data-title">User Data</h2>

  <div id="user-info">
    <p>
      Logged in as: <b id="user-email">{email}</b>
    </p>
    <p>
      Role: <b id="user-role">{role}</b>
    </p>
  </div>

  <hr />

  {users.length === 0 ? (
    <p id="no-users-msg">No users found</p>
  ) : (
    <table id="user-data-table" border="1">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          {/* <th>Role</th> */}
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            {/* <td>{user.role}</td> */}
          </tr>
        ))}
      </tbody>
    </table>
  )}

  <br />

  <button id="back-user-btn" onClick={() => navigate(-1)}>Back</button>
</div>

  );
};

export default UserData;
