// src/components/HeroSection.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExpandMore } from '@mui/icons-material';

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
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    opacity: 0.08,
    animation: 'float 25s infinite ease-in-out',
  },
  '&::before': {
    background: 'rgba(79, 195, 247, 0.3)',
    top: '-100px',
    left: '-100px',
  },
  '&::after': {
    background: 'rgba(25, 118, 210, 0.3)',
    bottom: '-100px',
    right: '-100px',
    animationDelay: '-15s',
  },
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translate(0, 0) rotate(0deg)',
    },
    '50%': {
      transform: 'translate(40px, 40px) rotate(180deg)',
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

const HeroSection = () => (
  <HeroSectionContainer>
    <AnimatedBackground />
    <HeroContent>
      <AnimatedText variant="h2" component="h1" gutterBottom>
        Connect  Create  Conquer
      </AnimatedText>
      <Typography variant="body1" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 250, fontSize: '1rem' }}>
        Break free from routine. Pursue your passions. Collaborate with like-minded individuals.
      </Typography>
      <StyledButton variant="outlined" size="large">
        Join Us
      </StyledButton>
    </HeroContent>
  </HeroSectionContainer>
);

export default HeroSection;