// src/components/UsersList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL ;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://collabculture-app.azurewebsites.net/api/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [backendUrl]);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${backendUrl}/api/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h1>Users List</h1>
      <Link to="/create">Create New User</Link>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.email}
            <Link to={`/update/${user.id}`}>Edit</Link>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
