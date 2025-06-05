import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AnimatedCounter = ({ end, duration = 2, prefix = '', suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef();

  useEffect(() => {
    // Reset count when end value changes
    setCount(0);
    setIsAnimating(true);

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * (end || 0));
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setCount(end || 0); // Ensure we end with exact value
      }
    };

    // Only animate if end value is greater than 0
    if (end > 0) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      setCount(0);
      setIsAnimating(false);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  const formatNumber = (num) => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return num.toLocaleString();
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="font-bold inline-block"
    >
      {prefix}{formatNumber(count)}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter;