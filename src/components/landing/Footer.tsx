'use client';

import React from 'react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black/40 backdrop-blur-md border-t border-gray-800 pt-16 pb-8 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-6">
            <BrandLogo variant="footer" />
            <p className="text-sm text-gray-500 font-sans max-w-sm leading-relaxed">
              NextWave AI and Data is a premier technology bootcamp focused on Artificial Intelligence, LLMs, and Data Engineering architectures.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold font-mono text-white tracking-widest uppercase">Platform</h4>
            <ul className="space-y-3 text-sm font-sans text-gray-400">
              <li>
                <Link href="/login" className="hover:text-cyan-400 transition-colors">Cadet Login</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-cyan-400 transition-colors">Registration</Link>
              </li>
              <li>
                <a href="#overview" className="hover:text-cyan-400 transition-colors">Curriculum</a>
              </li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold font-mono text-white tracking-widest uppercase">Legal</h4>
            <ul className="space-y-3 text-sm font-sans text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <a href="mailto:contact@nextwave.ai" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  contact@nextwave.ai
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-600">
          <p>© {currentYear} NextWave AI & Data. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed for the <span className="text-cyan-600 font-bold">Future</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
