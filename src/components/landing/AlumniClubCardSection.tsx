'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, Award, ShieldCheck } from 'lucide-react';

export default function AlumniClubCardSection() {
  return (
    <section className="py-16 sm:py-24 relative bg-transparent border-t border-nexus-border/60">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-950/60 border border-nexus-primary/40 text-nexus-primary text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>// 14. EXCLUSIVE MEMBERSHIP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-nexus-text uppercase">
            Alumni Association
          </h2>
          <p className="text-sm sm:text-base text-nexus-text-muted font-mono">
            Elevate your professional network with the AKCE KLU KARE Alumni Club.
          </p>
        </div>

        {/* 3D Glassmorphic Club Card Container */}
        <div className="max-w-3xl mx-auto relative group perspective-1000">
          
          {/* Background ambient glow matching the card */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-yellow-500/20 to-purple-600/20 blur-3xl rounded-[2rem] transition-opacity duration-500 opacity-50 group-hover:opacity-100" />

          {/* The Card */}
          <motion.div
            initial={{ opacity: 0, rotateX: 20, y: 50 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full aspect-[1.8/1] sm:aspect-[2.2/1] rounded-2xl sm:rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl p-6 sm:p-10 flex flex-col justify-between"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Holographic overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_20%,rgba(255,255,255,0.1)_25%,transparent_30%)] opacity-0 group-hover:opacity-100 group-hover:animate-hologram pointer-events-none transition-opacity duration-500" />
            
            {/* Fine grid texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            {/* Top section: Logo & Membership */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-yellow-500/50 shadow-[0_0_15px_rgba(255,215,0,0.3)] bg-white p-1">
                  <img src="/alumni-logo.png" alt="Alumni Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg sm:text-2xl font-mono tracking-widest uppercase">AKCE KLU KARE</h3>
                  <div className="text-yellow-400 text-xs sm:text-sm font-mono tracking-widest">ALUMNI ASSOCIATION</div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-white/80 font-mono tracking-wider">VERIFIED ALUMNI</span>
              </div>
            </div>

            {/* Middle decorative chip/circuit */}
            <div className="relative z-10 my-auto">
              <div className="w-10 h-8 sm:w-12 sm:h-10 rounded border border-yellow-500/30 bg-gradient-to-br from-yellow-200/20 to-yellow-600/20 backdrop-blur-sm flex items-center justify-center">
                <div className="w-6 h-4 sm:w-8 sm:h-6 border border-yellow-400/40 rounded-sm grid grid-cols-3 grid-rows-2 gap-[1px]">
                  {[...Array(6)].map((_, i) => <div key={i} className="bg-yellow-400/20" />)}
                </div>
              </div>
            </div>

            {/* Bottom section: Details */}
            <div className="relative z-10 flex justify-between items-end mt-4">
              <div className="space-y-1">
                <div className="text-[10px] sm:text-xs text-white/50 font-mono uppercase tracking-[0.3em]">Network Access</div>
                <div className="text-white text-sm sm:text-xl font-mono tracking-[0.2em] font-light">
                  GLOBAL <span className="text-yellow-400 font-bold">LIFETIME</span> MEMBER
                </div>
              </div>
              <div className="text-right space-y-1 hidden sm:block">
                <div className="text-[10px] text-white/50 font-mono uppercase tracking-[0.3em]">EST.</div>
                <div className="text-white text-lg font-mono tracking-widest">1984</div>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Benefits text below */}
        <div className="max-w-3xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Users, title: 'Elite Network', desc: 'Connect with industry leaders and global alumni.' },
            { icon: Award, title: 'Career Growth', desc: 'Exclusive access to mentorship and job referrals.' },
            { icon: Sparkles, title: 'Special Events', desc: 'Priority access to premium technical bootcamps.' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-nexus-surface/40 border border-nexus-border">
              <item.icon className="w-6 h-6 text-yellow-400 mb-3" />
              <div className="text-white font-bold text-sm font-mono mb-1">{item.title}</div>
              <div className="text-nexus-text-dim text-xs font-mono">{item.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
