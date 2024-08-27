import React, { useState } from 'react';
import { Box, Container, Typography, IconButton, Link, Grid, TextField, Button, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faYoutube, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const [message, setMessage] = useState('');
  const [selectedQuery, setSelectedQuery] = useState('');

  const socialLinks = [
    { icon: faInstagram, url: 'https://www.instagram.com/your_instagram', label: 'Instagram' },
    { icon: faYoutube, url: 'https://www.youtube.com/your_youtube_channel', label: 'YouTube' },
    { icon: faFacebook, url: 'https://www.facebook.com/your_facebook', label: 'Facebook' },
    { icon: faTwitter, url: 'https://www.twitter.com/your_twitter', label: 'Twitter' },
  ];

  const handleSend = () => {
    const email = selectedQuery === 'software' ? 'dsoni071rajeswari@gmail.com' : 'rdepala@hawk.iit.edu';
    window.location.href = `mailto:${email}?subject=${selectedQuery === 'software' ? 'Software Inquiry' : 'General Inquiry'}&body=${encodeURIComponent(message)}`;
    setMessage('');
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#000000',
        color: '#FFFFFF',
        pt: 8,
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 600, fontSize: '1.5rem', letterSpacing: '0.5px' }}>
              COLLAB CULT
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.7, lineHeight: 1.8, fontSize: '1rem' }}>
              A platform dedicated to fostering collaboration and innovation in the tech community.
            </Typography>
            <Box sx={{ mb: 4 }}>
              {socialLinks.map((link, index) => (
                <IconButton
                  key={index}
                  component={Link}
                  href={link.url}
                  sx={{
                    color: '#FFFFFF',
                    mr: 2,
                    '&:hover': { color: '#21CBF3', transform: 'translateY(-2px)' },
                    transition: 'all 0.3s ease',
                  }}
                  aria-label={link.label}
                >
                  <FontAwesomeIcon icon={link.icon} />
                </IconButton>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 600, fontSize: '1.2rem', letterSpacing: '0.5px' }}>
              CONTACT US
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: selectedQuery === 'software' ? '#21CBF3' : '#757575',
                    color: '#000',
                    fontWeight: 600,
                    py: 1.2,
                    fontSize: '0.9rem',
                    '&:hover': { bgcolor: '#1AABDF' },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setSelectedQuery('software')}
                >
                  Software Inquiries
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: selectedQuery === 'general' ? '#21CBF3' : '#757575',
                    color: '#000',
                    fontWeight: 600,
                    py: 1.2,
                    fontSize: '0.9rem',
                    '&:hover': { bgcolor: '#1AABDF' },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setSelectedQuery('general')}
                >
                  General Inquiries
                </Button>
              </Grid>
            </Grid>
            {selectedQuery && (
              <>
                <TextField
                  variant="outlined"
                  placeholder="Enter your message"
                  fullWidth
                  multiline
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: '#FFFFFF',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#21CBF3',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#21CBF3',
                      },
                    },
                    '& .MuiInputBase-input': {
                      padding: '12px 14px',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      opacity: 1,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: '#21CBF3',
                    color: '#000000',
                    fontWeight: 600,
                    py: 1.2,
                    fontSize: '0.9rem',
                    '&:hover': {
                      bgcolor: '#1AABDF',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={handleSend}
                >
                  Send
                </Button>
              </>
            )}
          </Grid>
        </Grid>
        <Divider sx={{ my: 6, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <Typography variant="body2" align="center" sx={{ opacity: 0.7, fontSize: '0.9rem', fontWeight: 400 }}>
          © {new Date().getFullYear()} CollabCult. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
