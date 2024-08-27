// src/components/HeroSection.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const HeroSectionContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#000000',
  position: 'relative',
  overflow: 'hidden',
  color: '#FFFFFF',
  padding: '0 20px', // Add padding for responsive spacing
}));

const HeroContent = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  zIndex: 1,
  maxWidth: '800px', // Limit the width for better alignment
  margin: '0 auto', // Center the content
}));

const AnimatedBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    borderRadius: '50%',
    opacity: 0.45,
    animation: 'float 25s infinite ease-in-out',
  },
  '&::before': {
    width: '400px',
    height: '400px',
    background: 'rgba(79, 195, 247, 0.3)',
    top: '-50px',
    left: '-50px',
  },
  '&::after': {
    width: '400px',
    height: '400px',
    background: 'rgba(25, 118, 210, 0.3)',
    bottom: '-50px',
    right: '-50px',
    animationDelay: '-15s',
  },
  '& .triangle': {
    width: 0,
    height: 0,
    borderLeft: '100px solid transparent',
    borderRight: '100px solid transparent',
    borderBottom: '170px solid rgba(1, 77, 78, 0.6)',
    position: 'absolute',
    top: '5%',
    left: '80%',
    opacity: 0.55,
    animation: 'float 20s infinite ease-in-out',
    animationDelay: '-5s',
  },
  '& .circle': {
    width: '150px',
    height: '150px',
    background: 'rgba(34, 139, 34, 0.4)',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '30%',
    opacity: 0.46,
    animation: 'float 15s infinite ease-in-out',
    animationDelay: '-10s',
  },
  // Media Queries for responsiveness
  [theme.breakpoints.down('md')]: {
    '&::before': {
      width: '300px',
      height: '300px',
    },
    '&::after': {
      width: '300px',
      height: '300px',
    },
    '& .triangle': {
      borderLeft: '75px solid transparent',
      borderRight: '75px solid transparent',
      borderBottom: '130px solid rgba(1, 77, 78, 0.6)',
    },
    '& .circle': {
      width: '100px',
      height: '100px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '&::before': {
      width: '200px',
      height: '200px',
    },
    '&::after': {
      width: '200px',
      height: '200px',
    },
    '& .triangle': {
      borderLeft: '50px solid transparent',
      borderRight: '50px solid transparent',
      borderBottom: '100px solid rgba(1, 77, 78, 0.6)',
      top: '10%',
      left: '70%',
    },
    '& .circle': {
      width: '80px',
      height: '80px',
      top: '60%',
      left: '25%',
    },
  },
}));

const AnimatedText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '1px',
  position: 'relative',
  display: 'inline-block',
  color: '#21CBF3',
  fontSize: '4rem', // Increased font size for emphasis
  animation: 'fadeIn 3s ease-in-out',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-10px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px', // Rounded button for a modern look
  padding: '12px 36px', // Slightly larger padding for a professional feel
  fontSize: '1rem',
  textTransform: 'none',
  color: '#FFFFFF',
  border: '2px solid #21CBF3',
  backgroundColor: '#014D4E', // Professional dark teal background
  transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
  '&:hover': {
    backgroundColor: '#21CBF3',
    color: '#000000',
    transform: 'translateY(-3px)', // Slight lift effect on hover
    boxShadow: '0px 12px 20px rgba(0, 0, 0, 0.15)', // More pronounced shadow on hover
  },
}));

const HeroSection = () => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate('/register');
  };

  return (
    <HeroSectionContainer>
      <AnimatedBackground>
        <Box className="triangle" />
        <Box className="circle" />
      </AnimatedBackground>
      <HeroContent>
        <AnimatedText variant="h2" component="h1" gutterBottom>
          Connect Create Conquer
        </AnimatedText>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          sx={{ 
            mb: 4, 
            fontWeight: 600, 
            fontSize: '1.5rem', 
            lineHeight: 1.5, 
            color: '#013c3c' // Deep Teal for emphasis
          }}
        >
          Break free from routine. Pursue your passions. Collaborate with like-minded individuals.
        </Typography>

        <Typography 
          variant="body1" 
          component="h2" 
          gutterBottom 
          sx={{ 
            mb: 4, 
            fontWeight: 300, 
            fontSize: '1.1rem', 
            lineHeight: 1.6, 
            color: '#f1f1f1' // Charcoal Gray for secondary text
          }}
        >
          Stay Connected with us for more updates!
        </Typography>

        <StyledButton variant="outlined" size="large" onClick={handleJoinClick}>
          Join Us
        </StyledButton>
      </HeroContent>
    </HeroSectionContainer>
  );
};

export default HeroSection;
