import React, { useRef, useEffect, useCallback, useMemo } from 'react'; // Removed useState
import { styled } from '@mui/material/styles';

const ShapesBackground = () => {
  const canvasRef = useRef(null);
  const canvasHeight = 10000; // Extend the canvas height for shapes movement

  const getResponsiveSettings = () => {
    const canvasWidth = window.innerWidth;
    let shapeCount, maxShapeSize, margin;

    if (canvasWidth <= 480) { // Mobile
      shapeCount = 50;
      maxShapeSize = 50;
      margin = 20;
    } else if (canvasWidth <= 768) { // Tablet
      shapeCount = 100;
      maxShapeSize = 75;
      margin = 30;
    } else { // Desktop
      shapeCount = 200;
      maxShapeSize = 160;
      margin = 50;
    }

    return { shapeCount, maxShapeSize, margin, canvasWidth };
  };

  const { shapeCount, maxShapeSize, margin, canvasWidth } = getResponsiveSettings();

  const shapes = useMemo(() => {
    const baseColors = [
      'rgba(79, 195, 247, 0.3)',
      'rgba(25, 118, 210, 0.3)',
      'rgba(34, 139, 34, 0.1)',
      'rgba(0, 150, 136, 0.3)',
    ];

    const createShape = (canvasWidth, canvasHeight, margin, baseColors) => {
      const shapeType = Math.random() < 0.5 ? 'circle' : (Math.random() < 0.75 ? 'star' : 'pentagon');
      return {
        x: Math.random() * (canvasWidth - 2 * margin) + margin,
        y: Math.random() * canvasHeight,
        size: Math.random() * (maxShapeSize / 2) + maxShapeSize / 2, // Even larger sizes
        color: baseColors[Math.floor(Math.random() * baseColors.length)],
        type: shapeType,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
      };
    };

    return Array.from({ length: shapeCount }, () =>
      createShape(canvasWidth, canvasHeight, margin, baseColors)
    );
  }, [canvasHeight, margin, shapeCount, maxShapeSize, canvasWidth]);

  const drawShapes = useCallback((ctx, canvasWidth, canvasHeight, margin, shapes) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    shapes.forEach((shape) => {
      ctx.fillStyle = shape.color;
      ctx.strokeStyle = shape.color;

      switch (shape.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, shape.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'pentagon':
          ctx.beginPath();
          const angle = (Math.PI * 2) / 5;
          for (let i = 0; i < 5; i++) {
            const x = shape.x + shape.size / 2 * Math.cos(i * angle - Math.PI / 2);
            const y = shape.y + shape.size / 2 * Math.sin(i * angle - Math.PI / 2);
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.fill();
          break;
        case 'star':
          ctx.beginPath();
          const outerRadius = shape.size / 2;
          const innerRadius = outerRadius / 2.5;
          for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = shape.x + radius * Math.cos(i * Math.PI / 5 - Math.PI / 2);
            const y = shape.y + radius * Math.sin(i * Math.PI / 5 - Math.PI / 2);
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.lineWidth = 5;
          ctx.stroke();
          break;
        default:
          break;
      }

      shape.x += shape.speedX;
      shape.y += shape.speedY;

      if (shape.x + shape.size / 2 > canvasWidth - margin || shape.x - shape.size / 2 < margin) {
        shape.speedX *= -1;
      }
      if (shape.y + shape.size / 2 > canvasHeight || shape.y - shape.size / 2 < 0) {
        shape.speedY *= -1;
      }
    });

    requestAnimationFrame(() => drawShapes(ctx, canvasWidth, canvasHeight, margin, shapes));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    drawShapes(ctx, canvas.width, canvasHeight, margin, shapes);

    const handleResize = () => {
      const { canvasWidth } = getResponsiveSettings();
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawShapes, shapes, canvasWidth, margin]);

  return <CanvasContainer><canvas ref={canvasRef} /></CanvasContainer>;
};

// Styled Components

const CanvasContainer = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%', 
  height: '100vh', 
  zIndex: -1, // Send to background
  overflow: 'hidden',
});

export default ShapesBackground;
