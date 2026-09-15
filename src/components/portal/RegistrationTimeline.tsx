'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Award, ShieldAlert } from 'lucide-react';
import { PaymentStatus, AttendanceData } from '@/types';

interface Props {
  paymentStatus?: PaymentStatus | null;
  attendance?: AttendanceData[];
  hasCertificate?: boolean;
}

export default function RegistrationTimeline({
  paymentStatus,
  attendance = [],
  hasCertificate = false,
}: Props) {
  const isPaymentSubmitted = !!paymentStatus;
  const isPaymentVerified = paymentStatus === 'verified';
  const isPaymentRejected = paymentStatus === 'rejected';

  const day1Present = attendance.some((a) => a.day === 1 && a.status === 'present');
  const day2Present = attendance.some((a) => a.day === 2 && a.status === 'present');
  const isAttendanceCompleted = day1Present && day2Present;

  const timelineSteps = [
    {
      id: 1,
      title: 'Google Account Verified',
      status: 'completed',
      date: 'Identity Authenticated',
    },
    {
      id: 2,
      title: 'Registration Form Submitted',
      status: 'completed',
      date: 'Academic Profile Logged',
    },
    {
      id: 3,
      title: 'Payment Details Submitted',
      status: isPaymentSubmitted ? 'completed' : 'pending',
      date: isPaymentSubmitted ? 'UTR & Receipt Received' : 'Awaiting Submission',
    },
    {
      id: 4,
      title: isPaymentRejected ? 'Payment Rejected' : 'Payment Verification',
      status: isPaymentVerified
        ? 'completed'
        : isPaymentRejected
        ? 'rejected'
        : isPaymentSubmitted
        ? 'in_progress'
        : 'upcoming',
      date: isPaymentVerified
        ? 'Verified by Operations Admin'
        : isPaymentRejected
        ? 'Requires Re-submission'
        : isPaymentSubmitted
        ? 'Under Active Review'
        : 'Pending Step',
    },
    {
      id: 5,
      title: 'Bootcamp Attendance',
      status: isAttendanceCompleted
        ? 'completed'
        : day1Present
        ? 'in_progress'
        : 'upcoming',
      date: isAttendanceCompleted
        ? 'Day 1 & Day 2 Present'
        : day1Present
        ? 'Day 1 Present (Day 2 Pending)'
        : 'QR Scan at Venue',
    },
    {
      id: 6,
      title: 'Certificate Generated',
      status: hasCertificate ? 'completed' : 'upcoming',
      date: hasCertificate ? 'Cryptographic QR Issued' : 'Requires Verified Attendance',
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-gray-900/50 backdrop-blur-md border border-gray-800 font-mono text-xs space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
          <Clock className="w-4 h-4 text-yellow-400" />
          <span>PARTICIPANT LIFECYCLE PROGRESSION</span>
        </h3>
        <span className="text-[11px] text-yellow-500 font-bold">REAL-TIME TIMELINE</span>
      </div>

      <div className="relative pl-6 space-y-6">
        {/* Connecting Vertical Line */}
        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-800" />

        {timelineSteps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isInProgress = step.status === 'in_progress';
          const isRejected = step.status === 'rejected';

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="relative flex items-start gap-4"
            >
              {/* Icon Marker */}
              <div
                className={`absolute -left-[27px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors z-10 ${
                  isDone
                    ? 'bg-orange-950 text-orange-400 border border-orange-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : isInProgress
                    ? 'bg-amber-950 text-amber-400 border border-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : isRejected
                    ? 'bg-red-950 text-red-400 border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                    : 'bg-gray-900 text-gray-600 border border-gray-700'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isRejected ? (
                  <ShieldAlert className="w-3.5 h-3.5" />
                ) : isInProgress ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                ) : (
                  <Circle className="w-2 h-2" />
                )}
              </div>

              <div className="flex-1">
                <div
                  className={`font-bold font-sans text-sm ${
                    isDone
                      ? 'text-white'
                      : isInProgress
                      ? 'text-amber-400'
                      : isRejected
                      ? 'text-red-400'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {step.date}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
