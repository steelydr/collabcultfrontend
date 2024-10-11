import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Box, 
  CircularProgress,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Lazy load the components
const HeroSection = lazy(() => import('./landing/HeroSection'));
const Footer = lazy(() => import('./landing/Footer'));
const OfferSection = lazy(() => import('./landing/OfferSection'));

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

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  transition: 'background-color 0.3s ease',
  '&.scrolled': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
  },
}));

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const offerSectionRef = useRef(null);
  const footerRef = useRef(null);

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

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigation = (ref) => {
    scrollToSection(ref);
    setDrawerOpen(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button onClick={() => handleNavigation(footerRef)}>
          <ListItemText primary="Community" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation(offerSectionRef)}>
          <ListItemText primary="Events" />
        </ListItem>
      </List>
    </Box>
  );

  const Navbar = () => (
    <StyledAppBar position="fixed" className={scrolled ? 'scrolled' : ''}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <img
            src="https://collabcultimages.blob.core.windows.net/logo/whitelogo.png?sp=r&st=2024-08-27T14:33:14Z&se=2030-08-27T22:33:14Z&sv=2022-11-02&sr=b&sig=%2Bs5heSUazhVROgtN4Pz2EhGlGUdYS5ULxkMb0h9fpgY%3D"
            alt="CollabCult Logo"
            style={{ height: '30px', paddingLeft: '5px', paddingTop: '2px' }}
          />
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Button
            color="inherit"
            sx={{ ml: 2 }}
            onClick={() => handleNavigation(footerRef)}
          >
            Community
          </Button>
          <Button
            color="inherit"
            sx={{ ml: 2 }}
            onClick={() => handleNavigation(offerSectionRef)}
          >
            Events
          </Button>
        </Box>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { md: 'none' } }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </StyledAppBar>
  );

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      {loading ? (
        <Loader />
      ) : (
        <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
          <Suspense fallback={<Loader />}>
            <Navbar />
            <HeroSection />
            <OfferSection ref={offerSectionRef} />
            <Footer ref={footerRef} />
          </Suspense>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            {drawerContent}
          </Drawer>
        </Box>
      )}
    </ThemeProvider>
  );
};

export default LandingPage;