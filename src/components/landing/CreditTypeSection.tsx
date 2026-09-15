'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Code, Rocket, CheckCircle2 } from 'lucide-react';

export default function EligibilitySection() {
  return (
    <section id="eligibility" className="py-16 sm:py-24 relative border-t border-gray-800/60 bg-transparent">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-950/40 border border-yellow-500/30 text-yellow-400 text-xs font-mono shadow-[0_0_10px_rgba(255,215,0,0.1)]">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>// 08. WHO CAN APPLY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-sans text-white">
            WHO CAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">APPLY?</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 font-sans max-w-2xl mx-auto">
            This bootcamp is highly technical and requires a foundational understanding of programming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Box 1: Eligibility */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-gray-900/50 backdrop-blur-md border border-gray-800 hover:border-yellow-500/30 transition-all shadow-xl flex flex-col h-full"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-yellow-950/40 border border-yellow-500/30 text-yellow-400">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-sans text-white">Pre-Requisites</h3>
            </div>
            
            <ul className="space-y-4 flex-1">
              {[
                '2nd, 3rd or 4th Year Engineering Student (Any Dept)',
                'A strong passion for Artificial Intelligence & Data Science',
                'Enthusiasm to build next-gen AI applications',
                'Bring your own laptop (Windows, Mac, or Linux)'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-sans">
                  <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Box 2: What you walk away with */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-gray-900/50 backdrop-blur-md border border-gray-800 hover:border-red-500/30 transition-all shadow-xl flex flex-col h-full relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -z-10" />

            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-sans text-white">Outcomes</h3>
            </div>

            <ul className="space-y-4 flex-1">
              {[
                'Certificate of Excellence from NextWave AI',
                'A deployed full-stack AI application for your resume',
                'Access to the NextWave Alumni Discord Server',
                'Hands-on experience with Pinecone, LangChain, and LLMs',
                'Credits: Program Elective (PE) for CSE & IT; University Elective (UE) for others'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-sans">
                  <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
