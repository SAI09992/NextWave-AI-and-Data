'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CodeRevealWrapperProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export default function CodeRevealWrapper({
  children,
  delay = 0,
  className = '',
}: CodeRevealWrapperProps) {
  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        y: 80,
        rotateX: 15,
        scale: 0.95
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        rotateX: 0,
        scale: 1
      }}
      viewport={{ once: true, margin: "-5%" }} // -5% ensures it triggers consistently when scrolled into view
      transition={{ 
        type: "spring",
        stiffness: 350,
        damping: 20,
        mass: 0.8,
        delay: delay
      }}
      style={{ perspective: 1000 }} // Gives the rotateX a 3D effect
    >
      {children}
    </motion.div>
  );
}
