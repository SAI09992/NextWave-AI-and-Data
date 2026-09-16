'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { NexusButton as Button } from '@/components/ui/NexusButton';
import { useEventSettings } from '@/components/providers/EventSettingsProvider';
import { Sparkles, ArrowRight, Calendar, MapPin, Cpu, Database, BrainCircuit, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';

const MountainClimberVisual = dynamic(() => import('@/components/animations/MountainClimberVisual'), { ssr: false });

export default function HeroSection() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'admin';
  const { eventName, dates, venue, tagline } = useEventSettings();

  return (
    <section className="relative pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden min-h-[92vh] flex items-center">
      {/* Transparent overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nexus-bg/10 to-nexus-bg/80 pointer-events-none" />

      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          {/* Left — Content */}
          <div className="space-y-6 max-w-2xl">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-950/40 border border-yellow-500/30 text-yellow-400 font-mono text-xs shadow-[0_0_20px_rgba(255,215,0,0.15)]"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span>PRESENTED BY AKCE • KLU • KARE ALUMNI</span>
            </motion.div>

            {/* Threat Matrix badge */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-500/20 text-red-400 font-mono text-[10px] ml-4"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>AI ENGINE : ACTIVE</span>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.0] uppercase">
                {eventName.split(' ').map((word, idx, arr) => (
                  <React.Fragment key={idx}>
                    {idx === arr.length - 1 ? (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400" style={{ textShadow: 'none' }}>
                        {word}
                      </span>
                    ) : (
                      <>{word} </>
                    )}
                    {idx === 0 && <br />}
                  </React.Fragment>
                ))}
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-sm sm:text-base text-nexus-text-muted font-sans leading-relaxed max-w-lg"
            >
              An intensive two-day hands-on AI and Data Science workshop for all engineering
              students (2nd, 3rd & 4th year). Dive into transformer architectures, live model training,
              data pipelines, and production ML deployment at TIFAC Core Seminar Hall.
            </motion.p>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-3 font-mono text-xs sm:text-sm tracking-widest uppercase"
            >
              {tagline.split('.').filter(Boolean).map((word, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className={idx === 0 ? "text-red-500 font-bold" : idx === 1 ? "text-orange-400 font-bold" : "text-yellow-400 font-bold"}>
                    {word.trim()}.
                  </span>
                  {idx !== arr.length - 1 && <span className="text-nexus-primary/30">•</span>}
                </React.Fragment>
              ))}
            </motion.div>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { icon: Calendar, label: '2 DAYS' },
                { icon: Cpu, label: 'HANDS-ON' },
                { icon: Database, label: 'AI TRAINING' },
                { icon: Zap, label: 'CERTIFICATE' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-nexus-surface/80 border border-nexus-border text-nexus-text font-mono text-xs hover:border-nexus-primary/40 hover:text-nexus-primary transition-all cursor-default">
                  <Icon className="w-3.5 h-3.5 text-nexus-primary" />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="flex flex-col sm:flex-row items-start gap-4 pt-2"
            >
              <Link href={session ? (isAdmin ? '/admin' : '/portal') : '/register'}>
                <Button size="lg" variant="primary" glow className="gap-3 text-sm h-12 px-8 font-bold">
                  <span>{session ? (isAdmin ? 'COMMAND CENTER' : 'PARTICIPANT PORTAL') : 'REGISTER NOW'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="#overview">
                <Button size="lg" variant="secondary" className="gap-2 text-sm h-12 px-8 font-bold border-nexus-primary/30 hover:border-nexus-primary/60 hover:bg-nexus-primary/5">
                  <span>EXPLORE WORKSHOP</span>
                </Button>
              </Link>
            </motion.div>

            {/* Bottom floating info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-[11px] text-nexus-text-dim font-mono pt-4"
            >
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                <span>{dates}</span>
              </div>
              <div className="hidden sm:block text-nexus-border">|</div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                <span>{venue}</span>
              </div>
            </motion.div>
          </div>

          {/* Right — AI Neural Network Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            className="relative hidden lg:block h-[550px] w-full"
          >
            <MountainClimberVisual />
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-nexus-primary/20 rounded-tl-xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-red-500/20 rounded-br-xl" />
          </motion.div>
        </div>
      </div>

      {/* Bottom floating terminal line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-8 font-mono text-[10px] text-nexus-text-dim/40 hidden md:block"
      >
        IP:10.200.4.1
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 right-8 font-mono text-[10px] text-nexus-text-dim/40 hidden md:flex items-center gap-1.5"
      >
        <Sparkles className="w-3 h-3" />
        <span>AI DATA FEED : 2.4M TPS</span>
      </motion.div>
    </section>
  );
}
