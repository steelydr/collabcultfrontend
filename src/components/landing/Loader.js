import React from 'react';
import { Box, keyframes } from '@mui/material';

const drawC1 = keyframes`
  0% { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0; }
`;

const drawC2 = keyframes`
  0% { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0; }
`;

const drawPolygon = keyframes`
  0% { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0; }
`;

const Loader = ({ onAnimationEnd }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <svg width="100" height="100" viewBox="0 0 100 100">
        <path
          d="M 30 50 A 20 20 0 0 1 50 30"
          fill="transparent"
          stroke="#1976d2"
          strokeWidth="5"
          strokeDasharray="100"
          strokeDashoffset="100"
          style={{ animation: `${drawC1} 1s ease forwards` }}
        />
        <path
          d="M 70 50 A 20 20 0 0 0 50 30"
          fill="transparent"
          stroke="#1976d2"
          strokeWidth="5"
          strokeDasharray="100"
          strokeDashoffset="100"
          style={{ animation: `${drawC2} 1s ease forwards`, animationDelay: '1s' }}
        />
        <polygon
          points="30,50 50,30 70,50 50,70"
          fill="transparent"
          stroke="#1976d2"
          strokeWidth="5"
          strokeDasharray="100"
          strokeDashoffset="100"
          style={{ animation: `${drawPolygon} 1s ease forwards`, animationDelay: '2s' }}
          onAnimationEnd={onAnimationEnd} // Trigger when the animation completes
        />
      </svg>
    </Box>
  );
};

export default Loader;
