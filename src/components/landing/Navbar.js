// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  transition: 'background-color 0.3s ease',
  '&.scrolled': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
  },
}));

const Navbar = ({ scrolled }) => (
  <StyledAppBar position="fixed" className={scrolled ? 'scrolled' : ''}>
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        CollabCult
      </Typography>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        {['About', 'Community', 'Events', 'Contact'].map((item) => (
          <Button key={item} color="inherit" sx={{ ml: 2 }}>
            {item}
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

export default Navbar;
