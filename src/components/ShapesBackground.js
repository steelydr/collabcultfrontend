import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { styled } from '@mui/material/styles';

const ShapesBackground = () => {
  const canvasRef = useRef(null);
  const canvasHeight = 3000; // Reduced canvas height for better performance

  const getResponsiveSettings = () => {
    const canvasWidth = window.innerWidth;
    let shapeCount, maxShapeSize, margin;

    if (canvasWidth <= 480) { // Mobile
      shapeCount = 20;
      maxShapeSize = 40;
      margin = 10;
    } else if (canvasWidth <= 768) { // Tablet
      shapeCount = 30;
      maxShapeSize = 50;
      margin = 20;
    } else { // Desktop
      shapeCount = 30;
      maxShapeSize = 80;
      margin = 30;
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
      return {
        x: Math.random() * (canvasWidth - 2 * margin) + margin,
        y: Math.random() * canvasHeight,
        size: Math.random() * (maxShapeSize / 2) + maxShapeSize / 2,
        color: baseColors[Math.floor(Math.random() * baseColors.length)],
        speedX: (Math.random() * 2 - 1) * 0.5, // Reduced speed
        speedY: (Math.random() * 2 - 1) * 0.5, // Reduced speed
      };
    };

    return Array.from({ length: shapeCount }, () =>
      createShape(canvasWidth, canvasHeight, margin, baseColors)
    );
  }, [canvasHeight, margin, shapeCount, maxShapeSize, canvasWidth]);

  const drawShapes = useCallback((ctx, canvasWidth, canvasHeight, margin, shapes) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    shapes.forEach((shape) => {
      ctx.fillStyle = shape.color;
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.size / 2, 0, Math.PI * 2);
      ctx.fill();

      shape.x += shape.speedX;
      shape.y += shape.speedY;

      if (shape.x + shape.size / 2 > canvasWidth - margin || shape.x - shape.size / 2 < margin) {
        shape.speedX *= -1;
      }
      if (shape.y + shape.size / 2 > canvasHeight || shape.y - shape.size / 2 < 0) {
        shape.speedY *= -1;
      }
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let animationFrameId;
    const render = () => {
      drawShapes(ctx, canvas.width, canvasHeight, margin, shapes);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      const { canvasWidth } = getResponsiveSettings();
      canvas.width = canvasWidth;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [drawShapes, shapes, canvasWidth, canvasHeight, margin]);

  return <CanvasContainer><canvas ref={canvasRef} /></CanvasContainer>;
};

const CanvasContainer = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%', 
  height: '100vh', 
  zIndex: -1,
  overflow: 'hidden',
});

export default ShapesBackground;