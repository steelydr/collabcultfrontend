import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Checkbox, Typography, Box, Grid, Paper, FormControlLabel, FormControl, RadioGroup, FormLabel, Radio } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { styled } from '@mui/system';
import swal from 'sweetalert';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import { gsap } from 'gsap';

const Background = styled(Box)(({ theme }) => ({
  minHeight: '110vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#000000', // Background is black
  padding: theme.spacing(2),
  boxSizing: 'border-box',
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '600px',
  borderRadius: '12px',
  backgroundColor: '#000000', // Card background is black
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)', // Slightly darkened shadow
  border: '1px solid #333333', // Darker border for contrast
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    margin: '20px 0',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    color: '#ffffff', // White text
  },
  '& .MuiFormLabel-root': {
    color: '#ffffff', // White label
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ffffff', // White border
    },
    '&:hover fieldset': {
      borderColor: '#21CBF3', // Blue on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#21CBF3', // Blue on focus
    },
  },
}));

const StyledPhoneInput = styled(PhoneInput)(({ theme }) => ({
  '& .form-control': {
    width: '100%',
    height: '56px',
    fontSize: '1rem',
    color: '#ffffff', // White text
    backgroundColor: '#000000', // Transparent background
    border: '1px solid #ffffff', // White border
    paddingLeft: '40px', // Adjusting padding to align with other inputs
    '&:hover, &:focus': {
      borderColor: '#21CBF3', // Blue on hover and focus
    },
    '&::placeholder': {
      color: '#ffffff', // White placeholder text
    },
  },
  '& .flag-dropdown': {
    backgroundColor: '00000000', // Transparent background for flag dropdown
    border: 'none', // Remove border for dropdown
  },
  '& .country-list': {
    backgroundColor: '#000000', // Match dropdown background to other inputs
    color: '#ffffff', // White text in dropdown
  },
  '& .selected-flag': {
    backgroundColor: 'transparent', // Transparent background for selected flag
  },
  '& .country': {
    color: '#ffffff', // White text for country names
  },
}));


const BubbleButtonContainer = styled('div')({
  position: 'relative',
  display: 'inline-block',
  width: '100%',
});

const BubbleButton = styled('button')({
  position: 'relative',
  zIndex: 2,
  backgroundColor: '#000000',
  border: 'none',
  color: '#21CBF3',
  display: 'inline-block',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '14px',
  fontWeight: 100,
  textDecoration: 'none',
  userSelect: 'none',
  letterSpacing: '1px',
  padding: '20px 40px',
  textTransform: 'uppercase',
  transition: 'all 0.1s ease-out',
  width: '100%',
  '&:hover': {
    backgroundColor: '#21CBF3',
    color: '#000000',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
});

const BubbleEffectContainer = styled('span')({
  position: 'absolute',
  display: 'block',
  width: '200%',
  height: '400%',
  top: '-150%',
  left: '-50%',
  pointerEvents: 'none',
  zIndex: 1,
});

const Circle = styled('span')({
  position: 'absolute',
  width: '25px',
  height: '25px',
  borderRadius: '15px',
  backgroundColor: '#21CBF3',
  transition: 'background 0.1s ease-out',
});

const TopLeftCircle = styled(Circle)({
  top: '40%',
  left: '27%',
});

const BottomRightCircle = styled(Circle)({
  bottom: '40%',
  right: '27%',
});

const SVGFilter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ position: 'absolute', visibility: 'hidden', width: '1px', height: '1px' }}>
    <defs>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
        <feComposite in="SourceGraphic" in2="goo"/>
      </filter>
    </defs>
  </svg>
);

