'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { NexusButton } from '@/components/ui/NexusButton';

interface Props {
  onAccept: () => void;
}

export default function TermsModal({ onAccept }: Props) {
  const [agreements, setAgreements] = useState({
    termsAccepted: false,
    informationAccurate: false,
    paymentVerificationUnderstood: false,
    antiFraudAgreed: false,
    workshopRulesAgreed: false,
  });

  const allAccepted = Object.values(agreements).every(Boolean);

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-2xl mx-auto nexus-glass-glow rounded-2xl p-6 sm:p-8 border border-nexus-border shadow-nexus-card space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-nexus-border">
        <div className="p-2.5 rounded-lg bg-nexus-primary/10 border border-nexus-primary/40 text-nexus-primary">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-mono text-nexus-text">
            TERMS & PARTICIPATION AGREEMENT
          </h2>
          <p className="text-xs font-mono text-nexus-text-muted">
            VERSION 1.0 // CRYPTOGRAPHIC LEGAL RECORD
          </p>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3.5 font-mono text-xs text-nexus-text">
        {[
          {
            key: 'termsAccepted',
            label: 'I have read and agree to the NextWave AI and Data Terms & Conditions.',
          },
          {
            key: 'informationAccurate',
            label: 'I confirm all academic and personal details provided are authentic.',
          },
          {
            key: 'paymentVerificationUnderstood',
            label: 'I understand manual/OCR payment verification is mandatory for admission.',
          },
          {
            key: 'antiFraudAgreed',
            label: 'I understand duplicate, altered, or fraudulent UTR references will be rejected.',
          },
          {
            key: 'workshopRulesAgreed',
            label: 'I agree to comply with workshop conduct rules and nexussecurity range ethics.',
          },
        ].map((item) => {
          const isChecked = agreements[item.key as keyof typeof agreements];
          return (
            <label
              key={item.key}
              onClick={() => toggleAgreement(item.key as keyof typeof agreements)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                isChecked
                  ? 'bg-nexus-primary/10 border-nexus-primary text-nexus-text shadow-nexus-glow-sm'
                  : 'bg-nexus-surface/40 border-nexus-border text-nexus-text-muted hover:border-nexus-primary/40'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}}
                className="mt-0.5 rounded border-nexus-border bg-nexus-bg text-nexus-primary focus:ring-0"
              />
              <span className="leading-relaxed">{item.label}</span>
            </label>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-4 flex items-center justify-between border-t border-nexus-border">
        <span className="text-[11px] font-mono text-nexus-text-dim flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-nexus-primary" />
          Mandatory compliance checks (5/5)
        </span>

        <NexusButton
          variant="primary"
          glow={allAccepted}
          size="md"
          disabled={!allAccepted}
          onClick={onAccept}
          className="gap-2"
        >
          <span>ACCEPT & PROCEED</span>
          <ArrowRight className="w-4 h-4" />
        </NexusButton>
      </div>
    </motion.div>
  );
}
