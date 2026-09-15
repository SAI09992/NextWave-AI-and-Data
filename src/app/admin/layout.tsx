'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ShieldAlert, Terminal, Lock, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (status === 'loading') {
    return (
      <div className="flex-1 flex items-center justify-center p-4 min-h-screen bg-cyber-bg">
        <div className="font-mono text-cyan-400 text-sm flex items-center gap-3">
          <span className="w-5 h-5 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <span>AUTHENTICATING NEXTWAVE ADMIN ACCESS...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 min-h-screen bg-cyber-bg">
        <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-red-500/40 text-center space-y-6 shadow-xl">
          <Lock className="w-12 h-12 text-red-400 mx-auto drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <div>
            <h2 className="text-xl font-bold font-sans text-white tracking-wide">
              ADMINISTRATIVE ACCESS RESTRICTED
            </h2>
            <p className="text-sm font-sans text-gray-400 mt-2 leading-relaxed">
              NextWave Command Center requires authenticated administrative credentials.
            </p>
          </div>
          <Link href="/login?callbackUrl=/admin" className="block">
            <button className="w-full flex items-center justify-center py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-500/20">
              SIGN IN AS ADMINISTRATOR
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const isAdmin = (session.user as any)?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 min-h-screen bg-cyber-bg">
        <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-red-500/40 text-center space-y-6 shadow-xl">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <div>
            <h2 className="text-xl font-bold font-sans text-white tracking-wide">
              UNAUTHORIZED ROLE
            </h2>
            <p className="text-sm font-sans text-gray-400 mt-2 leading-relaxed">
              Your account ({session?.user?.email || 'authenticated user'}) has role "participant". Only authorized NextWave Administrators can access this command layer.
            </p>
          </div>
          <div className="space-y-3">
            <Link href="/portal" className="block">
              <button className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-500/20">
                GO TO PARTICIPANT PORTAL
              </button>
            </Link>
            <Link href="/login" className="block">
              <button className="w-full py-3 rounded-xl bg-transparent border border-gray-700 hover:border-gray-500 hover:bg-gray-800 text-gray-300 font-bold transition-all text-sm">
                SWITCH TO ADMIN DEV ACCOUNT
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cyber-bg text-white font-sans">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto w-full relative">
        <div className="md:hidden p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/95 backdrop-blur-md sticky top-0 z-40">
          <Link href="/admin" className="font-bold text-cyan-400 font-sans tracking-wide text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>NEXTWAVE_ADMIN</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
        <div className="p-4 md:p-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
