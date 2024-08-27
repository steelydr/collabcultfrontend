import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Checkbox, Typography, Box, Grid, Paper, FormControlLabel } from '@mui/material';
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
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #f0f4f8 0%, #dae2ec 100%)',
  padding: theme.spacing(2),
  boxSizing: 'border-box',
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '600px',
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e0e0e0',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    margin: '20px 0',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    color: '#333333',
  },
  '& .MuiFormLabel-root': {
    color: '#555555',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#cccccc',
    },
    '&:hover fieldset': {
      borderColor: '#247BBE',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#247BBE',
    },
  },
}));

const StyledPhoneInput = styled(PhoneInput)(({ theme }) => ({
  '& .form-control': {
    width: '100%',
    height: '56px',
    fontSize: '1rem',
    borderColor: '#cccccc',
    '&:hover, &:focus': {
      borderColor: '#247BBE',
    },
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
  backgroundColor: '#222',
  border: 'none',
  color: '#fff',
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
    backgroundColor: '#90feb5',
    color: '#fff',
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
  backgroundColor: '#222',
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
    active: true,
  });

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
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users`, userDetails);
      swal("Success", "Registration successful!", "success").then(() => {
        navigate('/');
      });
    } catch (error) {
      swal("Error", "Error creating user", "error");
    }
  };

  return (
    <Background>
      <SVGFilter />
      <FormContainer elevation={6}>
        <Typography component="h1" variant="h4" align="center" sx={{ color: '#247BBE', mb: 4, fontWeight: 'bold' }}>
          Sign-Up
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
                InputProps={{
                  startAdornment: <AccountCircleOutlinedIcon sx={{ color: '#247BBE', mr: 1 }} />,
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
                  startAdornment: <PersonAddOutlinedIcon sx={{ color: '#247BBE', mr: 1 }} />,
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
                InputProps={{
                  startAdornment: <EmailOutlinedIcon sx={{ color: '#247BBE', mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledPhoneInput
                country={'us'}
                value={userDetails.phoneNumber}
                onChange={handlePhoneChange}
                inputStyle={{ width: '100%' }}
              />
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
                InputProps={{
                  startAdornment: <LockOutlinedIcon sx={{ color: '#247BBE', mr: 1 }} />,
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
                  startAdornment: <LockOutlinedIcon sx={{ color: '#247BBE', mr: 1 }} />,
                }}
              />
            </Grid>
          </Grid>
          <FormControlLabel
            control={
              <Checkbox
                checked={userDetails.active}
                onChange={handleChange}
                name="active"
                sx={{
                  color: '#247BBE',
                  '&.Mui-checked': {
                    color: '#247BBE',
                  },
                }}
              />
            }
            label={<Typography sx={{ color: '#333333' }}>I hereby declare that the above information provided is true and correct</Typography>}
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