'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, MapPin, User, ArrowRight } from 'lucide-react';

const scheduleData = {
  day1: [
    {
      time: '09:00 AM – 10:30 AM',
      title: 'Inauguration & Keynote: The AI Revolution',
      desc: 'Exploring the state of artificial intelligence, future trajectories, and why AI engineering is the next frontier.',
      speaker: 'Chief Guest & Organizing Committee',
    },
    {
      time: '10:45 AM – 01:00 PM',
      title: 'Deep Dive into Transformers & LLMs',
      desc: 'Understanding the underlying mechanics of GPT-style models. Tokenization, attention mechanisms, and context manipulation.',
      speaker: 'NextWave Lead Instructor',
    },
    {
      time: '02:00 PM – 05:00 PM',
      title: 'Building Data Pipelines & Vector Databases',
      desc: 'Hands-on session: Converting documents to embeddings and setting up vector searches using Pinecone.',
      speaker: 'NextWave Data Engineering Team',
    },
  ],
  day2: [
    {
      time: '09:00 AM – 12:30 PM',
      title: 'RAG Systems & Agentic Workflows',
      desc: 'Connecting LLMs to external data sources. Building your first autonomous agent with LangChain.',
      speaker: 'NextWave AI Architects',
    },
    {
      time: '01:30 PM – 04:30 PM',
      title: 'NextWave Hackathon: Build & Deploy',
      desc: 'Team-based challenge. Deploy a full-stack AI application integrating LLMs, vector DBs, and custom prompts.',
      speaker: 'Mentors & Judges',
    },
    {
      time: '04:30 PM – 05:30 PM',
      title: 'Awards Ceremony & Networking',
      desc: 'Presentation of winning projects, certificate distribution, and closing remarks.',
      speaker: 'Organizing Committee',
    },
  ],
};

export default function TimelineSection() {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1');

  return (
    <section id="timeline" className="py-16 sm:py-24 relative border-t border-gray-800/60 bg-transparent">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-950/40 border border-yellow-500/30 text-yellow-400 text-xs font-mono shadow-[0_0_10px_rgba(255,215,0,0.1)]">
            <Calendar className="w-3.5 h-3.5" />
            <span>// 07. EVENT TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-sans text-white">
            2-DAY <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">CURRICULUM</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-sans text-gray-400 pt-2">
            <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
              <Calendar className="w-4 h-4" /> October 3 – 4, 2026
            </span>
            <span className="hidden sm:inline text-gray-600">•</span>
            <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
              <MapPin className="w-4 h-4" /> Dr. V. Vasudevan Seminar Hall, TIFAC CORE
            </span>
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-gray-900 border border-gray-800 font-sans text-sm font-bold shadow-lg">
            <button
              onClick={() => setActiveDay('day1')}
              className={`px-8 py-3 rounded-xl transition-all ${
                activeDay === 'day1'
                  ? 'bg-yellow-600 text-white shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              DAY 1 : FOUNDATIONS & DATA
            </button>
            <button
              onClick={() => setActiveDay('day2')}
              className={`px-8 py-3 rounded-xl transition-all ${
                activeDay === 'day2'
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              DAY 2 : AGENTS & HACKATHON
            </button>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {scheduleData[activeDay].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="p-6 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-yellow-500/40 transition-colors flex flex-col sm:flex-row items-start gap-6 group"
                >
                  <div className="sm:w-48 shrink-0 font-mono text-sm font-bold text-yellow-400 flex items-center gap-2 bg-gray-950 px-4 py-2 rounded-lg border border-gray-800 group-hover:border-yellow-900 transition-colors shadow-inner">
                    <Clock className="w-4 h-4 shrink-0 text-yellow-600" />
                    <span>{item.time}</span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <h4 className="text-lg font-bold font-sans text-white group-hover:text-yellow-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                    <div className="text-xs font-mono text-gray-500 flex items-center gap-1.5 pt-2">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="uppercase">{item.speaker}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
