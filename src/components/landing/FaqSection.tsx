'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'Do I need prior experience with AI or LLMs?',
    a: "You do not need prior experience training models, and there is no need for prior knowledge of Python or JavaScript. A strong passion for AI and an eagerness to learn is all you need.",
  },
  {
    q: 'What should I bring to the bootcamp?',
    a: 'Bring your own laptop (Windows, Mac, or Linux) and its charger. All compute-heavy tasks will run in the cloud or via APIs, so a high-end GPU is not strictly necessary.',
  },
  {
    q: 'Is this event only for specific departments?',
    a: 'No. This event is open to all 2nd, 3rd and 4th-year engineering students from any department (CSE, IT, ECE, EEE, Mech, Civil) who are passionate about AI.',
  },
  {
    q: 'Will food and accommodation be provided?',
    a: 'Only snacks will be provided on both days. Lunch and accommodation are NOT provided. If you are a hosteller, please provide your hostel details during registration.',
  },
  {
    q: 'What happens if my payment fails or is rejected?',
    a: 'If your payment fails or the screenshot is rejected during verification, you will be notified on your cadet portal to retry. Your seat is only confirmed upon admin verification.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-24 relative border-t border-gray-800/60 bg-transparent">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono shadow-[0_0_10px_rgba(0,229,255,0.1)]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>// 12. FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-sans text-white">
            HAVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">QUESTIONS?</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className={cn(
                  'rounded-2xl border transition-all duration-300 overflow-hidden',
                  isOpen ? 'bg-gray-900 border-cyan-500/50 shadow-[0_0_15px_rgba(0,229,255,0.1)]' : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                )}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className={cn('font-bold font-sans text-base sm:text-lg transition-colors', isOpen ? 'text-white' : 'text-gray-300')}>
                    {faq.q}
                  </span>
                  <div className={cn('p-1 rounded-full transition-colors', isOpen ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-400')}>
                    <ChevronDown className={cn('w-5 h-5 transition-transform duration-300', isOpen && 'rotate-180')} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-sm sm:text-base text-gray-400 font-sans leading-relaxed border-t border-gray-800/50 mt-2 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