const CreateUser = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = React.useState({
    name: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    gender: '',
    active: true,
  });
  const [errors, setErrors] = React.useState({});
  const buttonRef = useRef(null);
  const topLeftCirclesRef = useRef([]);
  const bottomRightCirclesRef = useRef([]);

  useEffect(() => {
    const button = buttonRef.current;
    const topLeftCircles = topLeftCirclesRef.current;
    const bottomRightCircles = bottomRightCirclesRef.current;

    const createAnimation = () => {
      const tl = gsap.timeline({ paused: true });
      
      // Top-left circles animation
      tl.to(topLeftCircles, { duration: 1.2, x: -25, y: -25, scaleY: 2, ease: "slow(0.1, 0.7, false)" });
      tl.to(topLeftCircles[0], { duration: 0.1, scale: 0.2, x: '+=6', y: '-=2' });
      tl.to(topLeftCircles[1], { duration: 0.1, scaleX: 1, scaleY: 0.8, x: '-=10', y: '-=7' }, '-=0.1');
      tl.to(topLeftCircles[2], { duration: 0.1, scale: 0.2, x: '-=15', y: '+=6' }, '-=0.1');
      tl.to(topLeftCircles[0], { duration: 1, scale: 0, x: '-=5', y: '-=15', opacity: 0 });
      tl.to(topLeftCircles[1], { duration: 1, scaleX: 0.4, scaleY: 0.4, x: '-=10', y: '-=10', opacity: 0 }, '-=1');
      tl.to(topLeftCircles[2], { duration: 1, scale: 0, x: '-=15', y: '+=5', opacity: 0 }, '-=1');

      // Bottom-right circles animation
      tl.to(bottomRightCircles, { duration: 1.1, x: 30, y: 30, ease: "slow(0.1, 0.7, false)" }, 0);
      tl.to(bottomRightCircles[0], { duration: 0.1, scale: 0.2, x: '-=6', y: '+=3' });
      tl.to(bottomRightCircles[1], { duration: 0.1, scale: 0.8, x: '+=7', y: '+=3' }, '-=0.1');
      tl.to(bottomRightCircles[2], { duration: 0.1, scale: 0.2, x: '+=15', y: '-=6' }, '-=0.2');
      tl.to(bottomRightCircles[0], { duration: 1, scale: 0, x: '+=5', y: '+=15', opacity: 0 });
      tl.to(bottomRightCircles[1], { duration: 1, scale: 0.4, x: '+=7', y: '+=7', opacity: 0 }, '-=1');
      tl.to(bottomRightCircles[2], { duration: 1, scale: 0, x: '+=15', y: '-=5', opacity: 0 }, '-=1');

      // Button animation
      tl.to(button, { duration: 0.8, scaleY: 1.1 }, 0.1);
      tl.to(button, { duration: 1.8, scale: 1, ease: "elastic.out(1.2, 0.4)" }, 1.2);

      tl.timeScale(2.6);

      return tl;
    };

    const animation = createAnimation();

    const handleMouseEnter = () => {
      animation.restart();
    };

    button.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  const validate = () => {
    let tempErrors = {};

    if (!userDetails.name) tempErrors.name = "Name is required";
    if (!userDetails.username) {
      tempErrors.username = "Username is required";
    } else if (/^\S+@\S+\.\S+$/.test(userDetails.username)) {
      tempErrors.username = "Username should not be an email";
    }
    if (!userDetails.email) {
      tempErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(userDetails.email)) {
      tempErrors.email = "Invalid email format";
    }
    if (!userDetails.phoneNumber || userDetails.phoneNumber.length !== 9) {
      tempErrors.phoneNumber = "Phone number must be exactly 9 digits";
    }
    if (!userDetails.password) tempErrors.password = "Password is required";
    if (userDetails.password !== userDetails.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    if (!userDetails.gender) tempErrors.gender = "Gender is required";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhoneChange = (value) => {
    setUserDetails(prev => ({
      ...prev,
      phoneNumber: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Constructing the payload to match the API structure
    const payload = {
      username: userDetails.username,
      email: userDetails.email,
      phoneNumber: userDetails.phoneNumber,
      password: userDetails.password,
      name: userDetails.name,
      gender: userDetails.gender,
      address: userDetails.address,
      profilePictureType: '', // Assuming a default type, adjust if necessary
      profilePicture: '', // Placeholder, adjust if you have an actual picture to send
      headline: '', // Example headline, adjust as needed
      summary: '', // Example summary, adjust as needed
      active: userDetails.active
    };

    try {
      await axios.post(`https://collabculture-app.azurewebsites.net/api/users`, payload, {
        headers: {
          'Content-Type': 'application/json', // Ensure JSON is sent
        },
      });

      // Handle success response
      swal("Success", "Registration successful!", "success").then(() => {
        navigate('/');
      });
    } catch (error) {
      // Handle error response
      swal("Error", "Error creating user", "error");
    }
  };

  return (
    <Background>
      <SVGFilter />
      <FormContainer elevation={6}>
        <Typography component="h1" variant="h4" align="center" sx={{ color: '#ffff', mb: 4, fontWeight: 'bold' }}>
          SIGN-UP
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                value={userDetails.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: <AccountCircleOutlinedIcon sx={{ color: '#21CBF3', mr: 1 }} />,
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
                error={!!errors.username}
                helperText={errors.username}
                InputProps={{
                  startAdornment: <PersonAddOutlinedIcon sx={{ color: '#21CBF3', mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={userDetails.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: <EmailOutlinedIcon sx={{ color: '#21CBF3', mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledPhoneInput
                country={'us'}
                value={userDetails.phoneNumber}
                onChange={handlePhoneChange}
                inputStyle={{ width: '100%',backgroundColor:'black' }}
                isValid={(value, country) => value.length === 9}
                inputProps={{ error: !!errors.phoneNumber }}
              />
              {errors.phoneNumber && (
                <Typography variant="caption" color="error" display="block" gutterBottom>
                  {errors.phoneNumber}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={userDetails.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: <LockOutlinedIcon sx={{ color: '#21CBF3', mr: 1 }} />,
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
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: <LockOutlinedIcon sx={{ color: '#21CBF3', mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" error={!!errors.gender}>
                <FormLabel component="legend" sx={{ color: '#ffffff' }}>Gender</FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="gender"
                  value={userDetails.gender}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel
  value="male"
  control={<Radio sx={{ color: '#21CBF3' }} />}
  label="Male"
  sx={{ color: 'white' }}
/>
<FormControlLabel
  value="female"
  control={<Radio sx={{ color: '#21CBF3' }} />}
  label="Female"
  sx={{ color: 'white' }}
/>

                </RadioGroup>
                {errors.gender && (
                  <Typography variant="caption" color="error" display="block" gutterBottom>
                    {errors.gender}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <FormControlLabel
            control={
              <Checkbox
                checked={userDetails.active}
                onChange={handleChange}
                name="active"
                sx={{
                  color: '#21CBF3',
                  '&.Mui-checked': {
                    color: '#21CBF3',
                  },
                }}
              />
            }
            label={<Typography sx={{ color: '#ffffff' }}>I hereby declare that the above information provided is true and correct</Typography>}
            sx={{ mt: 2, mb: 2 }}
          />
          <BubbleButtonContainer>
            <BubbleButton ref={buttonRef} type="submit">
              Register
            </BubbleButton>
            <BubbleEffectContainer style={{ filter: 'url(#goo)' }}>
              {[...Array(3)].map((_, i) => (
                <TopLeftCircle key={`tl-${i}`} ref={el => topLeftCirclesRef.current[i] = el} />
              ))}
              {[...Array(3)].map((_, i) => (
                <BottomRightCircle key={`br-${i}`} ref={el => bottomRightCirclesRef.current[i] = el} />
              ))}
            </BubbleEffectContainer>
          </BubbleButtonContainer>
        </Box>
      </FormContainer>
    </Background>
  );
};

export default CreateUser;
