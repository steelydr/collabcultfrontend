import React, { useState } from 'react';
import { Box, Container, Typography, IconButton, Link, Grid, Button, Divider, Menu, MenuItem } from '@mui/material'; // Added Menu and MenuItem components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const socialLinks = [
    { icon: faInstagram, url: 'https://www.instagram.com/collab._cult_/', label: 'Instagram' },
    { icon: faYoutube, url: 'https://www.youtube.com/@vamshivk', label: 'YouTube' }
  ];

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const sendEmail = (type) => {
    handleClose();
    let email = '';
    if (type === 'software') {
      email = 'software@collabcult.com'; // Replace with the software enquiry email
    } else if (type === 'other') {
      email = 'other@collabcult.com'; // Replace with the other enquiry email
    }
    window.location.href = `mailto:${email}`;
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#000000',
        color: '#FFFFFF',
        pt: 5,
        pb: 5,
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2} justifyContent="center" alignItems="center" direction="column">
          {/* Community Section */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 700,
                fontSize: '1.8rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#21CBF3', // Updated color to match the design
              }}
            >
              COLLABCULT COMMUNITY
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                opacity: 0.9,
                lineHeight: 1.6,
                fontSize: '1rem',
                textAlign: 'center',
              }}
            >
              Join our community and collaborate to create innovative solutions. Share your thoughts, learn together, and conquer challenges with us!
            </Typography>
            <Box sx={{ mb: 3 }}>
              {socialLinks.map((link, index) => (
                <IconButton
                  key={index}
                  component={Link}
                  href={link.url}
                  sx={{
                    color: '#FFFFFF',
                    mr: 2,
                    '&:hover': { color: '#21CBF3', transform: 'translateY(-3px)' },
                    transition: 'transform 0.2s ease',
                  }}
                  aria-label={link.label}
                >
                  <FontAwesomeIcon icon={link.icon} />
                </IconButton>
              ))}
            </Box>
            <Button
              variant="text"
              sx={{
                color: '#21CBF3',
                textDecoration: 'underline',
                fontWeight: 600,
              }}
              onClick={handleMenuClick}
            >
              Send us a message
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => sendEmail('software')}>Software Enquiries</MenuItem>
              <MenuItem onClick={() => sendEmail('other')}>Other Enquiries</MenuItem>
            </Menu>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Typography
          variant="body2"
          align="center"
          sx={{ opacity: 0.8, fontSize: '0.9rem', fontWeight: 400 }}
        >
          © {new Date().getFullYear()} CollabCult. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
