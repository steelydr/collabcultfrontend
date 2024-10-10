import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import config from './config';
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const backendUrl = config.BACKEND_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/users`);
        console.log('API Response:', response.data); // Log the response for debugging
        
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else if (typeof response.data === 'object' && response.data !== null) {
          // If the response is an object, it might contain the users array
          const usersArray = response.data.users || Object.values(response.data);
          if (Array.isArray(usersArray)) {
            setUsers(usersArray);
          } else {
            throw new Error('Unable to extract users array from the response');
          }
        } else {
          throw new Error(`Unexpected data format: ${typeof response.data}`);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(`Failed to fetch users: ${error.message}`);
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
      setError(`Failed to delete user: ${error.message}`);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Users List</h1>
      <Link to="/create">Create New User</Link>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.username} - {user.email}
              <Link to={`/update/${user.id}`}>Edit</Link>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersList;