'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Users, RefreshCw } from 'lucide-react';

export default function LiveSlotTracker() {
  const [stats, setStats] = useState({
    totalRegistered: 0,
    totalCapacity: 200,
    paymentsVerified: 0,
    paymentsPending: 0,
    registrationOpen: true,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/event-stats');
      const data = await res.json();
      if (data.success && data.stats) {
        setStats({
          totalRegistered: data.stats.totalRegistered || 0,
          totalCapacity: data.stats.totalCapacity || 200,
          paymentsVerified: data.stats.paymentsVerified || 0,
          paymentsPending: data.stats.paymentsPending || 0,
          registrationOpen: data.stats.registrationOpen ?? true,
        });
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error('Failed to fetch event stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchStats();

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime');
      eventSource.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.event === 'registration:countUpdated') {
            fetchStats();
          }
        } catch (err) {
          // ignore heartbeat
        }
      };
    } catch (err) {
      console.warn('Realtime SSE unavailable');
    }

    const interval = setInterval(fetchStats, 30000);

    return () => {
      clearInterval(interval);
      if (eventSource) eventSource.close();
    };
  }, []);

  const totalPercent = Math.min(
    100,
    Math.round((stats.totalRegistered / (stats.totalCapacity || 200)) * 100)
  );

  const remaining = Math.max(0, stats.totalCapacity - stats.totalRegistered);

  return (
    <section id="seats" className="py-16 sm:py-24 relative bg-gray-900/40 border-t border-gray-800/60">
      <div className="container mx-auto px-4 relative z-10">
        <div className="w-full max-w-3xl mx-auto bg-gray-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-yellow-500/30 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-950/40 border border-yellow-500/30 text-yellow-400">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-yellow-500 uppercase tracking-widest mb-1">
                  // 01. LIVE METRICS
                </div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg sm:text-xl font-bold font-sans tracking-wide text-white">
                    LIVE REGISTRATION STATUS
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      !stats.registrationOpen || stats.totalRegistered >= stats.totalCapacity
                        ? 'bg-red-950/50 border border-red-500/40 text-red-400'
                        : 'bg-orange-950/50 border border-orange-500/40 text-orange-400'
                    }`}
                  >
                    {!stats.registrationOpen || stats.totalRegistered >= stats.totalCapacity ? 'CLOSED' : 'OPEN'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={fetchStats}
              title="Refresh telemetry"
              className="flex items-center gap-2 text-xs font-mono text-yellow-400/80 hover:text-yellow-400 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 hover:border-yellow-500/50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>SYNC NOW</span>
            </button>
          </div>

          {/* Main Total Progress Gauge */}
          <div className="mt-10 space-y-4">
            <div className="flex items-end justify-between font-mono">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-5 h-5 text-yellow-500" />
                <span>TOTAL SEATS</span>
              </div>
              <div className="text-right">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {stats.totalRegistered}
                </span>
                <span className="text-base text-gray-500 ml-1">/ {stats.totalCapacity} Filled</span>
                <span className="ml-3 text-sm font-bold text-orange-400">({totalPercent}%)</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-4 w-full rounded-full bg-gray-950 border border-gray-800 overflow-hidden p-0.5 relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalPercent}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute left-0 top-0 bottom-0 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-orange-400 shadow-[0_0_15px_rgba(255,215,0,0.5)]"
              />
            </div>

            {/* Remaining Seats */}
            <div className="flex justify-between text-xs font-mono text-gray-400 pt-2">
              <span>Registration Fee: ₹250</span>
              <span className="text-yellow-400 font-bold">{remaining} seats remaining</span>
            </div>
          </div>

          {/* Last Updated */}
          <div
            suppressHydrationWarning
            className="mt-8 pt-4 border-t border-gray-800 text-[11px] font-mono text-gray-500 text-center"
          >
            {mounted ? `Last synced: ${lastUpdated.toLocaleTimeString()}` : 'Syncing live telemetry...'}
          </div>
        </div>
      </div>
    </section>
  );
}
