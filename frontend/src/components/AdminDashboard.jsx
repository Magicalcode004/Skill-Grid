import React, { useState, useEffect } from 'react';
import './AdminDashboard.css'; 

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/admin/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  
  const handleDelete = async (id) => {
    if (window.confirm("Sure about it...?")) {
      const res = await fetch(`http://localhost:5000/api/admin/user/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert("User successfully deleted!");
        fetchUsers(); 
      }
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Command Center</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Profession</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
  <span className={`role-badge role-${user.role}`}>
    {user.role.toUpperCase()}
  </span>
</td>
              <td>{user.profession || 'N/A'}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;