import React, { useState, useEffect } from 'react';
import { Drawer, IconButton, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaTimes } from "react-icons/fa";
import { PiSignOut } from "react-icons/pi";
import CryptoJS from 'crypto-js';
import config,{ SECRET_KEY } from './config'; // Make sure SECRET_KEY is defined in your config file
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserDrawer = ({ open, onClose, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const encryptedData = localStorage.getItem('user');
      if (encryptedData) {
        try {
          // Decrypt the data from localStorage
          const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          const userId = decryptedData.id; // Get userId from decrypted data
          console.log(userId);
          
          // Fetch real-time data from the backend
          const response = await axios.get(`${config.BACKEND_URL}/api/users/${userId}`);
          const user = response.data.user; // Assuming 'user' is the key for user data
          setUserData(user); // Set the user data to state
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserData(null);
    onLogout();
  };

  const navigateToLogin = () => {
    navigate('/register');
    onClose();
  };

  return (
    <StyledDrawer anchor="right" open={open} onClose={onClose}>
      <DrawerHeader>
        <IconButton onClick={onClose} sx={{ padding: 1 }}>
          <FaTimes style={{ color: 'white', fontSize: '20px' }} />
        </IconButton>
      </DrawerHeader>
      {userData ? (
        <DrawerContent>
          <Typography variant="h4" sx={{ mb: 2, color: 'white', fontWeight: 300 }}>
            Your Profile
          </Typography>

          {/* Profile Picture Display */}
          <ProfilePicture 
            src={userData.profilePictureType} // Assuming profilePictureType is a URL
            alt={userData.name} 
          />

          <UserInfoContainer>
            <UserInfoItem>
              <StyledPrimaryText>Name</StyledPrimaryText>
              <StyledSecondaryText>{userData.name}</StyledSecondaryText>
            </UserInfoItem>
            <UserInfoItem>
              <StyledPrimaryText>Username</StyledPrimaryText>
              <StyledSecondaryText>{userData.username}</StyledSecondaryText>
            </UserInfoItem>
            <UserInfoItem>
              <StyledPrimaryText>Gender</StyledPrimaryText>
              <StyledSecondaryText>{userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 'Not available'}</StyledSecondaryText>
            </UserInfoItem>
            {userData.email && (
              <UserInfoItem>
                <StyledPrimaryText>Email</StyledPrimaryText>
                <StyledSecondaryText>{userData.email}</StyledSecondaryText>
              </UserInfoItem>
            )}
          </UserInfoContainer>

          <LogoutButton
            variant="contained"
            onClick={handleLogout}
          >
            <PiSignOut style={{ marginRight: '12px', fontSize: '22px' }} /> 
            Logout
          </LogoutButton>
        </DrawerContent>
      ) : (
        <DrawerContent>
          <Typography variant="h4" sx={{ mb: 2, color: 'white', fontWeight: 300 }}>
            Welcome!
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'white' }}>
            Please register or sign in to access your profile.
          </Typography>
          <ActionButton
            variant="outlined"
            onClick={navigateToLogin}
            sx={{ mt: 2 }}
          >
            Sign In
          </ActionButton>
        </DrawerContent>
      )}
    </StyledDrawer>
  );
};

// Styled Components
const StyledDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    backgroundColor: 'black', 
    width: '300px', 
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '100%',
    overflowY: 'auto',
  },
});

const DrawerHeader = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '24px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
});

const DrawerContent = styled('div')({
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '40px 32px',
  flexGrow: 1,
  userSelect: 'none',
});

// Profile Picture Styled Component
const ProfilePicture = styled('img')({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  objectFit: 'cover', // Ensures the image is not distorted
  marginBottom: '24px',
  border: '3px solid #FFFFFF',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
});

const UserInfoContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  width: '100%',
  marginBottom: '40px',
});

const UserInfoItem = styled('div')({
  marginBottom: '24px',
  textAlign: 'left',
});

const StyledPrimaryText = styled(Typography)({
  fontSize: '14px',
  fontWeight: '500',
  color: 'rgba(255, 255, 255, 0.6)',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '4px',
});

const StyledSecondaryText = styled(Typography)({
  fontSize: '18px',
  color: 'white',
  fontWeight: '500',
  lineHeight: '1.4',
});

const LogoutButton = styled(Button)({
    marginTop: 'auto',
    backgroundColor: 'transparent',
    color: 'white',
    textTransform: 'none',
    fontWeight: 'bold',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '14px 0',
    fontSize: '16px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    boxShadow: 'none', // Ensure no box shadow initially
    '&:hover': {
      backgroundColor: 'transparent', // Ensure no background change on hover
      boxShadow: 'none', // Remove any box shadow on hover
    },
  });
  

const ActionButton = styled(Button)({
  width: '100%',
  padding: '12px 0',
  fontSize: '16px',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  '&.MuiButton-contained': {
    backgroundColor: '#21CBF3', // Bright cyan
    color: '#000000', // Black
    '&:hover': {
      backgroundColor: '#1DB8DD', // Slightly darker shade for hover
    },
  },
  '&.MuiButton-outlined': {
    borderColor: '#21CBF3', // Bright cyan
    color: '#21CBF3', // Bright cyan
    '&:hover': {
      backgroundColor: 'rgba(33, 203, 243, 0.1)', // Updated hover color
    },
  },
});

export default UserDrawer;
