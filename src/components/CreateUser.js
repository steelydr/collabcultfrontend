import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Checkbox, Button, Typography, Box, FormControlLabel, Grid, Paper, FormControl, FormLabel } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { styled } from '@mui/system';
import swal from 'sweetalert';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

const Background = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #005f73 0%, #0a9396 50%, #94d2bd 100%)', // Adjusted gradient for a more professional look
  padding: '20px',
  boxSizing: 'border-box',
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
    height: 'auto',
  },
  [theme.breakpoints.up('md')]: {
    height: '100vh',
  },
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '600px',
  borderRadius: '12px',
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(255, 255, 255, 0.15)', // Slightly more opaque
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  [theme.breakpoints.down('sm')]: {
    width: '90%',
    padding: theme.spacing(3),
    margin: '50px 0',
  },
  [theme.breakpoints.up('md')]: {
    width: '80%',
    margin: '0',
  },
  [theme.breakpoints.up('lg')]: {
    width: '70%',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    color: '#00000',
  },
  '& .MuiFormLabel-root': {
    color: 'rgba(0, 0, 0, 0.7)',  // Updated to black
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffffff',
    },
  },
}));

const CreateUser = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    address: '',
    profilePictureType: '',
    profilePicture: '',
    active: true,
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:1803';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePhoneChange = (value) => {
    setUserDetails({
      ...userDetails,
      phoneNumber: `+${value}`,
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+\d{1,3}\d{9,14}$/;
    return phoneRegex.test(phoneNumber);
  };

  const checkExistingUsername = async (username) => {
    try {
      const response = await axios.get(`${backendUrl}/api/users/exists?username=${username}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = [];

    // Check if required fields are filled
    const requiredFields = ['username', 'email', 'phoneNumber', 'password', 'confirmPassword', 'firstName', 'lastName'];
    requiredFields.forEach(field => {
      if (!userDetails[field]) {
        newErrors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
      }
    });

    if (userDetails.password !== userDetails.confirmPassword) {
      newErrors.push('Passwords do not match');
    }
    if (!validateEmail(userDetails.email)) {
      newErrors.push('Invalid email format');
    }
    if (!validatePhoneNumber(userDetails.phoneNumber)) {
      newErrors.push('Invalid phone number');
    }

    // Check for existing username
    const usernameExists = await checkExistingUsername(userDetails.username);
    if (usernameExists) {
      newErrors.push('Username already exists');
    }

    if (newErrors.length > 0) {
      newErrors.forEach((error) => {
        swal("Error", error, "error");
      });
      return;
    }

    try {
      await axios.post(`${backendUrl}/api/users`, userDetails);
      swal("Success", "Registration successful!", "success").then(() => {
        navigate('/');
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        const conflictErrors = error.response.data.errors;
        conflictErrors.forEach((error) => {
          swal("Error", error, "error");
        });
      } else {
        swal("Error", "Error creating user", "error");
      }
    }
  };

  return (
    <Background>
      <FormContainer elevation={6}>
        <Typography component="h1" variant="h4" align="center" sx={{ color: '#000', mb: 4 }}>
          Sign-Up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                autoFocus
                value={userDetails.firstName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <AccountCircleOutlinedIcon sx={{ color: '#000', mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={userDetails.lastName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <AccountCircleOutlinedIcon sx={{ color: '#000', mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={userDetails.username}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <PersonAddOutlinedIcon sx={{ color: '#000', mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={userDetails.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <EmailOutlinedIcon sx={{ color: '#000', mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel sx={{ color: '#000', mb: 1 }}>Phone Number</FormLabel>
                <PhoneInput
                  country={'us'}
                  value={userDetails.phoneNumber}
                  onChange={handlePhoneChange}
                  inputStyle={{ width: '100%', backgroundColor: 'transparent', color: '#000' }}
                  containerStyle={{ width: '100%' }}
                  dropdownStyle={{ backgroundColor: '#fff', color: '#000' }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={userDetails.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <LockOutlinedIcon sx={{ color: '#000', mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={userDetails.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <LockOutlinedIcon sx={{ color: '#000', mr: 1 }} />,
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                id="address"
                label="Address"
                name="address"
                autoComplete="address"
                value={userDetails.address}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <FormControlLabel
            control={
              <Checkbox
                checked={userDetails.active}
                onChange={handleChange}
                name="active"
                color="primary"
                sx={{ color: '#000' }}
              />
            }
            label={<Typography sx={{ color: '#000' }}>I hereby declare that the above information provided is true and correct</Typography>}
            sx={{ mt: 2 }}
          />
          <Button
  type="submit"
  fullWidth
  variant="contained"
  sx={{
    mt: 3,
    mb: 2,
    background: 'transparent',
    color: 'black',
    fontWeight: 600,
    fontSize: '1rem',
    textTransform: 'uppercase',
    boxShadow: 'none',
    padding: '12px 0',
    borderRadius: '22px',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(45deg, #0a9396 30%, #005f73 90%)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      color: '#ffffff',
    },
    '&:active': {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
  }}
>
  Register
</Button>
        </Box>
      </FormContainer>
    </Background>
  );
};

export default CreateUser;
