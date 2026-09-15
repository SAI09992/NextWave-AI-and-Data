'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AttendanceData } from '@/types';
import { CheckCircle2, Circle, QrCode, Calendar } from 'lucide-react';

interface Props {
  registrationId: string;
  attendance?: AttendanceData[];
  paymentVerified: boolean;
}

export default function AttendanceBadge({
  registrationId,
  attendance = [],
  paymentVerified,
}: Props) {
  const day1Present = attendance.some((a) => a.day === 1 && a.status === 'present');
  const day2Present = attendance.some((a) => a.day === 2 && a.status === 'present');

  return (
    <div className="p-6 rounded-2xl bg-gray-900/50 backdrop-blur-md border border-gray-800 font-mono text-xs space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
          <QrCode className="w-4 h-4 text-yellow-400" />
          <span>ATTENDANCE PASS & QR CODE</span>
        </h3>
        <span className="text-[11px] text-yellow-500 font-bold">DAY 1 & 2</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Attendance QR Pass */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-white text-black shadow-[0_0_15px_rgba(255,215,0,0.2)]">
          {paymentVerified ? (
            <>
              <QRCodeSVG
                value={`NEXTWAVE-ATTENDANCE:${registrationId}`}
                size={140}
                level="M"
                includeMargin
                className="w-36 h-36"
              />
              <span className="text-[10px] font-bold text-slate-800 mt-1 uppercase">
                SHOW AT DESK
              </span>
            </>
          ) : (
            <div className="w-36 h-36 flex flex-col items-center justify-center text-center p-2 text-slate-500 text-xs font-sans font-bold">
              <span>QR UNLOCKED AFTER PAYMENT VERIFICATION</span>
            </div>
          )}
        </div>

        {/* Day 1 & Day 2 Status */}
        <div className="sm:col-span-7 space-y-3">
          {/* Day 1 */}
          <div
            className={`p-3.5 rounded-xl border-2 flex items-center justify-between transition-colors ${
              day1Present
                ? 'bg-orange-950/30 border-orange-500/40 text-orange-400'
                : 'bg-gray-950/50 border-gray-800 text-gray-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4" />
              <div>
                <div className="font-bold font-sans text-xs text-white">DAY 1 ATTENDANCE</div>
                <div className="text-[10px] text-gray-500">Oct 3, 2026 // Seminar Hall</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              {day1Present ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-orange-400" />
                  <span>PRESENT</span>
                </>
              ) : (
                <>
                  <Circle className="w-3.5 h-3.5 text-gray-600" />
                  <span>NOT MARKED</span>
                </>
              )}
            </div>
          </div>

          {/* Day 2 */}
          <div
            className={`p-3.5 rounded-xl border-2 flex items-center justify-between transition-colors ${
              day2Present
                ? 'bg-orange-950/30 border-orange-500/40 text-orange-400'
                : 'bg-gray-950/50 border-gray-800 text-gray-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4" />
              <div>
                <div className="font-bold font-sans text-xs text-white">DAY 2 ATTENDANCE</div>
                <div className="text-[10px] text-gray-500">Oct 4, 2026 // Seminar Hall</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              {day2Present ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-orange-400" />
                  <span>PRESENT</span>
                </>
              ) : (
                <>
                  <Circle className="w-3.5 h-3.5 text-gray-600" />
                  <span>NOT MARKED</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
