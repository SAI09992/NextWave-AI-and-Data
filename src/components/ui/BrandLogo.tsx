'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface BrandLogoProps {
  variant?: 'navbar' | 'hero' | 'card' | 'footer' | 'icon-only';
  className?: string;
  withLink?: boolean;
}

export function BrandLogo({
  variant = 'navbar',
  className,
  withLink = true,
}: BrandLogoProps) {
  const sizeClasses = {
    navbar: { img: 'w-10 h-10', text: 'text-lg', subtext: 'text-[10px]' },
    hero: { img: 'w-14 h-14', text: 'text-2xl', subtext: 'text-xs' },
    card: { img: 'w-10 h-10', text: 'text-base', subtext: 'text-[10px]' },
    footer: { img: 'w-11 h-11', text: 'text-lg', subtext: 'text-[10px]' },
    'icon-only': { img: 'w-10 h-10', text: '', subtext: '' },
  };

  const current = sizeClasses[variant] || sizeClasses.navbar;

  const content = (
    <div className={cn('flex items-center gap-3 select-none group', className)}>
      <div className={cn('relative shrink-0 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.2)]', current.img)}>
        <img
          src="/alumni-logo.png"
          alt="AKCE KLU KARE Alumni Association"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {variant !== 'icon-only' && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className={cn('font-sans font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors', current.text)}>
              NEXTWAVE <span className="text-cyan-500">AI</span>
            </span>
          </div>
          <span className={cn('hidden sm:block font-mono font-semibold tracking-widest text-gray-500 group-hover:text-cyan-400/80 transition-colors uppercase', current.subtext)}>
            AKCE • KLU • KARE ALUMNI
          </span>
        </div>
      )}
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="inline-block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
