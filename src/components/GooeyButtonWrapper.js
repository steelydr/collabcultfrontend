import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

const GooeyButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  padding: '12px 36px',
  margin: '10px 0',
  color: '#fff',
  background: '#247BBE',
  borderRadius: '50px',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  letterSpacing: '2px',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  overflow: 'hidden',
  filter: 'url("#goo")',
  transition: 'all 0.5s ease',

  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '20px',
    height: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '50%',
    transition: 'all 0.5s ease',
    opacity: 0,
    zIndex: -1,
  },

  '&:hover': {
    letterSpacing: '3px',
    color: '#247BBE',
    background: '#fff',

    '&::before': {
      transform: 'translate(-50%, -50%) scale(10)',
      opacity: 1,
    },

    '&::after': {
      transform: 'translate(-50%, -50%) scale(15)',
      opacity: 0,
    },
  },
}));

const GooeyEffect = () => (
  <svg style={{ position: 'absolute', top: '0', left: '0', width: '0', height: '0' }}>
    <defs>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
        <feBlend in="SourceGraphic" in2="goo" />
      </filter>
    </defs>
  </svg>
);

const GooeyButtonWrapper = ({ children, ...props }) => (
  <>
    <GooeyButton {...props}>{children}</GooeyButton>
    <GooeyEffect />
  </>
);

export default GooeyButtonWrapper;