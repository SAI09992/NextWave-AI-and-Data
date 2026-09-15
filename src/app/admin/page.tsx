'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MetricCard } from '@/components/ui/MetricCard';
import { LiveStats } from '@/types';
import {
  Users,
  Clock,
  QrCode,
  Activity,
  Radio,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface ActivityItem {
  id: string;
  text: string;
  type: 'reg' | 'pay_sub' | 'pay_ver' | 'att';
  timestamp: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<LiveStats>({
    totalRegistered: 0,
    totalCapacity: 200,
    paymentsVerified: 0,
    paymentsPending: 0,
    day1Attendance: 0,
    day2Attendance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/event-stats');
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Subscribe to Realtime SSE
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime');
      eventSource.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.event === 'registration:countUpdated') {
            fetchStats();
            setActivities((prev) => [
              {
                id: String(Date.now()),
                text: 'New participant registered',
                type: 'reg',
                timestamp: 'Just now',
              },
              ...prev.slice(0, 10),
            ]);
          } else if (payload.event === 'payment:statusUpdated') {
            fetchStats();
            setActivities((prev) => [
              {
                id: String(Date.now()),
                text: `Payment ${payload.data.status} — ${payload.data.participantName || payload.data.registrationId}`,
                type: payload.data.status === 'verified' ? 'pay_ver' : 'pay_sub',
                timestamp: 'Just now',
              },
              ...prev.slice(0, 10),
            ]);
          }
        } catch (err) {
          // ignore
        }
      };
    } catch (err) {
      console.warn(err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  return (
    <div className="space-y-8 font-sans text-sm max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold tracking-wide flex items-center gap-2">
            NEXTWAVE COMMAND CENTER
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-mono uppercase">
            OPERATIONAL OVERVIEW & REAL-TIME EVENT TELEMETRY
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-yellow-400 font-mono text-xs shadow-lg">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>SYSTEM ONLINE</span>
          </div>
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors shadow-lg"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="TOTAL REGISTRATIONS"
          value={`${stats.totalRegistered} / ${stats.totalCapacity}`}
          subtitle={`${stats.totalCapacity - stats.totalRegistered} seats remaining`}
          icon={Users}
          variant="cyan"
        />

        <MetricCard
          title="PAYMENTS VERIFIED"
          value={stats.paymentsVerified}
          subtitle="Bank settled transactions"
          icon={ShieldCheck}
          variant="emerald"
        />

        <MetricCard
          title="PAYMENTS PENDING"
          value={stats.paymentsPending}
          subtitle="Awaiting admin inspection"
          icon={Clock}
          variant="amber"
        />

        <MetricCard
          title="DAY 1 / DAY 2 ATTENDANCE"
          value={`${stats.day1Attendance} | ${stats.day2Attendance}`}
          subtitle="QR scanned participants"
          icon={QrCode}
          variant="cyan"
        />
      </div>

      {/* Quick Action & Live Activity Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Action Panels */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-gray-900/50 backdrop-blur-md border border-gray-800 space-y-6 shadow-xl">
            <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Activity className="w-5 h-5" />
              <span>COMMAND ACTIONS & SHORTCUTS</span>
            </h3>

            {/* Live Quick Slot Controller Widget */}
            <div className="p-5 rounded-xl bg-gray-950 border border-gray-800 space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-xs flex items-center gap-2 text-white">
                  <Users className="w-4 h-4 text-yellow-400" /> LIVE BOOTCAMP CAPACITY CONTROL
                </span>
                <span className="text-[11px] text-gray-500 font-mono">
                  TOTAL: <strong className="text-yellow-400 text-sm font-bold">{stats.totalCapacity} SLOTS</strong>
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      const newCap = Math.max(1, stats.totalCapacity - 10);
                      setStats((prev) => ({ ...prev, totalCapacity: newCap }));
                      await fetch('/api/admin/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ totalCapacity: newCap }),
                      });
                      toast.success(`Capacity reduced to ${newCap} slots`);
                    }}
                    className="px-3 py-2 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 font-bold hover:bg-red-900/60 transition-colors text-xs font-mono"
                  >
                    -10 Slots
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const newCap = Math.max(1, stats.totalCapacity - 1);
                      setStats((prev) => ({ ...prev, totalCapacity: newCap }));
                      await fetch('/api/admin/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ totalCapacity: newCap }),
                      });
                      toast.success(`Capacity reduced to ${newCap} slots`);
                    }}
                    className="px-3 py-2 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 font-bold hover:bg-red-900/60 transition-colors text-xs font-mono"
                  >
                    -1 Slot
                  </button>

                  <div className="h-6 w-px bg-gray-700 mx-2" />

                  <button
                    type="button"
                    onClick={async () => {
                      const newCap = stats.totalCapacity + 1;
                      setStats((prev) => ({ ...prev, totalCapacity: newCap }));
                      await fetch('/api/admin/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ totalCapacity: newCap }),
                      });
                      toast.success(`Capacity increased to ${newCap} slots`);
                    }}
                    className="px-3 py-2 rounded-lg bg-orange-950/40 border border-orange-500/40 text-orange-400 font-bold hover:bg-orange-900/60 transition-colors text-xs font-mono"
                  >
                    +1 Slot
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const newCap = stats.totalCapacity + 10;
                      setStats((prev) => ({ ...prev, totalCapacity: newCap }));
                      await fetch('/api/admin/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ totalCapacity: newCap }),
                      });
                      toast.success(`Capacity increased to ${newCap} slots`);
                    }}
                    className="px-3 py-2 rounded-lg bg-orange-950/40 border border-orange-500/40 text-orange-400 font-bold hover:bg-orange-900/60 transition-colors text-xs font-mono"
                  >
                    +10 Slots
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const newCap = stats.totalCapacity + 50;
                      setStats((prev) => ({ ...prev, totalCapacity: newCap }));
                      await fetch('/api/admin/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ totalCapacity: newCap }),
                      });
                      toast.success(`Capacity increased to ${newCap} slots`);
                    }}
                    className="px-3 py-2 rounded-lg bg-orange-950/40 border border-orange-500/40 text-orange-400 font-bold hover:bg-orange-900/60 transition-colors text-xs font-mono"
                  >
                    +50 Slots
                  </button>
                </div>

                <Link
                  href="/admin/settings"
                  className="text-xs text-yellow-400 hover:text-yellow-300 font-bold font-mono transition-colors"
                >
                  Manage All Settings →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/admin/payments" className="block">
                <div className="p-5 rounded-xl bg-gray-950 hover:bg-gray-900 border border-yellow-500/30 hover:border-yellow-500/60 transition-all space-y-2 h-full shadow-lg">
                  <div className="flex items-center justify-between text-yellow-400 font-bold font-mono">
                    <span>INSPECT PAYMENTS</span>
                    <span className="px-2.5 py-1 rounded bg-amber-950/60 text-amber-400 text-[10px]">
                      {stats.paymentsPending} PENDING
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Review OCR analysis & match bank records
                  </p>
                </div>
              </Link>

              <Link href="/admin/attendance" className="block">
                <div className="p-5 rounded-xl bg-gray-950 hover:bg-gray-900 border border-orange-500/30 hover:border-orange-500/60 transition-all space-y-2 h-full shadow-lg">
                  <div className="flex items-center justify-between text-orange-400 font-bold font-mono">
                    <span>ATTENDANCE</span>
                    <QrCode className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500">
                    QR distribution & manual attendance roster
                  </p>
                </div>
              </Link>

              <Link href="/admin/registrations" className="block">
                <div className="p-5 rounded-xl bg-gray-950 hover:bg-gray-900 border border-red-500/30 hover:border-red-500/60 transition-all space-y-2 h-full shadow-lg">
                  <div className="flex items-center justify-between text-red-400 font-bold font-mono">
                    <span>PARTICIPANT ROSTER</span>
                    <Users className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Filter by dept & export CSV data
                  </p>
                </div>
              </Link>

              <Link href="/admin/announcements" className="block">
                <div className="p-5 rounded-xl bg-gray-950 hover:bg-gray-900 border border-purple-500/30 hover:border-purple-500/60 transition-all space-y-2 h-full shadow-lg">
                  <div className="flex items-center justify-between text-purple-400 font-bold font-mono">
                    <span>BROADCAST ALERTS</span>
                    <Radio className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Send real-time alerts to participants
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-2xl bg-gray-900/50 backdrop-blur-md border border-gray-800 space-y-4 h-full flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2 font-mono">
                  <Radio className="w-4 h-4 text-orange-400 animate-pulse" />
                  <span>LIVE ADMIN ACTIVITY</span>
                </h3>
                <span className="text-[10px] text-orange-400 font-bold">REALTIME FEED</span>
              </div>

              <div className="mt-5 space-y-3">
                {activities.length > 0 ? activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 shadow-lg ${
                          act.type === 'pay_ver'
                            ? 'bg-orange-400 shadow-orange-500/50'
                            : act.type === 'pay_sub'
                            ? 'bg-amber-400 shadow-amber-500/50'
                            : 'bg-yellow-400 shadow-yellow-500/50'
                        }`}
                      />
                      <span className="text-white truncate font-sans">{act.text}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono shrink-0">
                      {act.timestamp}
                    </span>
                  </div>
                )) : (
                  <div className="text-center text-sm text-gray-600 font-sans py-8">
                    No recent activity. Waiting for events...
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 text-[10px] text-gray-600 text-center font-mono tracking-widest mt-6">
              AUTOMATED SECURE AUDITING ENABLED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
