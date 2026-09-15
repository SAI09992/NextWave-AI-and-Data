'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { NexusButton as Button } from '@/components/ui/NexusButton';
import { Menu, X, Terminal, LayoutDashboard, LogOut, ArrowRight, LogIn } from 'lucide-react';

export default function NextWaveNavbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = (session?.user as any)?.role === 'admin';

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Experience', href: '#experience' },
    { label: 'Timeline', href: '#timeline' },
    { label: 'Eligibility', href: '#eligibility' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-cyber-bg/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Section 1: Logo */}
        <BrandLogo variant="navbar" />

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-8 text-sm font-sans font-medium text-gray-400 tracking-wide">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-cyan-400 transition-colors py-1 relative group"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-2">
              <Link href={isAdmin ? '/admin' : '/portal'} prefetch={true}>
                <Button size="sm" variant="secondary" className="gap-2 bg-gray-800 hover:bg-gray-700 text-white border-gray-700">
                  {isAdmin ? <LayoutDashboard className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isAdmin ? 'ADMIN DASHBOARD' : 'PARTICIPANT PORTAL'}</span>
                </Button>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                title="Sign Out"
                className="p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" prefetch={true}>
                <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white font-sans text-sm font-semibold transition-all">
                  <LogIn className="w-4 h-4" />
                  <span>LOGIN</span>
                </button>
              </Link>
              <Link href="/register" prefetch={true}>
                <Button size="sm" variant="primary" glow className="gap-2 px-5 py-2.5 text-sm bg-cyan-600 hover:bg-cyan-500 text-white">
                  <span>REGISTER NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden border-b border-gray-800 bg-gray-900/95 backdrop-blur-2xl px-5 py-6 space-y-5"
          >
            <nav className="flex flex-col gap-3 font-sans font-medium text-lg">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            {!session && (
              <div className="pt-4 border-t border-gray-800">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gray-800 text-white font-semibold">
                    <LogIn className="w-5 h-5" />
                    <span>LOGIN</span>
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
