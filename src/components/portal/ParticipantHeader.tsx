'use client';

import React from 'react';
import Link from 'next/link';
import { RegistrationData } from '@/types';
import { Bell, Calendar, Home, MapPin } from 'lucide-react';
import { NexusButton } from '@/components/ui/NexusButton';

interface Props {
  registration: RegistrationData;
}

export default function ParticipantHeader({ registration }: Props) {
  return (
    <div className="p-6 rounded-2xl bg-gray-900/60 backdrop-blur-md border border-gray-800 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-yellow-950/40 border-2 border-yellow-500/50 flex items-center justify-center text-yellow-400 text-xl font-bold font-sans shadow-[0_0_15px_rgba(255,215,0,0.2)]">
            {registration.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-sans text-white">
                {registration.name}
              </h1>
              <span className="px-2 py-0.5 rounded bg-yellow-950/60 text-yellow-400 border border-yellow-500/30 font-mono text-[10px] font-bold tracking-widest">
                PARTICIPANT
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-gray-500 mt-1">
              <span>{registration.email}</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-yellow-500 font-bold">{registration.registrationId}</span>
            </div>
          </div>
        </div>

        {/* Quick Nav Buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Link href="/portal/updates" className="flex-1 sm:flex-initial">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-950 border border-gray-800 hover:border-yellow-500/50 text-gray-400 hover:text-yellow-400 transition-colors text-xs font-bold font-mono">
              <Bell className="w-4 h-4" />
              <span>UPDATES</span>
            </button>
          </Link>
          <Link href="/portal/schedule" className="flex-1 sm:flex-initial">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-950 border border-gray-800 hover:border-red-500/50 text-gray-400 hover:text-red-400 transition-colors text-xs font-bold font-mono">
              <Calendar className="w-4 h-4" />
              <span>SCHEDULE</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Read-only Cadet Academic Dossier */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 font-mono text-xs">
        <div className="p-3 rounded-xl bg-gray-950/50 border border-gray-800">
          <span className="text-gray-500 block text-[10px]">REGISTER NO:</span>
          <span className="text-white font-bold mt-1 block truncate">
            {registration.registerNumber}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-gray-950/50 border border-gray-800">
          <span className="text-gray-500 block text-[10px]">CREDIT TRACK:</span>
          <span className="text-orange-400 font-bold mt-1 block truncate">
            {registration.creditType === 'UE_CSE' ? 'PE — CSE' : 'UE — OTHER'}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-gray-950/50 border border-gray-800">
          <span className="text-gray-500 block text-[10px]">DEPARTMENT:</span>
          <span className="text-white mt-1 block truncate">
            {registration.department} ({registration.section})
          </span>
        </div>
        <div className="p-3 rounded-xl bg-gray-950/50 border border-gray-800">
          <span className="text-gray-500 block text-[10px]">RESIDENCE:</span>
          <span className="text-white font-bold mt-1 block truncate">
            {registration.residenceType === 'DAY_SCHOLAR' ? 'DAY SCHOLAR' : 'HOSTELLER'}
          </span>
        </div>
        {registration.residenceType === 'HOSTEL' ? (
          <div className="p-3 rounded-xl bg-gray-950/50 border border-gray-800">
            <span className="text-gray-500 block text-[10px]">HOSTEL DETAILS:</span>
            <span className="text-white mt-1 block truncate">
              {registration.hostelName} - {registration.roomNumber}
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-gray-950/50 border border-gray-800">
            <span className="text-gray-500 block text-[10px]">INSTITUTION:</span>
            <span className="text-white mt-1 block truncate">
              {registration.college}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
