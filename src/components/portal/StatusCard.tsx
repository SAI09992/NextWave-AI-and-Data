'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { maskUtr, formatDate } from '@/lib/utils';
import { PaymentData } from '@/types';
import { ShieldCheck, Clock, AlertTriangle, ArrowRight, Lock } from 'lucide-react';

interface Props {
  payment?: PaymentData | null;
  registrationId: string;
}

export default function StatusCard({ payment, registrationId }: Props) {
  if (!payment) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gray-900/50 backdrop-blur-md border border-amber-500/40 font-mono text-xs space-y-4 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Clock className="w-5 h-5" />
            <span>PAYMENT PENDING SUBMISSION</span>
          </div>
          <StatusBadge status="pending" />
        </div>

        <p className="text-gray-400 leading-relaxed font-sans">
          Your registration has been created. Please complete your fee payment and submit the transaction UTR reference with screenshot to secure your seat.
        </p>

        <div className="pt-2">
          <Link href={`/register/payment?regId=${registrationId}`}>
            <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold font-sans transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
              <span>SUBMIT PAYMENT NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </motion.div>
    );
  }

  const isVerified = payment.status === 'verified';
  const isPending = payment.status === 'pending';
  const isRejected = payment.status === 'rejected';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl bg-gray-900/50 backdrop-blur-md border font-mono text-xs space-y-4 transition-all duration-500 shadow-xl ${
        isVerified
          ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
          : isRejected
          ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
          : 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          {isVerified ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          ) : isRejected ? (
            <AlertTriangle className="w-5 h-5 text-red-400" />
          ) : (
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
          )}
          <span className="text-sm font-bold text-white tracking-wide">
            PAYMENT STATUS
          </span>
        </div>

        <StatusBadge status={payment.status} />
      </div>

      {/* Verified State Info */}
      {isVerified && (
        <div className="space-y-4 pt-1">
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 leading-relaxed font-sans text-sm">
            ✓ Your payment has been verified. Your bootcamp seat is officially confirmed.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-400">
            <div>
              <span className="text-gray-500 block text-[10px]">AMOUNT VERIFIED:</span>
              <span className="text-white font-bold text-sm">₹{payment.amount}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">MASKED UTR:</span>
              <span className="text-white font-bold">{maskUtr(payment.utr)}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">VERIFIED AT:</span>
              <span className="text-white">{formatDate(payment.verifiedAt)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Pending State Info */}
      {isPending && (
        <div className="space-y-4 pt-1">
          <p className="text-gray-400 leading-relaxed font-sans text-sm">
            Your payment details have been submitted successfully and are awaiting verification by the organizers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-950/50 border border-gray-800 text-gray-400">
            <div>
              <span className="text-gray-500 block text-[10px]">SUBMITTED UTR:</span>
              <span className="text-white font-bold">{maskUtr(payment.utr)}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">SUBMITTED AT:</span>
              <span className="text-white">{formatDate(payment.submittedAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>LIVE SYNC ACTIVE // Dashboard updates immediately upon verification</span>
          </div>
        </div>
      )}

      {/* Rejected State Info — No Resubmit Option */}
      {isRejected && (
        <div className="space-y-4 pt-1">
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/60 text-red-400 text-xs space-y-2">
            <div className="font-bold font-sans text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>PAYMENT VERIFICATION REJECTED</span>
            </div>
            <p className="text-gray-300 font-sans leading-relaxed">
              Reason: <span className="text-red-300 font-bold">{payment.rejectionReason || 'UTR or payment screenshot could not be matched with banking records.'}</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-950/50 border border-gray-800 text-gray-400 text-xs leading-relaxed flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="font-sans">
              <span className="font-bold text-white block mb-1">Re-submission Disabled</span>
              Re-submission of payment details is locked. If you believe this rejection is a mistake or need assistance, please contact the student event coordinators directly.
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
