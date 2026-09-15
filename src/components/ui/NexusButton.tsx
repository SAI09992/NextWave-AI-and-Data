'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NexusButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export function NexusButton({
  variant = 'primary',
  size = 'md',
  glow = false,
  loading = false,
  className,
  disabled,
  children,
  ...props
}: NexusButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-mono',
    md: 'px-5 py-2.5 text-sm font-mono',
    lg: 'px-8 py-3.5 text-base font-mono tracking-wide',
  };

  const variantClasses = {
    primary:
      'bg-nexus-primary text-nexus-bg font-bold border border-yellow-300 hover:bg-yellow-300 active:scale-[0.98]',
    secondary:
      'bg-nexus-surface-elevated text-nexus-primary border border-nexus-primary/40 hover:border-nexus-primary hover:bg-nexus-surface-highlight',
    danger:
      'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30 hover:border-red-500',
    outline:
      'bg-transparent text-nexus-text border border-nexus-border hover:border-nexus-primary/60 hover:text-nexus-primary',
    ghost:
      'bg-transparent text-nexus-text-muted hover:text-nexus-primary hover:bg-nexus-surface/50',
  };

  const glowClasses = glow
    ? variant === 'danger'
      ? 'shadow-nexus-glow-danger'
      : 'shadow-nexus-glow hover:shadow-[0_0_35px_-5px_rgba(255,215,0,0.6)]'
    : '';

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-nexus-primary/50',
        sizeClasses[size],
        variantClasses[variant],
        glowClasses,
        className
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  );
}
