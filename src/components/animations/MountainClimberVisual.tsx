'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function MountainClimberVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax tied to scrolling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth, slow parallax panning as the user scrolls
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.0]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 overflow-hidden rounded-2xl">
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y, scale }}
        animate={{ scale: [1.15, 1.2, 1.15] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <Image
          src="/mountain.jpg"
          alt="Epic Realistic Mountain Climber"
          fill
          priority
          className="object-cover object-center opacity-90 mix-blend-screen"
          quality={100}
        />
        
        {/* Gradients to seamlessly blend the image edges into the particle background */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-nexus-bg via-nexus-bg/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-nexus-bg via-nexus-bg/40 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-nexus-bg via-nexus-bg/40 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-nexus-bg via-nexus-bg/40 to-transparent pointer-events-none" />
        
        {/* Subtle red tint overlay for the theme */}
        <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay pointer-events-none" />
      </motion.div>

      {/* Target: Top of the Peak */}
      <div className="absolute top-[8%] left-[24%] transform -translate-x-1/2 pointer-events-none z-10 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
        <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping absolute" />
        <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full relative z-10 shadow-[0_0_12px_#FFD700]" />
        <span className="text-yellow-400 font-black font-mono text-xs tracking-[0.3em] uppercase bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-yellow-500/20">
          PROFESSIONAL
        </span>
      </div>

      {/* Target: The Person (Climber) */}
      <div className="absolute top-[51%] left-[45%] transform -translate-x-1/2 pointer-events-none z-10 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(255,51,0,0.8)]">
        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping absolute" />
        <div className="w-2.5 h-2.5 bg-red-500 rounded-full relative z-10 shadow-[0_0_12px_#EF4444]" />
        <span className="text-red-400 font-black font-mono text-xs tracking-[0.3em] uppercase bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-red-500/20">
          YOU
        </span>
      </div>

      {/* General HUD overlays */}
      <div className="absolute bottom-12 left-8 pointer-events-none z-10 hidden sm:block">
        <div className="text-nexus-text-dim font-mono text-[10px] tracking-[0.3em] leading-relaxed drop-shadow-lg bg-black/30 p-3 rounded border border-white/5 backdrop-blur-sm">
          TARGET: THE PEAK<br/>
          TRAJECTORY: ASCENDING<br/>
          STATUS: IN PROGRESS
        </div>
      </div>
    </div>
  );
}
