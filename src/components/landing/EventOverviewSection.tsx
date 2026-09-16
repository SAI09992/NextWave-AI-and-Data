'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Database, Users, Sparkles, Terminal } from 'lucide-react';
import { useEventSettings } from '@/components/providers/EventSettingsProvider';

const overviewPoints = [
  {
    icon: BrainCircuit,
    title: 'WHAT IS IT?',
    desc: 'An intensive 2-day immersive bootcamp focused on the frontiers of Artificial Intelligence, Large Language Models, and Data Engineering architectures.',
  },
  {
    icon: Database,
    title: 'WHY THIS WORKSHOP?',
    desc: 'Move beyond theory. Get direct keyboard access to build real AI agents, orchestrate data pipelines, and train machine learning models in live lab environments.',
  },
  {
    icon: Users,
    title: 'WHO IS IT FOR?',
    desc: 'All 2nd, 3rd and 4th year engineering students across all departments — CSE, IT, ECE, EEE, Mech, Civil, and allied branches with a passion for AI.',
  },
  {
    icon: Sparkles,
    title: 'WHAT YOU WILL EXPERIENCE',
    desc: 'Hands-on AI integration, vector database deployments, prompt engineering tactics, and a competitive hackathon-style Capstone project.',
  },
];

export default function EventQuickInfo() {
  const { eventName } = useEventSettings();

  return (
    <section id="overview" className="py-16 sm:py-24 relative border-t border-gray-800/60 bg-transparent">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-950/40 border border-yellow-500/30 text-yellow-400 text-xs font-mono shadow-[0_0_10px_rgba(255,215,0,0.1)]">
            <Terminal className="w-3.5 h-3.5" />
            <span>// 02. EXECUTIVE BRIEFING & OVERVIEW</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-sans text-white tracking-tight">
            WHAT IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 uppercase">{eventName}?</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 font-sans max-w-2xl mx-auto">
            Core objectives, student target audience, and the operational bootcamp mission.
          </p>
        </div>

        {/* 4 Overview Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {overviewPoints.map((point, idx) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 space-y-4 shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-yellow-950/50 border border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-sans text-white tracking-wide">
                    {point.title}
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-gray-400 font-sans leading-relaxed">
                  {point.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
