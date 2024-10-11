import React, { useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const baseColors = [
  'rgba(79, 195, 247, 0.3)',
  'rgba(25, 118, 210, 0.3)',
  'rgba(34, 139, 34, 0.1)',
];

const HeroSectionContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#000000',
  position: 'relative',
  overflow: 'hidden',
  color: '#FFFFFF',
  padding: '0 20px',
}));

const HeroContent = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  zIndex: 1,
  maxWidth: '800px',
  margin: '0 auto',
}));

const AnimatedBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  '& canvas': {
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));

const AnimatedText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '1px',
  position: 'relative',
  display: 'inline-block',
  color: '#21CBF3',
  fontSize: '4rem',
  animation: 'fadeIn 3s ease-in-out',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-10px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  padding: '12px 36px',
  fontSize: '1rem',
  textTransform: 'none',
  color: '#FFFFFF',
  border: '2px solid #21CBF3',
  backgroundColor: '#014D4E',
  transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: '#21CBF3',
    color: '#000000',
    boxShadow: '0px 12px 20px rgba(0, 0, 0, 0.15)',
  },
}));

const HeroSection = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const getRandomColor = () => {
    return baseColors[Math.floor(Math.random() * baseColors.length)];
  };

  const drawCircle = (ctx, shape) => {
    ctx.beginPath();
    ctx.arc(shape.x, shape.y, shape.size / 2, 0, Math.PI * 2, false);
    ctx.fillStyle = shape.color;
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const shapes = [];

    const createShapes = () => {
      for (let i = 0; i < 5; i++) {  // Reduced from 10 to 5 circles
        shapes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 70 + Math.random() * 60,
          color: getRandomColor(),
          dx: 0.2 + Math.random() * 0.3,  // Reduced speed
          dy: 0.2 + Math.random() * 0.3,  // Reduced speed
        });
      }
    };

    const animateShapes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapes.forEach((shape) => {
        drawCircle(ctx, shape);

        shape.x += shape.dx;
        shape.y += shape.dy;

        if (shape.x + shape.size / 2 > canvas.width || shape.x - shape.size / 2 < 0) {
          shape.dx = -shape.dx;
        }
        if (shape.y + shape.size / 2 > canvas.height || shape.y - shape.size / 2 < 0) {
          shape.dy = -shape.dy;
        }
      });

      requestAnimationFrame(animateShapes);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    createShapes();
    animateShapes();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleJoinClick = () => {
    navigate('/register');
  };

  return (
    <HeroSectionContainer>
      <AnimatedBackground>
        <canvas ref={canvasRef}></canvas>
      </AnimatedBackground>
      <HeroContent>
        <AnimatedText variant="h2" component="h1" gutterBottom>
          CONNECT  CREATE  CONQUER
        </AnimatedText>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          sx={{ 
            mb: 4, 
            fontWeight: 400, 
            fontSize: '1.25rem', 
            lineHeight: 1.5, 
            zIndex:'3',
            color: 'white'
          }}
        >
          Break free from routine. Pursue your passions. Collaborate with like-minded individuals.
        </Typography>

        <Typography 
          variant="body1" 
          component="h2" 
          gutterBottom 
          sx={{ 
            mb: 4, 
            fontWeight: 300, 
            fontSize: '1.1rem', 
            lineHeight: 1.6, 
            color: '#f1f1f1'
          }}
        >
          Stay Connected with us for more updates!
        </Typography>

        <StyledButton variant="outlined" size="large" onClick={handleJoinClick} sx={{ backgroundColor:'transparent'}}>
          Join Us
        </StyledButton>
      </HeroContent>
    </HeroSectionContainer>
  );
};

export default HeroSection;