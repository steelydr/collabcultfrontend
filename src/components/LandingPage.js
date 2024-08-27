import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from '@mui/material';
import HeroSection from './landing/HeroSection';
import Footer from './landing/Footer';
import Navbar from './landing/Navbar';
import OfferSection from './landing/OfferSection'; // Import the new OfferSection component

// Create a default theme with a black background
const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
  },
});

const Loader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      bgcolor: 'background.default',
    }}
  >
    <CircularProgress style={{ color: '#21CBF3' }} />
  </Box>
);

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Simulate a loading process
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the timeout as needed

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      {loading ? (
        <Loader />
      ) : (
        <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
          <Navbar scrolled={scrolled} />
          <HeroSection />
          <OfferSection /> {/* Use the new OfferSection component here */}
          <Footer />
        </Box>
      )}
    </ThemeProvider>
  );
};

export default LandingPage;
