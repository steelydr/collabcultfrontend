import React, { useEffect, useRef, useReducer, useCallback } from 'react';
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
import CryptoJS from 'crypto-js';
import config,{ SECRET_KEY } from './config';
import ShapesBackground from './ShapesBackground';
document.body.style.backgroundColor = '#000000';
document.body.style.overflowX = 'hidden';
document.documentElement.style.overflowX = 'hidden';

const Background = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  paddingTop: theme.spacing(4),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  background: '#000000',
  boxSizing: 'border-box',
  perspective: '1000px',
}));

const FormContainer = styled(Paper)(({ theme, isFlipped }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '600px',
  borderRadius: '12px',
  backgroundColor: '#000000',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  boxSizing: 'border-box',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(),
    margin: '10px 10px',
  },
  transformStyle: 'preserve-3d',
  transform: isFlipped ? 'rotateY(180deg)' : 'none',
  transition: 'transform 0.8s',
  position: 'relative',
}));

const FormSide = styled(Box)(({ isBack }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  transform: isBack ? 'rotateY(180deg)' : 'none',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    color: '#ffffff',
  },
  '& .MuiFormLabel-root': {
    color: '#ffffff',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ffffff',
    },
    '&:hover fieldset': {
      borderColor: '#21CBF3',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#21CBF3',
    },
  },
}));

