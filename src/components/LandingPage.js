import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from '@mui/material';

// Lazy load the components
const HeroSection = lazy(() => import('./landing/HeroSection'));
const Footer = lazy(() => import('./landing/Footer'));
const Navbar = lazy(() => import('./landing/Navbar'));
const OfferSection = lazy(() => import('./landing/OfferSection')); // Import the new OfferSection component

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

    // Disable zooming and pinching
    const disableZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', disableZoom, { passive: false });
    document.addEventListener('touchmove', disableZoom, { passive: false });
    document.addEventListener('touchend', disableZoom, { passive: false });

    // Simulate a loading process
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the timeout as needed

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchstart', disableZoom);
      document.removeEventListener('touchmove', disableZoom);
      document.removeEventListener('touchend', disableZoom);
    };
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      {loading ? (
        <Loader />
      ) : (
        <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
          <Suspense fallback={<Loader />}>
            <Navbar scrolled={scrolled} />
            <HeroSection />
            <OfferSection /> {/* Use the new OfferSection component here */}
            <Footer />
          </Suspense>
        </Box>
      )}
    </ThemeProvider>
  );
};

export default LandingPage;
