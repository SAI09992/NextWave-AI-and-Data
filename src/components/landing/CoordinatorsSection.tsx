'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Code, Shield } from 'lucide-react';
import Image from 'next/image';

const coordinators = [
  {
    role: 'Lead AI Engineer',
    name: 'Alex Mercer',
    phone: '+91 98765 43210',
    email: 'alex@nextwave.ai',
    icon: Code,
  },
  {
    role: 'Data Systems Architect',
    name: 'Sarah Connor',
    phone: '+91 87654 32109',
    email: 'sarah@nextwave.ai',
    icon: Shield,
  },
];

export default function CoordinatorsSection() {
  return (
    <section id="contact" className="py-16 sm:py-24 relative border-t border-gray-800/60 bg-transparent">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono shadow-[0_0_10px_rgba(0,229,255,0.1)]">
            <Users className="w-3.5 h-3.5" />
            <span>// 13. STUDENT COORDINATORS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-sans text-white">
            CONTACT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">COORDINATORS</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 font-sans max-w-2xl mx-auto">
            Need help with registration, payments, or have questions about the curriculum? Reach out to our leads.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {coordinators.map((person, idx) => {
            const Icon = person.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="p-6 sm:p-8 rounded-3xl bg-gray-900/50 backdrop-blur-md border border-gray-800 hover:border-cyan-500/40 transition-all shadow-xl group flex flex-col items-center text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center group-hover:border-cyan-500 transition-colors shadow-lg relative overflow-hidden">
                   <Icon className="w-8 h-8 text-cyan-400" />
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold font-mono tracking-widest text-cyan-500 uppercase">
                    {person.role}
                  </div>
                  <h3 className="text-xl font-bold font-sans text-white">
                    {person.name}
                  </h3>
                </div>

                <div className="w-full h-px bg-gray-800" />

                <div className="space-y-3 w-full">
                  <a
                    href={`tel:${person.phone.replace(/\\s/g, '')}`}
                    className="flex items-center justify-center gap-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/30 transition-colors font-mono text-sm"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>{person.phone}</span>
                  </a>
                  <a
                    href={`mailto:${person.email}`}
                    className="flex items-center justify-center gap-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/30 transition-colors font-mono text-sm"
                  >
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>{person.email}</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
