// src/components/SectionTitle.js
import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const SectionTitleContainer = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '50px',
    height: '3px',
    background: theme.palette.primary.main,
  },
}));

const SectionTitle = ({ children }) => (
  <SectionTitleContainer variant="h3" align="center" gutterBottom>
    {children}
  </SectionTitleContainer>
);

export default SectionTitle;
