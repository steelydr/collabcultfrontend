// src/components/FeatureCard.js
import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[10],
  },
}));

const FeatureCard = ({ icon, title, description }) => (
  <StyledFeatureCard>
    <Box sx={{ color: 'primary.main', mb: 2 }}>{icon}</Box>
    <Typography variant="h6" component="h3" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" align="center">
      {description}
    </Typography>
  </StyledFeatureCard>
);

export default FeatureCard;
