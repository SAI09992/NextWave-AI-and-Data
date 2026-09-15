'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Zap } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function RegistrationCtaSection() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'admin';

  return (
    <section className="py-24 sm:py-32 relative border-t border-gray-800/60 bg-transparent overflow-hidden flex items-center justify-center min-h-[60vh]">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto rounded-3xl bg-gray-900/60 backdrop-blur-xl border border-yellow-500/30 p-10 sm:p-16 text-center space-y-8 shadow-[0_0_50px_rgba(255,215,0,0.1)] relative overflow-hidden"
        >
          {/* Inner ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-red-500/5" />

          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl sm:text-6xl font-black font-sans text-white tracking-tight">
              READY TO BUILD THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">FUTURE?</span>
            </h2>
            <p className="text-lg text-gray-400 font-sans max-w-2xl mx-auto">
              Join the brightest minds. Deploy real AI agents. Master data engineering.
            </p>
          </div>

          <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href={session ? (isAdmin ? '/admin' : '/portal') : '/register'}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-yellow-600 text-white rounded-xl font-bold font-sans text-lg overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.3)] w-full sm:w-auto"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Zap className="w-5 h-5 relative z-10 group-hover:animate-bounce" />
                <span className="relative z-10">{session ? (isAdmin ? 'ADMIN DASHBOARD' : 'PARTICIPANT PORTAL') : 'REGISTER NOW'}</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            {!session && (
              <Link href="/login">
                <button className="flex items-center justify-center gap-2 px-10 py-5 bg-transparent border border-gray-700 hover:border-gray-500 hover:bg-gray-800 text-white rounded-xl font-bold font-sans text-lg transition-all w-full sm:w-auto">
                  <Terminal className="w-5 h-5" />
                  <span>LOGIN</span>
                </button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
