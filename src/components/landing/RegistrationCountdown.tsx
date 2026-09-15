'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function RegistrationCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Target Date: 1st October 2026, 11:59:59 PM
    const targetDate = new Date('2026-10-01T23:59:59').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, []);

  const timeBlocks = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  if (!mounted) return null;

  return (
    <section className="py-20 sm:py-32 relative border-t border-gray-800/60 bg-transparent overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-yellow-900/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-950/40 border border-yellow-500/30 text-yellow-400 text-xs font-mono shadow-[0_0_10px_rgba(255,215,0,0.1)]">
            <Timer className="w-4 h-4 animate-pulse" />
            <span>REGISTRATION CLOSES SOON</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black font-sans text-white tracking-tight">
            TICKING <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">CLOCK</span>
          </h2>

          <p className="text-lg text-gray-400 font-sans max-w-xl mx-auto">
            Limited capacity available. Secure your spot before the portal permanently shuts down.
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 pt-4">
            {timeBlocks.map((block, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div className="w-20 h-24 sm:w-28 sm:h-32 bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent" />
                  <span className="text-4xl sm:text-6xl font-black font-mono text-white tracking-tighter">
                    {block.value.toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold font-mono tracking-widest text-yellow-500">
                  {block.label}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-yellow-600 text-white rounded-xl font-bold font-sans text-lg overflow-hidden shadow-[0_0_30px_rgba(255,215,0,0.4)]"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Zap className="w-5 h-5 relative z-10 group-hover:animate-bounce" />
                <span className="relative z-10">SECURE YOUR SEAT</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
