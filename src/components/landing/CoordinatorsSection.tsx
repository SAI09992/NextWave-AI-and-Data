'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, Code, Shield, MessageSquare, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function CoordinatorsSection() {
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoordinators() {
      try {
        const res = await fetch('/api/event-stats');
        const data = await res.json();
        if (data.success && data.stats?.coordinators) {
          setCoordinators(data.stats.coordinators);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCoordinators();
  }, []);

  return (
    <section id="contact" className="py-16 sm:py-24 relative border-t border-gray-800/60 bg-transparent">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-950/40 border border-yellow-500/30 text-yellow-400 text-xs font-mono shadow-[0_0_10px_rgba(255,215,0,0.1)]">
            <Users className="w-3.5 h-3.5" />
            <span>// 13. STUDENT COORDINATORS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-sans text-white">
            CONTACT <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">COORDINATORS</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 font-sans max-w-2xl mx-auto">
            Need help with registration, payments, or have questions about the curriculum? Reach out to our leads.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {coordinators.map((person, idx) => {
              const Icon = idx % 2 === 0 ? Code : Shield;
              const waLink = person.whatsappUrl || `https://wa.me/${person.phone.replace(/[^0-9]/g, '')}`;
              const callLink = person.callUrl || `tel:${person.phone.replace(/[^0-9+]/g, '')}`;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="p-6 sm:p-8 rounded-3xl bg-gray-900/50 backdrop-blur-md border border-gray-800 hover:border-yellow-500/40 transition-all shadow-xl group flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center group-hover:border-yellow-500 transition-colors shadow-lg relative overflow-hidden">
                     <Icon className="w-8 h-8 text-yellow-400" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-bold font-mono tracking-widest text-yellow-500 uppercase">
                      {person.role}
                    </div>
                    <h3 className="text-xl font-bold font-sans text-white">
                      {person.name}
                    </h3>
                    {person.department && (
                      <div className="text-[11px] text-gray-500 font-mono mt-1">
                        {person.department}
                      </div>
                    )}
                  </div>

                  <div className="w-full h-px bg-gray-800" />

                  <div className="space-y-3 w-full">
                    <a
                      href={callLink}
                      className="flex items-center justify-center gap-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-gray-400 hover:text-white hover:border-yellow-500/30 transition-colors font-mono text-sm"
                    >
                      <Phone className="w-4 h-4 text-orange-400" />
                      <span>{person.phone}</span>
                    </a>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-gray-400 hover:text-white hover:border-green-500/30 transition-colors font-mono text-sm"
                    >
                      <MessageSquare className="w-4 h-4 text-green-400" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