const StyledPhoneInput = styled(PhoneInput)(({ theme }) => ({
  '& .form-control': {
    width: '100%',
    height: '56px',
    fontSize: '1rem',
    color: '#ffffff',
    backgroundColor: '#000000',
    border: '1px solid #ffffff',
    paddingLeft: '40px',
    '&:hover, &:focus': {
      borderColor: '#21CBF3',
    },
    '&::placeholder': {
      color: '#ffffff',
    },
  },
  '& .flag-dropdown': {
    backgroundColor: '00000000',
    border: 'none',
  },
  '& .country-list': {
    backgroundColor: '#000000',
    color: '#ffffff',
  },
  '& .selected-flag': {
    backgroundColor: 'transparent',
  },
  '& .country': {
    color: '#ffffff',
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

const initialState = {
  name: '',
  username: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  address: '',
  gender: '',
  active: true,
  isFlipped: false,
  errors: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
      };
    case 'SET_IS_FLIPPED':
      return {
        ...state,
        isFlipped: action.isFlipped,
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

const CreateUser = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const buttonRef = useRef(null);
  const topLeftCirclesRef = useRef([]);
  const bottomRightCirclesRef = useRef([]);

  const validate = useCallback(() => {
    let tempErrors = {};

    if (!state.name) tempErrors.name = "Name is required";
    if (!state.username) {
      tempErrors.username = "Username is required";
    } else if (/^\S+@\S+\.\S+$/.test(state.username)) {
      tempErrors.username = "Username should not be an email";
    }
    if (!state.email) {
      tempErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(state.email)) {
      tempErrors.email = "Invalid email format";
    }
    if (!state.password) tempErrors.password = "Password is required";
    if (state.password !== state.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    if (!state.gender) tempErrors.gender = "Gender is required";

    dispatch({ type: 'SET_ERRORS', errors: tempErrors });

    return Object.keys(tempErrors).length === 0;
  }, [state.name, state.username, state.email, state.password, state.confirmPassword, state.gender]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    dispatch({
      type: 'SET_FIELD_VALUE',
      field: name,
      value: type === 'checkbox' ? checked : value,
    });
  }, []);

  const handlePhoneChange = useCallback((value) => {
    dispatch({
      type: 'SET_FIELD_VALUE',
      field: 'phoneNumber',
      value,
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
  
    if (!validate()) return;
  
    const payload = {
      username: state.username,
      email: state.email,
      phoneNumber: state.phoneNumber,
      password: state.password,
      name: state.name,
      gender: state.gender,
      address: state.address,
      profilePictureType: '',
      profilePicture: '',
      headline: '',
      summary: '',
      active: state.active,
    };
  
    try {
      await axios.post(`${config.BACKEND_URL}/api/users`,  payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      swal("Success", "Registration successful!", "success").then(() => {
        navigate('/cc');
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        dispatch({
          type: 'SET_ERRORS',
          errors: { ...state.errors, username: "Username already exists" },
        });
        swal("Error", "Username already exists. Please choose a different one.", "error");
      } else {
        swal("Error", "Error creating user", "error");
      }
    }
  }, [validate, state.username, state.email, state.phoneNumber, state.password, state.name, state.gender, state.address, state.active, state.errors, navigate]);

  const handleLoginSubmit = useCallback(async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.get(`${config.BACKEND_URL}/api/users`, {
        headers: {
          'Accept': 'application/json',
        },
      });
  
      const users = response.data.users;
      const user = users.find(u => u.username === state.username && u.password === state.password);
  
      if (user) {
        const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(user), SECRET_KEY).toString();
        localStorage.setItem('user', encryptedUser);
  
        swal("Success", "Login successful!", "success").then(() => {
          navigate(`/cc`);
        });
      } else {
        swal("Error", "Login failed. Please check your credentials.", "error");
      }
    } catch (error) {
      swal("Error", "Error fetching user data", "error");
    }
  }, [state.username, state.password, navigate]);

  useEffect(() => {
    const button = buttonRef.current;
    const topLeftCircles = topLeftCirclesRef.current;
    const bottomRightCircles = bottomRightCirclesRef.current;

    const tl = gsap.timeline({ paused: true });

    tl.to(topLeftCircles, { duration: 1.2, x: -25, y: -25, scaleY: 2, ease: "slow(0.1, 0.7, false)" });
    tl.to(topLeftCircles[0], { duration: 0.1, scale: 0.2, x: '+=6', y: '-=2' });
    tl.to(topLeftCircles[1], { duration: 0.1, scaleX: 1, scaleY: 0.8, x: '-=10', y: '-=7' }, '-=0.1');
    tl.to(topLeftCircles[2], { duration: 0.1, scale: 0.2, x: '-=15', y: '+=6' }, '-=0.1');
    tl.to(topLeftCircles[0], { duration: 1, scale: 0, x: '-=5', y: '-=15', opacity: 0 });
    tl.to(topLeftCircles[1], { duration: 1, scaleX: 0.4, scaleY: 0.4, x: '-=10', y: '-=10', opacity: 0 }, '-=1');
    tl.to(topLeftCircles[2], { duration: 1, scale: 0, x: '-=15', y: '+=5', opacity: 0 }, '-=1');

    tl.to(bottomRightCircles, { duration: 1.1, x: 30, y: 30, ease: "slow(0.1, 0.7, false)" }, 0);
    tl.to(bottomRightCircles[0], { duration: 0.1, scale: 0.2, x: '-=6', y: '+=3' });
    tl.to(bottomRightCircles[1], { duration: 0.1, scale: 0.8, x: '+=7', y: '+=3' }, '-=0.1');
    tl.to(bottomRightCircles[2], { duration: 0.1, scale: 0.2, x: '+=15', y: '-=6' }, '-=0.2');
    tl.to(bottomRightCircles[0], { duration: 1, scale: 0, x: '+=5', y: '+=15', opacity: 0 });
    tl.to(bottomRightCircles[1], { duration: 1, scale: 0.4, x: '+=7', y: '+=7', opacity: 0 }, '-=1');
    tl.to(bottomRightCircles[2], { duration: 1, scale: 0, x: '+=15', y: '-=5', opacity: 0 }, '-=1');

    tl.to(button, { duration: 0.8, scaleY: 1.1 }, 0.1);
    tl.to(button, { duration: 1.8, scale: 1, ease: "elastic.out(1.2, 0.4)" }, 1.2);

    tl.timeScale(2.6);

    const handleMouseEnter = () => {
      tl.restart();
    };

    button.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <Background>
      <ShapesBackground />
      <SVGFilter />
      <FormContainer isFlipped={state.isFlipped} elevation={6}>
        <FormSide>
          <Typography component="h1" variant="h4" align="center" sx={{ color: '#ffff', mb: 4, fontWeight: 'bold' ,backgroundColor:'transparent'}}>
            SIGN-UP
          </Typography>
          <img 
  src="https://collabcultimages.blob.core.windows.net/logo/whitelogo.png?sp=r&st=2024-08-27T14:33:14Z&se=2030-08-27T22:33:14Z&sv=2022-11-02&sr=b&sig=%2Bs5heSUazhVROgtN4Pz2EhGlGUdYS5ULxkMb0h9fpgY%3D" 
  alt="Logo" 
  style={{ display: 'block', margin: '0 auto 20px', height: '50px',width:'50px', paddingBottom:'10px' }} 
/>
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
                  value={state.name}
                  onChange={handleChange}
                  error={!!state.errors.name}
                  helperText={state.errors.name}
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
                  value={state.username}
                  onChange={handleChange}
                  error={!!state.errors.username}
                  helperText={state.errors.username}
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
                  value={state.email}
                  onChange={handleChange}
                  error={!!state.errors.email}
                  helperText={state.errors.email}
                  InputProps={{
                    startAdornment: <EmailOutlinedIcon sx={{ color: '#21CBF3', mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledPhoneInput
                  country={'us'}
                  value={state.phoneNumber}
                  onChange={handlePhoneChange}
                  inputStyle={{ width: '100%', backgroundColor: 'black' }}
                  isValid={(value, country) => value.length === 9}
                  inputProps={{
                    error: state.errors.phoneNumber ? true : undefined,
                  }}
                />
                {state.errors.phoneNumber && (
                  <Typography variant="caption" color="error" display="block" gutterBottom>
                    {state.errors.phoneNumber}
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
                  value={state.password}
                  onChange={handleChange}
                  error={!!state.errors.password}
                  helperText={state.errors.password}
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
                  value={state.confirmPassword}
                  onChange={handleChange}
                  error={!!state.errors.confirmPassword}
                  helperText={state.errors.confirmPassword}
                  InputProps={{
                    startAdornment: <LockOutlinedIcon sx={{ color: '#21CBF3', mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" error={!!state.errors.gender}>
                  <FormLabel component="legend" sx={{ color: '#ffffff' }}>Gender</FormLabel>
                  <RadioGroup
                    aria-label="gender"
                    name="gender"
                    value={state.gender}
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
                  {state.errors.gender && (
                    <Typography variant="caption" color="error" display="block" gutterBottom>
                      {state.errors.gender}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.active}
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
            <Typography
              variant="body2"
              align="center"
              sx={{ color: '#21CBF3', mt: 2, cursor: 'pointer' }}
              onClick={() => dispatch({ type: 'SET_IS_FLIPPED', isFlipped: true })}
            >
              Already Signed In? Click here to login.
            </Typography>
          </Box>
        </FormSide>
        
        <FormSide isBack>
          <Typography component="h1" variant="h4" align="center" sx={{ color: '#ffff', mb: 4, fontWeight: 'bold',paddingTop:'40px' }}>
            LOG IN
          </Typography>
          <img 
  src="https://collabcultimages.blob.core.windows.net/logo/whitelogo.png?sp=r&st=2024-08-27T14:33:14Z&se=2030-08-27T22:33:14Z&sv=2022-11-02&sr=b&sig=%2Bs5heSUazhVROgtN4Pz2EhGlGUdYS5ULxkMb0h9fpgY%3D" 
  alt="Logo" 
  style={{ display: 'block', margin: '0 auto 20px', height: '50px',width:'50px' }} 
/>
          <Box component="form" noValidate onSubmit={handleLoginSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StyledTextField
                  required
                  fullWidth
                  id="loginUsername"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={state.username}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <PersonAddOutlinedIcon sx={{ color: '#21CBF3', mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="loginPassword"
                  value={state.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <LockOutlinedIcon sx={{ color: '#21CBF3', mr: 1 }} />,
                  }}
                />
              </Grid>
            </Grid>
            <BubbleButtonContainer>
              <BubbleButton ref={buttonRef} type="submit" sx={{marginTop:'20px' }}>
                Login
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
            <Typography
              variant="body2"
              align="center"
              sx={{ color: '#21CBF3', mt: 2, cursor: 'pointer' }}
              onClick={() => dispatch({ type: 'SET_IS_FLIPPED', isFlipped: false })}
            >
              New here? Click here to register.
            </Typography>
          </Box>
        </FormSide>
      </FormContainer>
    </Background>
  );
};

export default CreateUser;
