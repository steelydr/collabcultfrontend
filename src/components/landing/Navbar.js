import React from 'react';
import { AppBar, Toolbar, Button, IconButton, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  transition: 'background-color 0.3s ease',
  '&.scrolled': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
  },
}));

const Navbar = ({ scrolled }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
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
          {[
            { label: 'Community', path: '/community' },
            { label: 'Events', path: '/events' },
          ].map((item) => (
            <Button
              key={item.label}
              color="inherit"
              sx={{ ml: 2 }}
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </Box>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
