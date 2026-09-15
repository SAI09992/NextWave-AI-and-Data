'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Cpu, Activity, Binary, Terminal, Lock } from 'lucide-react';

const modules = [
  {
    day: 'DAY 1 // SENSE & DETECT',
    icon: Activity,
    title: 'SIEM Architecture & Telemetry Pipeline',
    topics: [
      'Enterprise SIEM architecture (Splunk / Elastic Security)',
      'Windows Event Logs & Sysmon Deep Inspection',
      'MITRE ATT&CK Framework TTP Mapping',
      'Real-time Correlation Rule Engineering',
    ],
  },
  {
    day: 'DAY 1 // PACKET FORENSICS',
    icon: Binary,
    title: 'Network Anomaly & C2 Beacon Hunting',
    topics: [
      'Deep Packet Inspection with Wireshark & Zeek',
      'Detecting DNS Tunneling & Covert Exfiltration',
      'TLS Fingerprinting & Malicious JA3 Signatures',
      'Reconstructing Lateral Movement in PCAP streams',
    ],
  },
  {
    day: 'DAY 2 // THREAT HUNTING',
    icon: Cpu,
    title: 'Memory Forensics & EDR Incident Triage',
    topics: [
      'Volatility 3 Framework live memory analysis',
      'Detecting Process Hollowing & DLL Injection',
      'Extracting C2 IP artifacts and decrypting config payloads',
      'Live Endpoint Triage with Velociraptor',
    ],
  },
  {
    day: 'DAY 2 // nexus WAR ROOM',
    icon: Shield,
    title: 'Live Enterprise Ransomware Range Attack',
    topics: [
      'Multi-stage ransomware adversary containment',
      'Isolating infected hosts & stopping domain replication',
      'Generating IOC bulletins & SOC incident timeline reports',
      'Executive debriefing & remediation strategy',
    ],
  },
];

export default function CurriculumSection() {
  return (
    <section id="curriculum" className="py-16 sm:py-24 relative bg-transparent">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nexus-primary/10 border border-nexus-primary/30 text-nexus-primary text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>HANDS-ON SOC LABS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-nexus-text">
            OPERATIONAL BOOTCAMP CURRICULUM
          </h2>
          <p className="text-sm sm:text-base text-nexus-text-muted">
            Battle-tested technical modules designed to bridge academic theory with tier-1 enterprise SOC analyst capabilities.
          </p>
        </div>

        {/* 4 Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className="p-6 rounded-xl nexus-glass border border-nexus-border hover:border-nexus-primary/50 transition-all duration-300 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-nexus-primary tracking-wider">
                    {mod.day}
                  </span>
                  <div className="p-2 rounded-lg bg-nexus-surface border border-nexus-border text-nexus-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg font-bold font-mono text-nexus-text">
                  {mod.title}
                </h3>

                <ul className="space-y-2 text-xs font-mono text-nexus-text-muted">
                  {mod.topics.map((t, tidx) => (
                    <li key={tidx} className="flex items-start gap-2">
                      <span className="text-nexus-primary mt-0.5">›</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
