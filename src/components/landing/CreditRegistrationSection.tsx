'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { NexusButton as Button } from '@/components/ui/NexusButton';

export default function CreditRegistrationSection() {
  const highlights = [
    'Full 2-Day AI & Data Hands-on Lab Access',
    'Transformer Architecture & LLM Training',
    'Data Pipeline Construction',
    'Participation Certificate on Completion',
    'Course Credit Eligibility (PE for CSE/IT / UE for Others)'
  ];

  return (
    <section id="registration" className="py-16 sm:py-24 relative bg-transparent border-t border-nexus-border/60">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-950/60 border border-nexus-primary/40 text-nexus-primary text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>// 04. CREDIT & REGISTRATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-nexus-text uppercase">
            Credit & Department Info
          </h2>
          <p className="text-sm sm:text-base text-nexus-text-muted font-mono">
            Course credit details and registration information. Content will be updated as finalized.
          </p>
        </div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto p-1 rounded-2xl bg-gradient-to-br from-nexus-primary/20 via-transparent to-indigo-500/20"
        >
          <div className="p-6 sm:p-10 rounded-2xl bg-[#030712]/90 backdrop-blur-xl border border-nexus-border">
            
            {/* Top tags */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="px-3 py-1 rounded border border-nexus-primary text-nexus-primary font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <Check className="w-3 h-3" />
                AI & DATA WORKSHOP
              </div>
              <div className="px-3 py-1 rounded border border-nexus-border text-nexus-text-dim font-mono text-[10px] uppercase tracking-widest">
                200 TOTAL SLOTS
              </div>
              <div className="px-3 py-1 rounded border border-nexus-border text-nexus-text-dim font-mono text-[10px] uppercase tracking-widest">
                ALL DEPARTMENTS
              </div>
            </div>

            {/* Title & Price */}
            <div className="space-y-4 mb-10">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-white tracking-tight uppercase">
                NextWave AI And Data
              </h3>
              <p className="text-nexus-text-muted font-mono text-sm">
                Open to all 2nd, 3rd & 4th year students across all departments.
              </p>
              <div className="flex items-end gap-3 text-yellow-400 pt-2">
                <span className="text-6xl sm:text-7xl font-black font-sans leading-none tracking-tighter">₹200</span>
                <span className="text-nexus-text-dim font-mono text-sm mb-2">/ registration fee</span>
              </div>
            </div>

            {/* Credit Info Box */}
            <div className="p-6 rounded-xl bg-nexus-surface border border-nexus-border mb-10">
              <div className="text-[10px] text-yellow-400 font-bold font-mono uppercase tracking-widest mb-4">
                Credit Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-nexus-text-muted">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <div><span className="text-white font-bold">CSE & IT Students:</span> Program Elective (PE) Credit</div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <div><span className="text-white font-bold">All Others:</span> University Elective (UE) Credit</div>
                </div>
                <div className="flex items-start gap-2 col-span-1 md:col-span-2 mt-2 pt-4 border-t border-nexus-border/50">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <div><span className="text-white font-bold">Subject:</span> Artificial Intelligence / Data Science</div>
                </div>
              </div>
            </div>

            {/* Checkmarks list */}
            <div className="space-y-3 mb-10">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 font-mono text-sm text-nexus-text-muted">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link href="/register" className="block w-full">
              <Button variant="primary" glow className="w-full h-14 text-sm sm:text-base font-bold font-mono tracking-wider flex items-center justify-center gap-3">
                <span>REGISTER NOW — ₹200</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
