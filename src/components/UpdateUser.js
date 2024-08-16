import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    firstName: '',
    lastName: '',
    address: '',
    profilePictureType: '',
    profilePicture: '',
    active: true
  });
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:1803';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/users/${id}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendUrl}/api/users/${id}`, userDetails);
      navigate('/');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update User</h2>
      <div>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={userDetails.username}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={userDetails.phoneNumber}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={userDetails.password}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={userDetails.firstName}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={userDetails.lastName}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={userDetails.address}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Profile Picture Type:
          <input
            type="text"
            name="profilePictureType"
            value={userDetails.profilePictureType}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Profile Picture:
          <input
            type="text"
            name="profilePicture"
            value={userDetails.profilePicture}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Active:
          <input
            type="checkbox"
            name="active"
            checked={userDetails.active}
            onChange={(e) => setUserDetails({ ...userDetails, active: e.target.checked })}
          />
        </label>
      </div>
      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateUser;
