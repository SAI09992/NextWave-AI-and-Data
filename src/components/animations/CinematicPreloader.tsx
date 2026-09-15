'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export default function CinematicPreloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [glitchText, setGlitchText] = useState('NEXTWAVE AI AND DATA');
  
  const PEAK_ELEVATION = 8848; // Everest height in meters for thematic effect

  // Phase 1: Ascension Progress
  useEffect(() => {
    if (phase !== 1) return;

    let currentProgress = 0;
    const interval = setInterval(() => {
      // Simulate climbing struggle - moderate climb speed
      const step = Math.random() * 5 + 1.0;
      currentProgress += step;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => setPhase(2), 300); // Trigger peak reveal
      }
      
      setProgress(currentProgress);
      setElevation(Math.floor((currentProgress / 100) * PEAK_ELEVATION));
    }, 30);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 2: Peak Reached Reveal -> triggers Phase 3
  useEffect(() => {
    if (phase === 2) {
      setTimeout(() => {
        setPhase(3);
      }, 1200); // Show "The Peak" for 1.2s
    }
  }, [phase]);

  // Phase 3: Alumni Presents Matrix Decrypt Reveal
  useEffect(() => {
    if (phase === 3) {
      // Matrix glitch decrypt effect for main title
      const original = 'NEXTWAVE AI AND DATA';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>';
      let iterations = 0;
      
      const glitchInterval = setInterval(() => {
        setGlitchText(original.split('').map((c, i) => {
          if (c === ' ') return ' ';
          if (i < iterations) return c;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join(''));
        
        if (iterations >= original.length) {
          clearInterval(glitchInterval);
        }
        iterations += 1/3; // Speed of decrypt
      }, 30);

      // End sequence and trigger unmount
      setTimeout(() => {
        onComplete();
      }, 3000); // Moderate duration for matrix glitch
    }
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0505] overflow-hidden font-mono selection:bg-none">
      
      {/* Background Ambience: Subtle falling embers */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              boxShadow: '0 0 10px 2px rgba(239, 68, 68, 0.8)',
            }}
            animate={{
              y: ['0vh', '120vh'],
              x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 150],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Phase 1: The Ascension Tracker */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div 
            key="ascension"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-lg h-96 flex items-center justify-center px-8"
          >
            {/* The Mountain Line (Vertical Track) */}
            <div className="absolute left-8 md:left-1/4 top-0 bottom-0 w-[2px] bg-red-900/40 rounded-full overflow-hidden">
              <motion.div 
                className="absolute bottom-0 w-full bg-gradient-to-t from-red-600 to-yellow-400 shadow-[0_0_15px_#FFD700]"
                style={{ height: `${progress}%` }}
              />
            </div>

            {/* The Climber Marker */}
            <motion.div 
              className="absolute left-[26px] md:left-[calc(25%-6px)] flex items-center gap-6"
              style={{ bottom: `${progress}%` }}
              initial={{ y: 0 }}
              animate={{ y: '-50%' }}
            >
              {/* Glowing Dot */}
              <div className="relative flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_20px_#FFD700] z-10" />
                <div className="absolute w-8 h-8 border border-yellow-500/50 rounded-full animate-ping" />
              </div>

              {/* Telemetry HUD */}
              <div className="flex flex-col text-left">
                <div className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,51,0,0.5)]">
                  {elevation}<span className="text-2xl md:text-3xl text-red-500 ml-1">m</span>
                </div>
                <div className="flex gap-4 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-red-500/80 tracking-widest uppercase font-bold">ASCENT</span>
                    <span className="text-xs text-yellow-400 font-bold">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-red-500/80 tracking-widest uppercase font-bold">O2 LEVEL</span>
                    <span className="text-xs text-white font-bold">{Math.max(21, 100 - (progress * 0.79)).toFixed(1)}%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-red-500/80 tracking-widest uppercase font-bold">STATUS</span>
                    <span className="text-xs text-white font-bold animate-pulse">CLIMBING</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2: Peak Reached Explosion */}
      <AnimatePresence>
        {phase === 2 && (
          <motion.div
            key="peak"
            className="absolute inset-0 flex flex-col items-center justify-center z-50 px-4"
          >
            {/* Golden Shockwave */}
            <motion.div
              initial={{ scale: 0, opacity: 1, borderWidth: '50px' }}
              animate={{ scale: 20, opacity: 0, borderWidth: '1px' }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute z-0 rounded-full border-yellow-400 pointer-events-none"
              style={{ width: '100px', height: '100px', boxShadow: '0 0 100px #FFD700' }}
            />
            
            {/* Massive Title Reveal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.5 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.5, delay: 0.2 }}
              className="relative z-10 text-center"
            >
              <div className="text-yellow-400 text-sm md:text-base font-bold tracking-[0.5em] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
                TARGET REACHED
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none" style={{ textShadow: '0 0 40px rgba(220,38,38,0.8), 2px 2px 0 #FFD700' }}>
                THE PEAK
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 3: The Matrix Decrypt & Alumni Presents */}
      <AnimatePresence>
        {phase === 3 && (
          <motion.div
            key="presents"
            className="absolute inset-0 flex flex-col items-center justify-center z-50 px-4 text-center"
          >
            {/* Shield Logo Reveal */}
            <motion.div
              initial={{ rotateY: 180, scale: 0, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
              className="mb-8 flex flex-col items-center"
            >
              <div className="w-24 h-24 bg-black/90 border border-yellow-500/50 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.3)] overflow-hidden p-1">
                <img src="/alumni-logo.png" alt="NextWave Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
              </div>
            </motion.div>

            {/* Kinetic Subhead */}
            <motion.div
              initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-red-500 text-sm md:text-base tracking-[0.4em] mb-4 font-bold"
            >
              KARE ALUMNI PRESENTS
            </motion.div>

            {/* nexus Decrypt Title with Chromatic Aberration */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none"
              style={{ 
                textShadow: '0 0 30px rgba(255,51,0,0.5), 3px 0 0 rgba(255,215,0,0.6), -3px 0 0 rgba(220,38,38,0.6)' 
              }}
            >
              {glitchText}
            </motion.h1>

            {/* Tagline Date Stamp */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8, type: 'spring' }}
              className="mt-8 flex flex-wrap justify-center gap-3 md:gap-6 text-[10px] md:text-sm font-mono text-yellow-500/70 tracking-[0.2em]"
            >
              <span className="text-white">ARTIFICIAL INTELLIGENCE</span>
              <span className="text-red-500/40">//</span>
              <span className="text-white">DATA SCIENCE</span>
              <span className="text-red-500/40">//</span>
              <span className="text-white">MACHINE LEARNING</span>
            </motion.div>
            
            {/* Glowing Horizon Sweep Laser (Reveals the page) - Restored Original Effect */}
            <motion.div 
              initial={{ scaleX: 0, opacity: 0, y: 150 }}
              animate={{ scaleX: 1, opacity: 1, y: -800 }}
              transition={{ duration: 1.0, delay: 1.5, ease: 'easeInOut' }}
              className="absolute bottom-0 w-full h-[3px] bg-red-500 shadow-[0_0_30px_#ef4444] pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
