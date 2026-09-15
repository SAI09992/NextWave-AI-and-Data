'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  ShieldAlert,
  Terminal,
  Search,
  Radar,
  Flame,
  Award,
  UserCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const highlights = [
  { icon: Cpu, text: 'Hands-on Labs', desc: 'Direct terminal access to cloud range' },
  { icon: ShieldAlert, text: 'Real-world Scenarios', desc: 'Simulated enterprise ransomware incidents' },
  { icon: Terminal, text: 'SOC Toolchains', desc: 'Splunk, Wireshark, Volatility, Zeek' },
  { icon: Search, text: 'Practical Investigation', desc: 'Reconstruct attack timelines from PCAPs' },
  { icon: Radar, text: 'Threat Detection', desc: 'Live alert rule engineering and tuning' },
  { icon: Flame, text: 'Incident Containment', desc: 'Host isolation & lateral movement halting' },
  { icon: UserCheck, text: 'Expert Guidance', desc: 'Mentored by senior security architects' },
  { icon: Award, text: 'QR Certification', desc: 'Cryptographically verified completion badge' },
];

export default function HighlightsSection() {
  return (
    <section id="highlights" className="py-16 sm:py-20 relative bg-transparent border-t border-nexus-border/60">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-nexus-primary/40 text-nexus-primary text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>// 06. CORE ADVANTAGES & HIGHLIGHTS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-nexus-text">
            WORKSHOP HIGHLIGHTS
          </h2>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {highlights.map((h, idx) => {
            const Icon = h.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
                className="p-4 rounded-xl nexus-glass border border-nexus-border hover:border-nexus-primary/50 transition-all font-mono space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-nexus-primary shrink-0" />
                  <span className="text-xs font-bold text-nexus-text truncate">{h.text}</span>
                </div>
                <p className="text-[11px] text-nexus-text-muted truncate">{h.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
